import React from 'react';
import { GitBranch, GitCommit, GitMerge, RefreshCw, Plus, Check } from 'lucide-react';

export const GitSidebar: React.FC = () => {
  const changes = [
    { name: 'main.ts', status: 'modified', icon: <span className="text-yellow-500 text-[10px] font-bold">M</span> },
    { name: 'App.tsx', status: 'modified', icon: <span className="text-yellow-500 text-[10px] font-bold">M</span> },
    { name: 'SearchSidebar.tsx', status: 'untracked', icon: <span className="text-emerald-500 text-[10px] font-bold">U</span> },
  ];

  return (
    <div className="h-full bg-[#18181b] border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <span className="uppercase text-[10px] font-bold tracking-widest text-zinc-500">Source Control</span>
        <div className="flex gap-2">
            <RefreshCw size={14} className="text-zinc-500 hover:text-white cursor-pointer" />
            <GitCommit size={14} className="text-zinc-500 hover:text-white cursor-pointer" />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Current Branch</label>
            <div className="bg-zinc-900 border border-zinc-800 rounded p-2 flex items-center gap-2">
                <GitBranch size={14} className="text-blue-400" />
                <span className="text-xs text-zinc-300 font-mono">master</span>
            </div>
        </div>

        <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-600 uppercase">Changes</span>
                <span className="text-[10px] px-1 bg-zinc-800 rounded text-zinc-400">{changes.length}</span>
             </div>
             
             <div className="space-y-1">
                {changes.map((item, i) => (
                    <div key={i} className="group flex items-center gap-2 p-1.5 rounded hover:bg-zinc-800/50 cursor-pointer group">
                        <div className="w-5 flex justify-center">{item.icon}</div>
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors flex-1">{item.name}</span>
                        <div className="hidden group-hover:flex gap-1">
                            <Plus size={12} className="text-zinc-500 hover:text-emerald-400" />
                        </div>
                    </div>
                ))}
             </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-zinc-800">
        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
            <Check size={14} />
            Commit to Local
        </button>
        <p className="mt-2 text-[9px] text-zinc-600 font-mono text-center">Last synced: 2 minutes ago</p>
      </div>
    </div>
  );
};
