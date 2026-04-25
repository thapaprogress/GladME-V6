import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ChevronDown, ChevronRight, Settings, Plus, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, FileNode } from '../types';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

interface AIChatProps {
  activeFile: FileNode | null;
  files: FileNode[];
  onCodeUpdate?: (id: string, content: string) => void;
  onAIWorkingChange?: (isWorking: boolean) => void;
  onCreateFile?: (parentId: string, name: string, content: string) => void;
  onMkdir?: (parentId: string, name: string) => void;
  onDeleteFile?: (id: string) => void;
}

const updateFileTool: FunctionDeclaration = {
  name: "update_file",
  description: "Updates the content of the currently active file.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      content: {
        type: Type.STRING,
        description: "The new content for the file.",
      },
      explanation: {
        type: Type.STRING,
        description: "A brief explanation of what was changed.",
      }
    },
    required: ["content", "explanation"],
  },
};

const mkdirTool: FunctionDeclaration = {
  name: "mkdir",
  description: "Creates a new folder in the workspace.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      parentId: {
        type: Type.STRING,
        description: "The ID of the parent folder. Use 'root' for the root directory.",
      },
      name: {
        type: Type.STRING,
        description: "The name of the new folder.",
      }
    },
    required: ["parentId", "name"],
  },
};

const createFileTool: FunctionDeclaration = {
  name: "create_file",
  description: "Creates a new file in the workspace.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      parentId: {
        type: Type.STRING,
        description: "The ID of the parent folder. Use 'root' for the root directory.",
      },
      name: {
        type: Type.STRING,
        description: "The name of the new file.",
      },
      content: {
        type: Type.STRING,
        description: "The initial content of the file.",
      }
    },
    required: ["parentId", "name", "content"],
  },
};

export const AIChat: React.FC<AIChatProps> = ({ 
  activeFile, 
  files,
  onCodeUpdate, 
  onAIWorkingChange,
  onCreateFile,
  onMkdir,
  onDeleteFile
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking, thoughts]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsThinking(true);
    onAIWorkingChange?.(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.get('gemini-3-flash-preview');
      
      // PROJECT AWARENESS: Map the current structure for the AI
      const fileTreeStr = JSON.stringify(files.map(f => ({ 
        id: f.id, 
        name: f.name, 
        type: f.type, 
        parentId: f.parentId || 'root' 
      })), null, 2);

      // --- 🧭 PHASE 1: PLANNER (Architect) ---
      setThoughts(['🧭 Planner: Analyzing workspace & planning steps...']);
      const planPrompt = `
        You are a senior software architect (Planner Agent).
        
        User Request: "${input}"
        
        Project Structure:
        ${fileTreeStr}

        Your job:
        1. Understand user intent.
        2. Break the task into structured steps.
        3. Decide exactly which files/folders to create or modify.
        
        Rules:
        - Output ONLY a JSON plan.
        - Use existing folder IDs if they match the path.
        - Steps should be logical (folders before files).
        
        Plan Format:
        {
          "goal": "Brief summary",
          "steps": [
            { "action": "mkdir", "parentId": "root_or_id", "name": "folder_name" },
            { "action": "create_file", "parentId": "id", "name": "file.js", "content": "initial code" },
            { "action": "update_file", "id": "id", "description": "Update existing file" }
          ]
        }
      `;
      const planResponse = await model.generateContent(planPrompt);
      const plan = planResponse.text || '{}';
      setThoughts(prev => [...prev, '🧭 Plan finalized. Building...']);

      // --- 💻 PHASE 2: CODER (Executor) ---
      setThoughts(prev => [...prev, '💻 Coder: Generating code and calling tools...']);
      const coderPrompt = `
        You are a Coding Agent with full filesystem access.
        
        Execution Plan:
        ${plan}
        
        Your job:
        - Execute every step in the plan.
        - Use tools (mkdir, create_file, update_file).
        - Write high-quality, production-ready code.
        
        Context:
        Active File: ${activeFile?.name || 'None'}
        Active Content: ${activeFile?.content || ''}
      `;

      const coderResponse = await model.generateContent({
        contents: coderPrompt,
        config: {
          tools: [{ functionDeclarations: [updateFileTool, mkdirTool, createFileTool] }]
        }
      });

      const functionCalls = coderResponse.functionCalls;
      let coderFeedback = coderResponse.text || '';

      if (functionCalls && functionCalls.length > 0) {
        for (const call of functionCalls) {
          if (call.name === 'update_file') {
            const { content, explanation } = call.args as any;
            onCodeUpdate?.(activeFile?.id || '', content);
            setThoughts(prev => [...prev, `💻 Refactoring ${activeFile?.name}...`]);
          } else if (call.name === 'mkdir') {
            const { parentId, name } = call.args as any;
            onMkdir?.(parentId || 'root', name);
            setThoughts(prev => [...prev, `💻 Creating folder "${name}"...`]);
          } else if (call.name === 'create_file') {
            const { parentId, name, content } = call.args as any;
            onCreateFile?.(parentId || 'root', name, content);
            setThoughts(prev => [...prev, `💻 Synthesizing file "${name}"...`]);
          }
        }
      }

      // --- 🔍 PHASE 3: REVIEWER (Audit) ---
      setThoughts(prev => [...prev, '🔍 Reviewer: Auditing code quality...']);
      const reviewerPrompt = `
        You are a strict Code Reviewer.
        
        Original Plan: ${plan}
        Coder Output/Actions: ${coderFeedback}
        
        Check:
        1. File structure correctness.
        2. Code quality and meaningful content.
        3. Logical consistency.
        
        If perfect, respond: APPROVED
        Otherwise, provide specific improvement suggestions.
      `;
      const reviewResponse = await model.generateContent(reviewerPrompt);
      const reviewResult = reviewResponse.text || '';

      const isApproved = reviewResult.includes('APPROVED');
      if (isApproved) {
        setThoughts(prev => [...prev, '🔍 APPROVED: Validated against plan.']);
      } else {
        setThoughts(prev => [...prev, '🔍 REJECTED: Logic errors detected.']);
      }

      const finalMessage: ChatMessage = {
        role: 'assistant',
        content: isApproved 
          ? `Pipeline successful. All tasks verified.\n\n${coderFeedback}`
          : `Tasks executed but Reviewer flagged issues:\n\n${reviewResult}\n\n${coderFeedback}`,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, finalMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Pipeline interrupted. System reset recommended.', timestamp: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
      setThoughts([]);
      onAIWorkingChange?.(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] border-l border-[#2b2b2b] relative">
      {/* Header */}
      <div className="h-9 px-4 border-b border-[#2b2b2b] flex items-center justify-between bg-[#181818]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-300">Integrating Jarvis Workflow Systems</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <Plus size={14} className="cursor-pointer hover:text-white" />
          <Settings size={14} className="cursor-pointer hover:text-white" />
          <X size={14} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
        {messages.length === 0 && (
          <div className="p-4 bg-[#1a1a1a] border border-[#2b2b2b] rounded-md text-[13px] leading-relaxed text-zinc-300">
             Welcome to Antigravity AI. How can I help you build today?
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
             <div className="flex items-center gap-2 text-[10px] text-zinc-500 px-1">
                {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                <span>{msg.role === 'user' ? 'You' : 'Antigravity'}</span>
             </div>
             <div className={`max-w-[100%] p-3 rounded-lg text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100' : 'bg-[#1a1a1a] border border-[#2b2b2b] text-zinc-300'}`}>
                {msg.content}
             </div>
          </div>
        ))}

        {isThinking && (
          <div className="space-y-2">
             <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                <Loader2 size={12} className="animate-spin text-blue-400" />
                <span>AI is thinking...</span>
             </div>
             {thoughts.map((thought, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={idx} 
                  className="flex items-center gap-2 text-[12px] text-zinc-500 ml-4"
                >
                  <ChevronRight size={12} />
                  <span>{thought}</span>
                </motion.div>
             ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#2b2b2b] bg-[#0d0d0d]">
        <div className="flex items-center gap-2 text-[11px] mb-2 text-zinc-600">
           <ChevronRight size={12} />
           <span>0 Files With Changes</span>
           <span className="ml-auto flex items-center gap-1 hover:text-zinc-400 cursor-pointer"><Settings size={10} /> Review Changes</span>
        </div>
        <div className="relative bg-[#1a1a1a] rounded-lg border border-[#3c3c3c] focus-within:border-zinc-500 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything, @ to mention, / to commands"
            className="w-full bg-transparent border-none p-3 pr-10 text-[13px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-none min-h-[50px]"
          />
          <div className="absolute right-2 bottom-2 text-zinc-600">
            <Send size={16} className="cursor-pointer hover:text-white" onClick={handleSend} />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] font-medium">
          <div className="flex items-center gap-3 text-zinc-500">
             <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-300"><Plus size={12} /> Gemini 3 Flash</div>
             <div className="flex items-center gap-1 text-orange-400 cursor-pointer"><AlertTriangle size={12} /> MCP Error</div>
          </div>
        </div>
      </div>
    </div>
  );
};
