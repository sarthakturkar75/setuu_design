"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Layers, Plus, Trash2, SlidersHorizontal, EyeOff, Eye, Move, ZoomIn, ZoomOut, MousePointer2 } from 'lucide-react';

export function DrawingDisciplineToggle({ drawings }: { drawings: any[] }) {
  const latestDrawings = useMemo(() => {
    const grouped = drawings.reduce((acc: any, curr: any) => {
      if (!acc[curr.drawing_name] || acc[curr.drawing_name].version_number < curr.version_number) {
        acc[curr.drawing_name] = curr;
      }
      return acc;
    }, {});
    return Object.values(grouped) as any[];
  }, [drawings]);

  // Layer state includes nudge and scale for physical alignment
  const [layers, setLayers] = useState<any[]>([]);

  // Global Pan/Zoom State
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const removeLayer = (id: string) => setLayers(layers.filter(l => l.id !== id));
  const updateLayer = (id: string, key: string, value: any) => setLayers(layers.map(l => l.id === id ? { ...l, [key]: value } : l));

  // Global Pan/Zoom Handlers
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(z => Math.min(Math.max(0.1, z * zoomFactor), 10));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // CSS Filter Magic for Tinting Black lines on White BG
  const getTintFilter = (tint: string) => {
    switch(tint) {
      case 'red': return 'sepia(1) hue-rotate(-50deg) saturate(5)';
      case 'blue': return 'sepia(1) hue-rotate(180deg) saturate(5)';
      case 'green': return 'sepia(1) hue-rotate(90deg) saturate(5)';
      default: return 'none';
    }
  };

  return (
    <div className="flex gap-6 h-full min-h-[700px]">
       
       {/* Sidebar Controls */}
       <div className="w-96 bg-surface-container rounded-xl border border-outline-variant/50 flex flex-col overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
            <h3 className="text-sm font-bold flex items-center gap-2 text-on-surface">
               <Layers className="w-4 h-4 text-primary" /> Overlay & Alignment Engine
            </h3>
            <p className="text-[10px] text-on-surface-variant mt-1">Nudge, scale, tint, and pan disparate blueprints to achieve a perfect 1:1 overlay alignment.</p>
          </div>

          <div className="p-4 border-b border-outline-variant/50 bg-surface-variant/30 flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Add Layer</label>
            <select 
              value=""
              onChange={e => {
                const id = e.target.value;
                if (!id) return;
                const d = latestDrawings.find((x: any) => x.id === id);
                if (d && !layers.find(l => l.id === d.id)) {
                  setLayers([...layers, { 
                    id: d.id, 
                    drawing: d, 
                    opacity: 100, 
                    visible: true,
                    tint: 'none',
                    offsetX: 0,
                    offsetY: 0,
                    scale: 1
                  }]);
                }
              }}
              className="w-full p-2 rounded bg-surface border border-outline-variant text-xs font-bold focus:border-primary focus:outline-none cursor-pointer hover:bg-surface-variant transition-colors"
            >
              <option value="">+ Select a sheet to overlay...</option>
              {latestDrawings.filter(d => !layers.find(l => l.id === d.id)).map(d => (
                <option key={d.id} value={d.id}>[{d.custom_data?.discipline}] {d.drawing_name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
             {layers.length === 0 ? (
                <div className="text-center p-6 border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant text-xs">
                  Stack is empty.<br/>Add a base architectural sheet first.
                </div>
             ) : (
                layers.map((layer, index) => (
                  <div key={layer.id} className="bg-surface-container-lowest border border-outline-variant/50 p-3 rounded-lg flex flex-col gap-3 shadow-sm">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                           <span className="text-[10px] font-bold bg-surface-variant text-on-surface-variant px-1.5 py-0.5 rounded uppercase">
                             {layer.drawing.custom_data?.discipline}
                           </span>
                           <span className="text-xs font-bold text-on-surface truncate">{layer.drawing.drawing_name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                           <button onClick={() => updateLayer(layer.id, 'visible', !layer.visible)} className="p-1 hover:bg-surface-variant text-on-surface-variant rounded">
                             {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                           </button>
                           <button onClick={() => removeLayer(layer.id)} className="p-1 hover:bg-error/10 text-error rounded">
                             <Trash2 className="w-3.5 h-3.5" />
                           </button>
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-on-surface-variant uppercase">Tint Color</label>
                          <select 
                            value={layer.tint} 
                            onChange={e => updateLayer(layer.id, 'tint', e.target.value)}
                            className="text-xs p-1 rounded bg-surface border border-outline-variant"
                          >
                            <option value="none">Original (Black)</option>
                            <option value="red">Red Overlay</option>
                            <option value="blue">Blue Overlay</option>
                            <option value="green">Green Overlay</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-on-surface-variant uppercase">Opacity</label>
                          <div className="flex items-center gap-2">
                            <input type="range" min="0" max="100" value={layer.opacity} onChange={(e) => updateLayer(layer.id, 'opacity', parseInt(e.target.value))} className="flex-1 h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary" />
                            <span className="text-[10px] font-bold text-on-surface-variant">{layer.opacity}%</span>
                          </div>
                       </div>
                     </div>

                     <div className="flex flex-col gap-1 mt-1 pt-2 border-t border-outline-variant/30">
                        <label className="text-[9px] font-bold text-on-surface-variant uppercase mb-1">Micro-Alignment (Nudge)</label>
                        <div className="flex gap-2">
                          <div className="flex items-center gap-1 bg-surface px-2 border border-outline-variant rounded flex-1">
                             <span className="text-[10px] text-on-surface-variant">X</span>
                             <input type="number" value={layer.offsetX} onChange={e => updateLayer(layer.id, 'offsetX', parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-xs p-1 outline-none text-right" />
                          </div>
                          <div className="flex items-center gap-1 bg-surface px-2 border border-outline-variant rounded flex-1">
                             <span className="text-[10px] text-on-surface-variant">Y</span>
                             <input type="number" value={layer.offsetY} onChange={e => updateLayer(layer.id, 'offsetY', parseFloat(e.target.value) || 0)} className="w-full bg-transparent text-xs p-1 outline-none text-right" />
                          </div>
                          <div className="flex items-center gap-1 bg-surface px-2 border border-outline-variant rounded flex-1">
                             <span className="text-[10px] text-on-surface-variant">SCL</span>
                             <input type="number" step="0.01" value={layer.scale} onChange={e => updateLayer(layer.id, 'scale', parseFloat(e.target.value) || 1)} className="w-full bg-transparent text-xs p-1 outline-none text-right" />
                          </div>
                        </div>
                     </div>
                  </div>
                ))
             )}
          </div>
       </div>

       {/* Stacked Canvas Engine (Pan/Zoom) */}
       <div 
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant/50 relative overflow-hidden checkerboard-bg cursor-grab active:cursor-grabbing"
        >
          <style dangerouslySetInnerHTML={{__html: `
            .checkerboard-bg {
              background-image: linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%);
              background-size: 20px 20px;
              background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            }
          `}} />
          
          {/* Pan/Zoom Overlay Hints */}
          <div className="absolute top-4 left-4 z-50 flex gap-2 bg-surface/80 backdrop-blur p-2 rounded-lg border border-outline-variant shadow-sm pointer-events-none">
             <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface"><MousePointer2 className="w-3 h-3"/> Drag to Pan</div>
             <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface ml-2"><ZoomIn className="w-3 h-3"/> Ctrl+Scroll to Zoom ({(zoom * 100).toFixed(0)}%)</div>
          </div>

          {/* Transformation Wrapper */}
          <div 
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
              position: 'relative'
            }}
          >
            {layers.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-50" style={{ transform: `scale(${1/zoom})` }}>
                 <Layers className="w-16 h-16 text-on-surface-variant" />
                 <p className="text-sm font-bold text-on-surface-variant">Canvas Empty</p>
              </div>
            ) : (
              layers.map((layer, index) => {
                const blendMode = index === 0 ? 'mix-blend-normal' : 'mix-blend-multiply';
                
                return (
                  <img 
                    key={layer.id} 
                    src={layer.drawing.file_url} 
                    className={`absolute inset-0 w-full h-full object-contain`} 
                    style={{ 
                      opacity: layer.visible ? (layer.opacity / 100) : 0,
                      mixBlendMode: blendMode as any,
                      zIndex: index,
                      filter: getTintFilter(layer.tint),
                      transform: `translate(${layer.offsetX}px, ${layer.offsetY}px) scale(${layer.scale})`,
                    }}
                    draggable={false}
                    alt={layer.drawing.drawing_name} 
                  />
                );
              })
            )}
          </div>
       </div>
    </div>
  );
}
