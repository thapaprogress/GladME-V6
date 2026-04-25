import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { FileNode } from '../types';
import { X, Code, FileCode, Hash, Globe } from 'lucide-react';

interface EditorProps {
  activeFile: FileNode | null;
  openFiles: FileNode[];
  onCloseFile: (id: string) => void;
  onFileSelect: (file: FileNode) => void;
  onContentChange: (id: string, content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ 
  activeFile, 
  openFiles, 
  onCloseFile, 
  onFileSelect,
  onContentChange 
}) => {
  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-600 bg-[#080808]">
        <div className="flex flex-col items-center gap-4">
          <Code size={48} className="opacity-10" />
          <p className="text-sm font-mono tracking-widest uppercase opacity-40">No file selected</p>
        </div>
      </div>
    );
  }

  const getFileIcon = (name: string) => {
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return <FileCode size={14} className="text-blue-400" />;
    if (name.endsWith('.css')) return <Hash size={14} className="text-purple-400" />;
    return <Globe size={14} className="text-zinc-500" />;
  }

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Tabs Bar */}
      <div className="h-9 bg-[#181818] flex items-center overflow-x-auto custom-scrollbar border-b border-[#2b2b2b]">
        {openFiles.map((file) => (
          <div
            key={file.id}
            onClick={() => onFileSelect(file)}
            className={`flex items-center gap-2 h-full px-3 border-r border-[#2b2b2b] min-w-[120px] max-w-[200px] cursor-pointer group transition-all ${
              activeFile.id === file.id 
                ? 'bg-[#0d0d0d] text-white' 
                : 'bg-transparent text-zinc-500 hover:bg-[#2a2d2e] hover:text-zinc-300'
            }`}
          >
            {getFileIcon(file.name)}
            <span className="text-[12px] truncate flex-1 font-sans">{file.name}</span>
            <X
              size={12}
              className={`opacity-0 group-hover:opacity-100 hover:bg-[#3c3c3c] rounded px-0.5 py-0.5 transition-all transition-opacity`}
              onClick={(e) => {
                e.stopPropagation();
                onCloseFile(file.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* Breadcrumbs */}
      <div className="h-7 bg-[#0d0d0d] flex items-center px-4 gap-2 text-[11px] text-zinc-500">
        <span className="hover:text-zinc-300 cursor-pointer">Rf-Detr</span>
        <span className="opacity-40">/</span>
        <span className="hover:text-zinc-300 cursor-pointer">docs</span>
        <span className="opacity-40">/</span>
        <span className="text-zinc-400">{activeFile.name}</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          height="100%"
          language={activeFile.language || 'typescript'}
          theme="vs-dark"
          value={activeFile.content}
          onChange={(value) => onContentChange(activeFile.id, value || '')}
          options={{
            minimap: { enabled: true, side: 'right' },
            fontSize: 14,
            fontFamily: 'JetBrains Mono',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 10 },
            backgroundColor: '#0d0d0d',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3
          }}
        />
      </div>
    </div>
  );
};
