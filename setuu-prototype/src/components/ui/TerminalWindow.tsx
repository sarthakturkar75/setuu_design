import React from 'react';
import { cn } from '@/lib/utils';
import { Terminal } from 'lucide-react';

interface TerminalLine {
  text: string;
  isError?: boolean;
}

interface TerminalWindowProps {
  title?: string;
  lines: TerminalLine[];
  height?: string;
  className?: string;
}

export function TerminalWindow({ title = "Terminal", lines, height = "h-64", className }: TerminalWindowProps) {
  return (
    <div className={cn("flex flex-col rounded-lg overflow-hidden border border-outline-variant/30 shadow-elevation-l2 bg-[#0d0f0c]", className)}>
      <div className="flex items-center px-4 py-2 bg-[#1b1c19] border-b border-outline-variant/20">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-semantic-crimson" />
          <div className="w-3 h-3 rounded-full bg-semantic-amber" />
          <div className="w-3 h-3 rounded-full bg-semantic-emerald" />
        </div>
        <div className="flex items-center text-xs font-jetbrains-mono text-outline">
          <Terminal className="w-3 h-3 mr-2" />
          {title}
        </div>
      </div>
      <div className={cn("p-4 overflow-y-auto font-jetbrains-mono text-xs md:text-sm", height)}>
        {lines.length === 0 ? (
          <div className="text-outline italic">No logs available.</div>
        ) : (
          lines.map((line, index) => (
            <div key={index} className={cn("mb-1 break-all", line.isError ? "text-error" : "text-semantic-emerald")}>
              <span className="text-outline mr-2 select-none">$</span>
              {line.text}
            </div>
          ))
        )}
        <div className="animate-pulse w-2 h-4 bg-outline mt-1 inline-block" />
      </div>
    </div>
  );
}
