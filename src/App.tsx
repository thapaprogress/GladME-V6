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

  const menuItems = ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    <div className="h-screen w-screen bg-[#0d0d0d] text-zinc-300 flex flex-col font-sans overflow-hidden select-none">
      {/* 1. TOP MENU BAR */}
      <div className="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center px-2 justify-between z-[60]">
        <div className="flex items-center gap-1">
          {menuItems.map(item => (
            <div 
              key={item} 
              className="px-2 py-1 hover:bg-[#2a2d2e] rounded-md transition-colors cursor-pointer text-[12px] text-zinc-400 hover:text-white"
              onClick={() => console.log(`${item} menu clicked`)}
            >
              {item}
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
            onClick={() => setSidebarView('explorer')}
            className={`p-2 cursor-pointer transition-all border-l-2 ${sidebarView === 'explorer' ? 'text-white border-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <div className="relative">
              <Code2 size={24} />
              <div className="absolute -top-1 -right-1 bg-[#007acc] text-[9px] text-white font-bold px-1 rounded-full border border-black">113</div>
            </div>
          </div>
          <div 
            onClick={() => setSidebarView('search')}
            className={`p-2 cursor-pointer transition-all border-l-2 ${sidebarView === 'search' ? 'text-white border-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <Search size={24} />
          </div>
          <div 
            onClick={() => setSidebarView('git')}
            className={`p-2 cursor-pointer transition-all border-l-2 ${sidebarView === 'git' ? 'text-white border-white' : 'text-zinc-500 hover:text-zinc-300 border-transparent'}`}
          >
            <GitBranch size={24} />
          </div>
          <div className="mt-auto flex flex-col gap-4">
             <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer"><Monitor size={20} /></div>
             <div className="p-2 text-zinc-500 hover:text-zinc-300 cursor-pointer" onClick={() => setIsAIChatOpen(!isAIChatOpen)}><Settings size={20} /></div>
          </div>
        </div>

        {/* 3. SIDEBAR */}
        <div className="w-64 bg-[#181818] border-r border-[#2b2b2b] flex flex-col">
          <div className="h-9 px-4 flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-zinc-500">
            {sidebarView === 'explorer' ? 'Explorer' : sidebarView === 'search' ? 'Search' : 'Source Control'}
            <Settings size={12} className="cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {sidebarView === 'explorer' && <FileExplorer files={files} onFileSelect={handleFileSelect} activeFileId={activeFileId || undefined} />}
            {sidebarView === 'search' && <SearchSidebar files={files} onFileSelect={handleFileSelect} />}
            {sidebarView === 'git' && <GitSidebar />}
          </div>
        </div>

        {/* 4. MAIN EDITOR & PANEL */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-[2] flex flex-col">
            <Editor 
              activeFile={activeFile} 
              openFiles={openFiles} 
              onCloseFile={handleCloseFile} 
              onFileSelect={handleFileSelect} 
              onContentChange={handleContentChange} 
            />
          </div>

          {/* 5. BOTTOM PANEL */}
          <div className="flex-1 min-h-[250px] bg-[#0d0d0d] border-t border-[#2b2b2b] flex flex-col">
             <div className="h-9 bg-[#181818] border-b border-[#2b2b2b] flex items-center px-4 gap-6">
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
                  <div className="p-1 hover:bg-zinc-800 rounded cursor-pointer"><Plus size={14} /></div>
                  <div className="p-1 hover:bg-zinc-800 rounded cursor-pointer"><X size={14} /></div>
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
          </div>
        </div>

        {/* 6. RIGHT SIDEBAR (Agent Manager) */}
        {isAIChatOpen && (
          <div className="w-[420px] bg-[#181818] border-l border-[#2b2b2b] flex flex-col">
            <AIChat activeFile={activeFile} onCodeUpdate={handleContentChange} />
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
