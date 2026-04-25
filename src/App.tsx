import { useState, useCallback, useEffect } from 'react';
import { FileExplorer } from './components/FileExplorer';
import { Editor } from './components/Editor';
import { AIChat } from './components/AIChat';
import { SearchSidebar } from './components/SearchSidebar';
import { GitSidebar } from './components/GitSidebar';
import { FileNode } from './types';
import { 
  Terminal, 
  Settings, 
  Code2, 
  Search, 
  GitBranch, 
  Plus,
  X,
  Monitor,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type SidebarView = 'explorer' | 'search' | 'git';

const INITIAL_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'Rf-Detr',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: 'src',
        name: 'src',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'model-py',
            name: 'model.py',
            type: 'file',
            language: 'python',
            content: `import torch
import torch.nn as nn

class RFDetr(nn.Module):
    def __init__(self, num_classes=80):
        super().__init__()
        self.backbone = nn.Sequential(
            nn.Conv2d(3, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2)
        )
        self.transformer = nn.Transformer(d_model=64)
        self.head = nn.Linear(64, num_classes + 4)

    def forward(self, x):
        features = self.backbone(x)
        # RF-DETR specific logic
        return self.head(features)`,
          },
          {
            id: 'train-py',
            name: 'train.py',
            type: 'file',
            language: 'python',
            content: `def train_epoch(model, loader, optimizer):
    model.train()
    for images, targets in loader:
        optimizer.zero_grad()
        loss = model(images, targets)
        loss.backward()
        optimizer.step()
        print(f"Loss: {loss.item()}")`,
          }
        ]
      },
      {
        id: 'config',
        name: 'config',
        type: 'folder',
        isOpen: false,
        children: [
          {
            id: 'base-yaml',
            name: 'base.yaml',
            type: 'file',
            language: 'yaml',
            content: `model:
  name: rf_detr_nano
  backbone: resnet18
  num_classes: 80

training:
  epochs: 300
  batch_size: 16
  lr: 0.001`,
          }
        ]
      },
      {
        id: 'ai-agent-system',
        name: 'ai-agent-system',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'agents-folder',
            name: 'agents',
            type: 'folder',
            children: [
              { id: 'planner-py', name: 'planner.py', type: 'file', language: 'python', content: '' },
              { id: 'coder-py', name: 'coder.py', type: 'file', language: 'python', content: '' },
              { id: 'reviewer-py', name: 'reviewer.py', type: 'file', language: 'python', content: '' },
            ]
          },
          {
            id: 'mcp-folder',
            name: 'mcp',
            type: 'folder',
            children: [
              { id: 'mcp-server-py', name: 'server.py', type: 'file', language: 'python', content: '' },
              { id: 'mcp-client-py', name: 'client.py', type: 'file', language: 'python', content: '' },
              { id: 'mcp-registry-py', name: 'registry.py', type: 'file', language: 'python', content: '' },
              {
                id: 'skills-folder',
                name: 'skills',
                type: 'folder',
                children: [
                  { id: 'skills-registry-json', name: 'registry.json', type: 'file', language: 'json', content: '' },
                  { id: 'skills-router-py', name: 'router.py', type: 'file', language: 'python', content: '' },
                ]
              }
            ]
          },
          {
            id: 'ui-folder',
            name: 'ui',
            type: 'folder',
            children: [
              { id: 'mcp-manager-py', name: 'mcp_manager.py', type: 'file', language: 'python', content: '' },
              { id: 'skill-manager-py', name: 'skill_manager.py', type: 'file', language: 'python', content: '' },
            ]
          },
          {
            id: 'core-folder',
            name: 'core',
            type: 'folder',
            children: [
              { id: 'orchestrator-py', name: 'orchestrator.py', type: 'file', language: 'python', content: '' },
              { id: 'memory-py', name: 'memory.py', type: 'file', language: 'python', content: '' },
            ]
          },
          {
            id: 'main-py',
            name: 'main.py',
            type: 'file',
            language: 'python',
            content: ''
          },
          {
            id: 'requirements-txt',
            name: 'requirements.txt',
            type: 'file',
            language: 'text',
            content: 'fastapi\nuvicorn\npydantic\nrequests'
          }
        ]
      },
      {
        id: 'instruction',
        name: 'instruction',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'instr-readme',
            name: 'README.md',
            type: 'file',
            language: 'markdown',
            content: `# Instruction Manual\n\nWelcome to the RF-DETR instruction folder. Here you will find guides on how to use the system.`,
          },
          {
            id: 'instr-guide',
            name: 'guide.md',
            type: 'file',
            language: 'markdown',
            content: `# Getting Started Guide\n\n1. Prepare your dataset.\n2. Configure the model in \`config/base.yaml\`.\n3. Run \`python src/train.py\` to start training.`,
          }
        ]
      },
      {
        id: 'docs',
        name: 'docs',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: 'tutorials',
            name: 'tutorials',
            type: 'folder',
            isOpen: true,
            children: [
              {
                id: 'index-md',
                name: 'index.md',
                type: 'file',
                language: 'markdown',
                content: `# Tutorials\n\nRead more about the state-of-the-art RF-DETR Nano, Small, and Medium models we released in July 2025.\n\n[:octicons-arrow-right-24: Learn more](https://blog.roboflow.com/rf-detr-nano-small-medium/)\n\n- **RF-DETR: How to Train SOTA for Object Detection on a Custom Dataset [video]**\n\n---\n\n![ ](https://i.ytimg.com/vi/-OvpdLAE1FA/maxresdefault.jpg)\n\nLearn how to train an RF-DETR model on a custom dataset.\n\n[:octicons-arrow-right-24: Watch the video](https://www.youtube.com/watch?v=-OvpdLAE1FA)\n\n- **How to Train RF-DETR on a Custom Dataset [article]**\n\n---\n\n![ ](https://blog.roboflow.com/content/images/size/w1000/format/webp/2025/03/img-blog-how-to-send-slack-notification-workflows-v4-1.png)\n\nLearn how to train an RF-DETR model on a custom dataset.\n\n[:octicons-arrow-right-24: Read the guide](https://blog.roboflow.com/train-rf-detr-on-a-custom-dataset/)\n\n- **Deploy RF-DETR on iOS [tutorial & example application]**\n\n---\n\n![ ](https://blog.roboflow.com/content/images/size/w1000/format/webp/2025/07/img-blog-deep-learning-solves-frustrations--5--min.png)`,
              }
            ]
          }
        ]
      },
      {
        id: 'readme-md',
        name: 'README.md',
        type: 'file',
        language: 'markdown',
        content: `# RF-DETR\n\nReal-time Flexible Detection Transformer. Official implementation.`,
      }
    ],
  },
];

export default function App() {
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState<string | null>('index-md');
  const [openFileIds, setOpenFileIds] = useState<string[]>(['index-md']);
  const [sidebarView, setSidebarView] = useState<SidebarView>('explorer');
  const [activeBottomTab, setActiveBottomTab] = useState<string>('Terminal');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(true);
  const [isAIWorking, setIsAIWorking] = useState(false);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  const menuData: Record<string, { label: string; action?: () => void; shortcut?: string }[]> = {
    'File': [
      { label: 'New File', shortcut: 'Ctrl+N' },
      { label: 'Save', shortcut: 'Ctrl+S', action: () => console.log('Saving...') },
      { label: 'Open Folder...', shortcut: 'Ctrl+Shift+O' },
      { label: 'Exit' },
    ],
    'Edit': [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y' },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
    ],
    'Selection': [
      { label: 'Select All', shortcut: 'Ctrl+A' },
      { label: 'Expand Selection', shortcut: 'Alt+Shift+Right' },
    ],
    'View': [
      { label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: () => setIsSidebarOpen(!isSidebarOpen) },
      { label: 'Toggle Panel', shortcut: 'Ctrl+J', action: () => setIsTerminalOpen(!isTerminalOpen) },
      { label: 'Toggle Agent Chat', action: () => setIsAIChatOpen(!isAIChatOpen) },
      { label: 'Appearance' },
    ],
    'Go': [
      { label: 'Go to File...', shortcut: 'Ctrl+P', action: () => setIsCommandPaletteOpen(true) },
      { label: 'Go to Symbol', shortcut: 'Ctrl+Shift+O' },
    ],
    'Run': [
      { label: 'Start Debugging', shortcut: 'F5' },
      { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
    ],
    'Terminal': [
      { 
        label: 'New Terminal', 
        shortcut: 'Ctrl+Shift+`',
        action: () => {
          setIsTerminalOpen(true);
          setActiveBottomTab('Terminal');
        }
      },
      { label: 'Split Terminal', shortcut: 'Ctrl+Shift+5' },
    ],
    'Help': [
      { label: 'Welcome' },
      { label: 'Documentation' },
      { label: 'About' },
    ],
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleMenuItemClick = (action?: () => void) => {
    if (action) action();
    setActiveMenu(null);
  };

  const findFile = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFileSelect = useCallback((file: FileNode) => {
    setActiveFileId(file.id);
    if (!openFileIds.includes(file.id)) {
      setOpenFileIds(prev => [...prev, file.id]);
    }
  }, [openFileIds]);

  const handleCreateFile = useCallback((parentId: string, name: string, content: string = '') => {
    const newFile: FileNode = {
      id: Math.random().toString(36).substring(7),
      name,
      type: 'file',
      language: name.split('.').pop() || 'text',
      content
    };

    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, children: [...(node.children || []), newFile], isOpen: true };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };

    setFiles(prev => updateNodes(prev));
    handleFileSelect(newFile);
  }, [handleFileSelect]);

  const handleMkdir = useCallback((parentId: string, name: string) => {
    const newFolder: FileNode = {
      id: Math.random().toString(36).substring(7),
      name,
      type: 'folder',
      isOpen: true,
      children: []
    };

    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return { ...node, children: [...(node.children || []), newFolder], isOpen: true };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };

    setFiles(prev => updateNodes(prev));
  }, []);

  const handleDeleteFile = useCallback((id: string) => {
    const deleteFromNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter(node => node.id !== id)
        .map(node => ({
          ...node,
          children: node.children ? deleteFromNodes(node.children) : undefined
        }));
    };
    setFiles(prev => deleteFromNodes(prev));
    setOpenFileIds(prev => prev.filter(fid => fid !== id));
    if (activeFileId === id) setActiveFileId(null);
  }, [activeFileId]);

  const handleCloseFile = useCallback((id: string) => {
    setOpenFileIds(prev => {
      const next = prev.filter(fid => fid !== id);
      if (activeFileId === id && next.length > 0) {
        setActiveFileId(next[next.length - 1]);
      } else if (next.length === 0) {
        setActiveFileId(null);
      }
      return next;
    });
  }, [activeFileId]);

  const handleContentChange = useCallback((id: string, content: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === id) return { ...node, content };
        if (node.children) return { ...node, children: updateNodes(node.children) };
        return node;
      });
    };
    setFiles((prev) => updateNodes(prev));
  }, []);

  const activeFile = activeFileId ? findFile(files, activeFileId) : null;
  const openFiles = openFileIds.map(id => findFile(files, id)).filter((f): f is FileNode => f !== null);

  return (
    <div className="h-screen w-screen bg-[#0d0d0d] text-zinc-300 flex flex-col font-sans overflow-hidden select-none relative">
      {isAIWorking && (
        <div className="absolute inset-0 pointer-events-none z-[100] border-2 border-blue-500/20 animate-pulse">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
        </div>
      )}
      {/* 1. TOP MENU BAR */}
      <div 
        className="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center px-1 justify-between z-[60]"
        onMouseLeave={() => activeMenu && setActiveMenu(null)}
      >
        <div className="flex items-center gap-1">
          {Object.keys(menuData).map(item => (
            <div key={item} className="relative">
              <div 
                className={`px-2 py-1 rounded-md transition-colors cursor-pointer text-[12px] ${activeMenu === item ? 'bg-[#2a2d2e] text-white' : 'text-zinc-400 hover:text-white'}`}
                onClick={() => handleMenuClick(item)}
              >
                {item}
              </div>
              
              <AnimatePresence>
                {activeMenu === item && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full left-0 mt-1 min-w-[220px] bg-[#1a1a1a] border border-[#2b2b2b] rounded-md shadow-2xl z-[70] p-1"
                  >
                    {menuData[item].map((subItem, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 hover:bg-[#007acc] hover:text-white rounded text-[12px] text-zinc-300 cursor-pointer group"
                        onClick={() => handleMenuItemClick(subItem.action)}
                      >
                        <span>{subItem.label}</span>
                        {subItem.shortcut && (
                          <span className="text-[10px] text-zinc-500 group-hover:text-white/60 ml-8">{subItem.shortcut}</span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex-1 flex justify-center px-20">
          <div 
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full max-w-xl h-6 bg-[#2a2d2e] border border-[#3c3c3c] rounded-md flex items-center px-4 gap-2 text-zinc-400 group hover:bg-[#323637] transition-all cursor-pointer"
          >
            <Search size={12} />
            <span className="text-[12px] truncate">{activeFile ? `Rf-Detr - Antigravity - ${activeFile.name}` : 'No file selected'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pr-2">
          <div 
            onClick={() => setIsAIChatOpen(!isAIChatOpen)}
            className={`flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${isAIChatOpen ? 'bg-[#007acc] border-[#007acc] text-white hover:bg-[#1a8ad4]' : 'bg-[#2a2d2e] border-[#3c3c3c] text-zinc-300 hover:bg-[#323637]'}`}
          >
            <span className="font-bold">Open Agent Manager</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="p-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer text-zinc-500 hover:text-white"><Terminal size={14}/></div>
            <div className="p-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer text-zinc-500 hover:text-white"><Monitor size={14}/></div>
            <div className="p-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer text-zinc-500 hover:text-white"><GitBranch size={14}/></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 2. LEFT ACTIVITY BAR */}
        <div className="w-12 bg-[#181818] border-r border-[#2b2b2b] flex flex-col items-center py-4 gap-4">
          <div 
            onClick={() => {
              if (sidebarView === 'explorer' && isSidebarOpen) {
                setIsSidebarOpen(false);
              } else {
                setSidebarView('explorer');
                setIsSidebarOpen(true);
              }
            }}
            className={`p-2 cursor-pointer transition-all border-l-2 ${sidebarView === 'explorer' && isSidebarOpen ? 'text-white border-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <div className="relative">
              <Code2 size={24} />
              <div className="absolute -top-1 -right-1 bg-[#007acc] text-[9px] text-white font-bold px-1 rounded-full border border-black">113</div>
            </div>
          </div>
          <div 
            onClick={() => {
              if (sidebarView === 'search' && isSidebarOpen) {
                setIsSidebarOpen(false);
              } else {
                setSidebarView('search');
                setIsSidebarOpen(true);
              }
            }}
            className={`p-2 cursor-pointer transition-all border-l-2 ${sidebarView === 'search' && isSidebarOpen ? 'text-white border-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <Search size={24} />
          </div>
          <div 
            onClick={() => {
              if (sidebarView === 'git' && isSidebarOpen) {
                setIsSidebarOpen(false);
              } else {
                setSidebarView('git');
                setIsSidebarOpen(true);
              }
            }}
            className={`p-2 cursor-pointer transition-all border-l-2 ${sidebarView === 'git' && isSidebarOpen ? 'text-white border-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <GitBranch size={24} />
          </div>
          <div className="mt-auto flex flex-col gap-4">
             <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer"><Monitor size={20} /></div>
             <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer" onClick={() => setIsAIChatOpen(!isAIChatOpen)}><Settings size={20} /></div>
          </div>
        </div>

        {/* 3. SIDEBAR */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-[#181818] border-r border-[#2b2b2b] flex flex-col overflow-hidden"
            >
              <div className="h-9 px-4 flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-zinc-500 whitespace-nowrap">
                {sidebarView === 'explorer' ? 'Explorer' : sidebarView === 'search' ? 'Search' : 'Source Control'}
                <Settings size={12} className="cursor-pointer" />
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {sidebarView === 'explorer' && <FileExplorer files={files} onFileSelect={handleFileSelect} activeFileId={activeFileId || undefined} />}
                {sidebarView === 'search' && <SearchSidebar files={files} onFileSelect={handleFileSelect} />}
                {sidebarView === 'git' && <GitSidebar />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. MAIN EDITOR & PANEL */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-[2] flex flex-col min-h-0">
            <Editor 
              activeFile={activeFile} 
              openFiles={openFiles} 
              onCloseFile={handleCloseFile} 
              onFileSelect={handleFileSelect} 
              onContentChange={handleContentChange} 
            />
          </div>

          {/* 5. BOTTOM PANEL */}
          <AnimatePresence initial={false}>
            {isTerminalOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 250, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[#0d0d0d] border-t border-[#2b2b2b] flex flex-col overflow-hidden"
              >
                 <div className="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center px-4 gap-6 shrink-0">
                    {['Problems', 'Output', 'Debug Console', 'Terminal', 'Ports'].map(tab => (
                      <div 
                        key={tab} 
                        onClick={() => setActiveBottomTab(tab)}
                        className={`text-[11px] cursor-pointer hover:text-white transition-colors h-full flex items-center border-b-2 ${activeBottomTab === tab ? 'border-white text-white font-bold' : 'border-transparent text-zinc-500'}`}
                      >
                        {tab}
                      </div>
                    ))}
                    <div className="ml-auto flex items-center gap-3 text-zinc-500">
                      <div className="p-1 hover:bg-zinc-800 rounded cursor-pointer" onClick={() => setActiveBottomTab('Terminal')}><Plus size={14} /></div>
                      <div className="p-1 hover:bg-zinc-800 rounded cursor-pointer" onClick={() => setIsTerminalOpen(false)}><X size={14} /></div>
                    </div>
                 </div>
                 
                 <div className="flex-1 p-4 flex gap-4 overflow-hidden">
                    <div className="flex-1 bg-[#121212] rounded-lg border border-[#2b2b2b] p-4 font-mono text-[12px] flex flex-col gap-3 overflow-y-auto custom-scrollbar">
                       {activeBottomTab === 'Terminal' ? (
                         <>
                           <div className="p-4 bg-[#1a1a1a] border border-white/5 rounded-md text-zinc-400 leading-relaxed max-w-2xl">
                              Insufficient balance. Manage your billing here: <span className="text-blue-400 underline cursor-pointer">https://opencode.ai/workspace/billing</span>
                           </div>
                           
                           <div className="mt-auto space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-sm bg-orange-500 flex items-center justify-center text-[10px] font-bold text-white">P</div>
                                <span className="text-zinc-500">Plan • DeepSeek V4 Pro</span>
                              </div>
                              <div className="flex items-center gap-3">
                                 <div className="w-1.5 h-4 bg-orange-500 rounded-full" />
                                 <span className="text-zinc-300">Plan • DeepSeek V4 Pro</span>
                                 <span className="text-zinc-600">OpenCode Go</span>
                              </div>
                           </div>
                         </>
                       ) : (
                         <div className="flex items-center justify-center h-full text-zinc-600 italic">
                            No {activeBottomTab.toLowerCase()} to display...
                         </div>
                       )}
                    </div>

                    <div className="w-52 bg-[#121212] rounded-lg border border-[#2b2b2b] flex flex-col overflow-hidden">
                       <div className="p-2 border-b border-[#2b2b2b] bg-[#1a1a1a] flex items-center gap-2 text-[11px] font-bold text-zinc-400">
                          <Terminal size={12} /> powershell
                       </div>
                       <div className="p-3">
                          <div className="bg-[#2a2d2e] px-3 py-1.5 rounded-md text-[12px] text-zinc-200 cursor-pointer hover:bg-blue-600/20 hover:text-blue-400 transition-all border border-white/5">
                            opencode
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 6. RIGHT SIDEBAR (Agent Manager) */}
        {isAIChatOpen && (
          <div className="w-[420px] bg-[#181818] border-l border-[#2b2b2b] flex flex-col">
            <AIChat 
              activeFile={activeFile} 
              onCodeUpdate={handleContentChange} 
              onAIWorkingChange={setIsAIWorking}
              onCreateFile={handleCreateFile}
              onMkdir={handleMkdir}
              onDeleteFile={handleDeleteFile}
              files={files}
            />
          </div>
        )}
      </div>

      {/* 7. STATUS BAR */}
      <div className="h-6 bg-[#007acc] text-white flex items-center px-4 justify-between text-[11px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <GitBranch size={12} />
            <span>main*</span>
          </div>
          <div className="flex items-center gap-3 opacity-80">
            <div className="flex items-center gap-1"><RotateCcw size={12} /> 0</div>
            <div className="flex items-center gap-1"><Monitor size={12} /> 0</div>
          </div>
        </div>
        <div className="flex items-center gap-4 opacity-90">
          <span>Ln 14, Col 12</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <CheckCircle2 size={12} />
        </div>
      </div>
    </div>
  );
}
