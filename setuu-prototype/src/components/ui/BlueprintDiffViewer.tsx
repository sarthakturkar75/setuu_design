"use client";

import React, { useState } from 'react';
import { Layers } from 'lucide-react';

export function BlueprintDiffViewer({ v1Url, v2Url }: { v1Url: string, v2Url: string }) {
  const [opacity, setOpacity] = useState(0.5);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex items-center justify-between bg-surface-container p-3 rounded-lg border border-outline-variant/50">
        <h3 className="text-sm font-bold flex items-center gap-2 text-on-surface">
          <Layers className="w-4 h-4 text-primary" /> Visual Diffing Engine
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-semantic-crimson">V1 (Old)</span>
          <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e => setOpacity(parseFloat(e.target.value))} className="w-32 accent-primary" />
          <span className="text-xs font-semibold text-semantic-emerald">V2 (New)</span>
        </div>
      </div>

      <div className="relative flex-1 bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden min-h-[500px] flex items-center justify-center">
        {/* V1 Layer - Base */}
        <img src={v1Url} className="absolute inset-0 w-full h-full object-contain filter invert opacity-80" alt="V1 Base" />
        
        {/* V2 Layer - Diff applied */}
        <img 
          src={v2Url} 
          className="absolute inset-0 w-full h-full object-contain mix-blend-difference" 
          style={{ opacity }}
          alt="V2 Overlay" 
        />
        <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none">
           <p className="text-[10px] bg-black/60 text-white p-2 rounded inline-block font-mono">
             CSS mix-blend-mode: difference physically isolates pixel variations. Purple/Green hues highlight architectural changes.
           </p>
        </div>
      </div>
    </div>
  );
}
