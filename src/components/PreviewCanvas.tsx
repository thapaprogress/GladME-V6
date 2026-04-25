import React from 'react';

interface PreviewCanvasProps {
  content: string;
  language: string;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ content, language }) => {
  if (language === 'html') {
    return (
      <div className="flex-1 w-full h-full bg-white">
        <iframe
          title="Preview"
          className="w-full h-full border-none"
          srcDoc={content}
          sandbox="allow-scripts"
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] text-gray-400 font-mono">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest mb-2 opacity-50">Visualizer</div>
        <div className="text-sm">Simulation for {language} content is active.</div>
        <div className="mt-4 p-4 bg-[#111] rounded border border-white/5 text-left max-w-md overflow-hidden text-clip">
          <code>{content.substring(0, 100)}...</code>
        </div>
      </div>
    </div>
  );
};
