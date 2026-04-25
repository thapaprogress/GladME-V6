import React, { useState, useMemo } from 'react';
import { Search, FileText, ChevronRight } from 'lucide-react';
import { FileNode } from '../types';

interface SearchSidebarProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
}

interface SearchResult {
  file: FileNode;
  matches: string[];
}

export const SearchSidebar: React.FC<SearchSidebarProps> = ({ files, onFileSelect }) => {
  const [query, setQuery] = useState('');

  const searchFiles = (nodes: FileNode[], term: string): SearchResult[] => {
    let results: SearchResult[] = [];
    
    for (const node of nodes) {
      if (node.type === 'file') {
        const matches: string[] = [];
        const content = node.content || '';
        
        // Search in name
        if (node.name.toLowerCase().includes(term.toLowerCase())) {
          matches.push(`Filename match: ${node.name}`);
        }

        // Search in content
        if (content.toLowerCase().includes(term.toLowerCase())) {
          const lines = content.split('\n');
          lines.forEach((line, i) => {
            if (line.toLowerCase().includes(term.toLowerCase())) {
              matches.push(`L${i + 1}: ${line.trim().substring(0, 40)}...`);
            }
          });
        }

        if (matches.length > 0) {
          results.push({ file: node, matches });
        }
      } else if (node.children) {
        results = [...results, ...searchFiles(node.children, term)];
      }
    }
    return results;
  };

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchFiles(files, query);
  }, [files, query]);

  return (
    <div className="h-full bg-[#18181b] border-r border-zinc-800 flex flex-col">
      <div className="p-4 uppercase text-[10px] font-bold tracking-widest text-zinc-500 mb-2">
        Global Search
      </div>
      
      <div className="px-4 mb-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords or filenames..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded px-9 py-2 text-xs text-zinc-300 focus:outline-none focus:border-blue-500 transition-all font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
        {results.length === 0 && query.length >= 2 && (
          <div className="text-center py-10 text-zinc-600 text-xs italic">
            No results found for "{query}"
          </div>
        )}
        
        {results.map((res) => (
          <div key={res.file.id} className="group">
            <div 
              onClick={() => onFileSelect(res.file)}
              className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-zinc-800/50 transition-colors"
            >
              <FileText size={14} className="text-blue-400 opacity-70" />
              <span className="text-xs font-semibold text-zinc-300 truncate">{res.file.name}</span>
              <span className="ml-auto text-[10px] text-zinc-600 font-mono">{res.matches.length} matches</span>
            </div>
            <div className="ml-6 border-l border-zinc-800 pl-3 space-y-1 mt-1">
              {res.matches.slice(0, 3).map((match, i) => (
                <div key={i} className="text-[10px] text-zinc-500 font-mono py-0.5 hover:text-zinc-300 transition-colors truncate cursor-pointer">
                  {match}
                </div>
              ))}
              {res.matches.length > 3 && (
                <div className="text-[9px] text-zinc-700 italic pb-2">+ {res.matches.length - 3} more</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
