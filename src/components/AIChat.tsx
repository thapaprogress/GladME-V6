import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, ChevronDown, ChevronRight, Settings, Plus, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, FileNode } from '../types';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';

interface AIChatProps {
  activeFile: FileNode | null;
  onCodeUpdate?: (id: string, content: string) => void;
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

export const AIChat: React.FC<AIChatProps> = ({ activeFile, onCodeUpdate }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

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

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
        You are "Antigravity AI", a state-of-the-art agentic coding assistant connected to an IDE.
        Context:
        File: ${activeFile?.name || 'Workspace'}
        Language: ${activeFile?.language || 'Unknown'}
        Current Content:
        ${activeFile?.content || ''}
        
        Guidelines:
        1. If the user asks for a code change, use the 'update_file' tool.
        2. If you use the tool, provide a clear explanation in the 'explanation' field.
        3. For chat responses, be technical but punchy.
        
        Question: ${input}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ functionDeclarations: [updateFileTool] }]
        }
      });

      const functionCalls = response.functionCalls;
      let assistantContent = response.text || '';

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        if (call.name === 'update_file') {
          const { content, explanation } = call.args as any;
          if (activeFile && onCodeUpdate) {
            onCodeUpdate(activeFile.id, content);
          }
          assistantContent = explanation;
        }
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantContent || "Request processed.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection issue. Please try again.', timestamp: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
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
        <div className="p-4 bg-[#1a1a1a] border border-[#2b2b2b] rounded-md text-[13px] leading-relaxed text-zinc-300">
           start training, and fix all the errors and use cuda and update mempalace and use caveman
        </div>

        <div className="space-y-2">
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronDown size={14} className="group-hover:text-blue-400" />
              <span>Thought for 2s</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Ran <span className="text-zinc-300">nvidia-smi</span></span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Explored 1 file</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Ran <span className="text-zinc-300">dir /s /b *.json</span></span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Explored 1 file, 2 folders</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Ran <span className="text-zinc-300">rfdetr --help</span></span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Checked command status</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Edited 1 file</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Ran <span className="text-zinc-300">python prepare_synthetic_data.py</span></span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronRight size={14} />
              <span>Checked command status</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-300 cursor-pointer group">
              <ChevronDown size={14} className="text-blue-400" />
              <span>Thought for 1s</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-300 font-bold ml-6">
              Analyzing <span className="text-emerald-500 underline">config.py</span> #L150-250
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 ml-6">
              Searched class RFDETRNanoConfig <span className="px-1 bg-zinc-800 rounded text-[10px]">2 results</span>
           </div>
           <div className="flex items-center gap-2 text-[12px] text-zinc-500 py-4 italic animate-pulse">
              Generating..
           </div>
        </div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
             <div className={`max-w-[90%] p-3 rounded-lg text-[13px] ${msg.role === 'user' ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100' : 'bg-[#1a1a1a] border border-[#2b2b2b] text-zinc-300'}`}>
                {msg.content}
             </div>
          </div>
        ))}
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
