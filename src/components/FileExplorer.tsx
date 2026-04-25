import React, { useState } from 'react';
import { FileNode } from '../types';
import { File, Folder, ChevronRight, ChevronDown, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  activeFileId?: string;
}

const FileItem: React.FC<{
  node: FileNode;
  depth: number;
  onFileSelect: (file: FileNode) => void;
  activeFileId?: string;
}> = ({ node, depth, onFileSelect, activeFileId }) => {
  const [isOpen, setIsOpen] = useState(node.isOpen || false);
  const isSelected = activeFileId === node.id;

  const handleClick = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(node);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1 px-2 cursor-pointer transition-colors text-sm ${
          isSelected ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' ? (
          <>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={16} className="text-zinc-500" />
          </>
        ) : (
          <>
            <div className="w-[14px]" />
            <FileText size={16} className="text-zinc-500" />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      <AnimatePresence>
        {node.type === 'folder' && isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileItem
                key={child.id}
                node={child}
                depth={depth + 1}
                onFileSelect={onFileSelect}
                activeFileId={activeFileId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileSelect, activeFileId }) => {
  return (
    <div className="h-full bg-[#18181b] border-r border-zinc-800 overflow-y-auto custom-scrollbar">
      <div className="p-4 uppercase text-[10px] font-bold tracking-widest text-zinc-500 mb-2">
        Explorer
      </div>
      {files.map((file) => (
        <FileItem key={file.id} node={file} depth={0} onFileSelect={onFileSelect} activeFileId={activeFileId} />
      ))}
    </div>
  );
};
