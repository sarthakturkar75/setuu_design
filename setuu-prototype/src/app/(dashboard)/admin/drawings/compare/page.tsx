import Link from "next/link";
import { ChevronLeftIcon, SlidersHorizontalIcon, DownloadIcon } from "lucide-react";

export const metadata = {
  title: "Compare Drawings | Setuu",
};

export default function DrawingComparePage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#1B1C19]">
      {/* Toolbar */}
      <header className="h-16 border-b border-[#303030] flex items-center justify-between px-6 shrink-0 bg-[#222222]">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/drawings"
            className="text-[#a0a0a0] hover:text-white transition-colors flex items-center text-sm font-medium"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Back to Hub
          </Link>
          <div className="h-5 w-px bg-[#404040]"></div>
          <h1 className="text-white font-medium">
            Version Comparison: <span className="font-jetbrains-mono text-[#a0a0a0]">Structural_Plan_Level_1</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#111111] p-1 rounded-md border border-[#333333]">
            <button className="px-3 py-1 text-xs font-medium text-white bg-[#333333] rounded shadow-sm">
              Side-by-side
            </button>
            <button className="px-3 py-1 text-xs font-medium text-[#a0a0a0] hover:text-white transition-colors rounded">
              Overlay (Diff)
            </button>
          </div>
          <button className="p-2 text-[#a0a0a0] hover:text-white transition-colors bg-[#333333] rounded-md border border-[#444444]" title="Settings">
            <SlidersHorizontalIcon className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Comparison Viewport */}
      <main className="flex-1 flex w-full relative overflow-hidden">
        
        {/* Left Version */}
        <div className="flex-1 flex flex-col border-r border-[#303030] relative">
          <div className="absolute top-4 left-4 z-10 bg-[#222222]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#444444] flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-semantic-crimson"></span>
            <span className="text-white text-xs font-semibold font-jetbrains-mono">v1.0 (Old)</span>
          </div>
          
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#111111] p-8">
            <div className="w-full h-full border-2 border-semantic-crimson/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                  backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                  backgroundSize: `40px 40px`
                }} 
              />
              <span className="text-[#606060] font-merriweather text-xl italic relative z-10">Previous Revision Render</span>
            </div>
          </div>
        </div>

        {/* Right Version */}
        <div className="flex-1 flex flex-col relative">
          <div className="absolute top-4 right-4 z-10 bg-[#222222]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#444444] flex items-center gap-2 shadow-lg">
            <span className="text-white text-xs font-semibold font-jetbrains-mono">v2.0 (Current)</span>
            <span className="w-2 h-2 rounded-full bg-semantic-emerald"></span>
          </div>
          
          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#111111] p-8">
            <div className="w-full h-full border-2 border-semantic-emerald/30 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                  backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                  backgroundSize: `40px 40px`
                }} 
              />
              <span className="text-[#606060] font-merriweather text-xl italic relative z-10">New Revision Render</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
