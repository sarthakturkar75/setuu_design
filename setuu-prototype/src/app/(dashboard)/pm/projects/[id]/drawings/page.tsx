"use client";

import { useState } from "react";
import { PenToolIcon, MaximizeIcon, DownloadIcon, LayersIcon, EyeIcon } from "lucide-react";

export default function DrawingHubPage({ params }: { params: { id: string } }) {
  const [activeTool, setActiveTool] = useState<string>("pan");

  return (
    <div className="h-[calc(100vh-120px)] w-full bg-[#1B1C19] relative overflow-hidden flex flex-col">
      
      {/* Top Bar Overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#1B1C19] to-transparent z-10 flex items-center justify-between px-6">
        <h1 className="text-white font-bold font-inter tracking-wide drop-shadow-md">Architectural Blueprint - Ground Floor v1.2</h1>
        <div className="flex items-center gap-4">
          <button className="text-white/80 hover:text-white transition-colors"><DownloadIcon className="w-5 h-5" /></button>
          <button className="text-white/80 hover:text-white transition-colors"><MaximizeIcon className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Floating Toolbar (Glassmorphic) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex flex-col gap-2 z-10 shadow-2xl">
        <button 
          onClick={() => setActiveTool('pan')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'pan' 
              ? "bg-[#41BEFD]/20 text-[#41BEFD] border border-[#41BEFD]/50 shadow-[0_0_15px_rgba(65,190,253,0.3)]" 
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11" /></svg>
        </button>
        
        <button 
          onClick={() => setActiveTool('markup')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'markup' 
              ? "bg-[#41BEFD]/20 text-[#41BEFD] border border-[#41BEFD]/50 shadow-[0_0_15px_rgba(65,190,253,0.3)]" 
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <PenToolIcon className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setActiveTool('layers')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'layers' 
              ? "bg-[#41BEFD]/20 text-[#41BEFD] border border-[#41BEFD]/50 shadow-[0_0_15px_rgba(65,190,253,0.3)]" 
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <LayersIcon className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setActiveTool('visibility')}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeTool === 'visibility' 
              ? "bg-[#41BEFD]/20 text-[#41BEFD] border border-[#41BEFD]/50 shadow-[0_0_15px_rgba(65,190,253,0.3)]" 
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <EyeIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Canvas Area (Mock blueprint view) */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center">
        {/* Background Grid Pattern for CAD feel */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Blueprint Placeholder Image */}
        <div className="w-[80%] h-[80%] border border-white/20 rounded bg-white/5 relative flex items-center justify-center overflow-hidden">
          <p className="text-white/30 font-jetbrains-mono text-xl uppercase tracking-[0.2em] font-bold">DRAWING_RENDER_CANVAS</p>
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="0.5" />
            <line x1="100" y1="0" x2="0" y2="100" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
      </div>
      
    </div>
  );
}
