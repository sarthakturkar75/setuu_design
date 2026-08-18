"use client";
import * as React from "react";
import { MousePointer2Icon, HighlighterIcon, MessageSquareIcon, ZoomInIcon, ZoomOutIcon, SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Annotation = {
  id: string;
  type: "highlight" | "note";
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
};

export default function DrawingAnnotationPage() {
  const [tool, setTool] = React.useState<"pan" | "highlight" | "note">("pan");
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  
  const [annotations, setAnnotations] = React.useState<Annotation[]>([
    { id: "1", type: "highlight", x: 200, y: 150, width: 120, height: 80 },
    { id: "2", type: "note", x: 450, y: 300, text: "Check beam clearance here." }
  ]);
  const [currentHighlight, setCurrentHighlight] = React.useState<Partial<Annotation> | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    if (tool === "pan") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (tool === "highlight") {
      setIsDragging(true);
      setCurrentHighlight({ type: "highlight", x, y, width: 0, height: 0 });
    } else if (tool === "note") {
      const text = window.prompt("Enter note text:");
      if (text) {
        setAnnotations(prev => [...prev, { id: Date.now().toString(), type: "note", x, y, text }]);
      }
      setTool("pan");
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    if (tool === "pan") {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    } else if (tool === "highlight" && currentHighlight) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left - pan.x) / zoom;
      const currentY = (e.clientY - rect.top - pan.y) / zoom;
      
      setCurrentHighlight(prev => ({
        ...prev,
        width: currentX - (prev?.x || 0),
        height: currentY - (prev?.y || 0)
      }));
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (tool === "highlight" && currentHighlight) {
      // Normalize negative width/height
      let { x, y, width, height } = currentHighlight;
      if (width && width < 0) { x = (x || 0) + width; width = Math.abs(width); }
      if (height && height < 0) { y = (y || 0) + height; height = Math.abs(height); }
      
      if (width && height && width > 10 && height > 10) {
        setAnnotations(prev => [...prev, { 
          id: Date.now().toString(), 
          type: "highlight", 
          x: x || 0, 
          y: y || 0, 
          width, 
          height 
        }]);
      }
      setCurrentHighlight(null);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      const newZoom = Math.min(Math.max(0.5, zoom + delta), 4);
      setZoom(newZoom);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-surface border-b border-outline-variant px-6 py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-surface-variant rounded-lg p-1 flex gap-1">
            <button 
              onClick={() => setTool("pan")}
              className={`p-2 rounded-md transition-colors ${tool === "pan" ? "bg-primary text-white shadow" : "text-on-surface hover:bg-outline-variant/30"}`}
              title="Pan Tool (Default)"
            >
              <MousePointer2Icon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTool("highlight")}
              className={`p-2 rounded-md transition-colors ${tool === "highlight" ? "bg-semantic-amber text-black shadow" : "text-on-surface hover:bg-outline-variant/30"}`}
              title="Highlight Tool"
            >
              <HighlighterIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setTool("note")}
              className={`p-2 rounded-md transition-colors ${tool === "note" ? "bg-semantic-sky text-black shadow" : "text-on-surface hover:bg-outline-variant/30"}`}
              title="Add Note"
            >
              <MessageSquareIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="h-8 w-px bg-outline-variant mx-2" />
          <div className="flex items-center gap-2 text-on-surface-variant">
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-1.5 hover:bg-surface-variant rounded-md"><ZoomOutIcon className="w-4 h-4" /></button>
            <span className="text-sm font-jetbrains-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(4, z + 0.2))} className="p-1.5 hover:bg-surface-variant rounded-md"><ZoomInIcon className="w-4 h-4" /></button>
          </div>
        </div>
        <div>
          <Button variant="primary" size="sm" className="gap-2">
            <SaveIcon className="w-4 h-4" /> Save Annotations
          </Button>
        </div>
      </div>

      <div 
        className="flex-1 bg-surface-container overflow-hidden relative cursor-crosshair touch-none"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      >
        <div 
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        >
          {/* Base Blueprint Image */}
          <div className="w-[1200px] h-[800px] bg-slate-200 border-2 border-outline-variant relative">
             <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80" alt="Blueprint" className="w-full h-full object-cover opacity-80 mix-blend-multiply" />
             
             {/* Annotation SVG Overlay */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
               {annotations.filter(a => a.type === "highlight").map(a => (
                 <rect 
                   key={a.id} 
                   x={a.x} y={a.y} width={a.width} height={a.height} 
                   fill="rgba(245, 158, 11, 0.3)" 
                   stroke="rgba(245, 158, 11, 0.8)" 
                   strokeWidth="2" 
                   rx="4"
                 />
               ))}
               {currentHighlight && (
                 <rect 
                   x={currentHighlight.width && currentHighlight.width < 0 ? (currentHighlight.x || 0) + currentHighlight.width : currentHighlight.x} 
                   y={currentHighlight.height && currentHighlight.height < 0 ? (currentHighlight.y || 0) + currentHighlight.height : currentHighlight.y} 
                   width={Math.abs(currentHighlight.width || 0)} 
                   height={Math.abs(currentHighlight.height || 0)} 
                   fill="rgba(245, 158, 11, 0.3)" 
                   stroke="rgba(245, 158, 11, 0.8)" 
                   strokeWidth="2" 
                   rx="4"
                 />
               )}
             </svg>

             {/* Note Overlays */}
             {annotations.filter(a => a.type === "note").map(a => (
               <div 
                 key={a.id} 
                 className="absolute w-6 h-6 -ml-3 -mt-3 bg-semantic-sky text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer group"
                 style={{ left: a.x, top: a.y, pointerEvents: 'auto' }}
               >
                 <MessageSquareIcon className="w-3 h-3" />
                 <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-surface-container-high border border-outline-variant text-on-surface text-sm p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                   {a.text}
                 </div>
               </div>
             ))}
          </div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-high/80 backdrop-blur-md px-4 py-2 rounded-full border border-outline-variant/50 text-xs text-on-surface-variant">
          Tip: Hold <kbd className="bg-surface-variant px-1 rounded">Ctrl</kbd> + Scroll to zoom. Use Pan tool to drag.
        </div>
      </div>
    </div>
  );
}
