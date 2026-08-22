"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { getDrawings, compareDrawingVersions } from "@/app/actions/drawingActions";
import { useToast } from "@/contexts/ToastContext";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Toggle } from "@/components/ui/Toggle";
import { ArrowLeft, SplitSquareHorizontal, Layers, FileImage, Search, ZoomIn, ZoomOut, Maximize, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DrawingComparePage() {
  const [mode, setMode] = useState<"side-by-side" | "overlay">("side-by-side");
  const [opacity, setOpacity] = useState(50);

  const [v1, setV1] = useState("");
  const [v2, setV2] = useState("");
  const [drawings, setDrawings] = useState<any[]>([]);
  const { info, success } = useToast();
  
  useEffect(() => {
     getDrawings().then(res => setDrawings(res || []));
  }, []);
  
  const handleCompare = () => {
     success("Comparison Started", "Generating diff between selected versions...");
  };

  
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Drawing Comparison Diff" 
        subtitle="Compare revisions to identify design changes and potential clashes"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/drawings" className="hover:text-primary transition-colors">Drawings</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Compare</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/drawings" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
            <button onClick={handleCompare} className="flex items-center gap-2 px-4 py-2 bg-semantic-emerald text-on-primary rounded-lg text-sm font-semibold hover:bg-semantic-emerald/90 transition-colors shadow-elevation-l1">
     Compare Now
   </button>
   <button onClick={() => info("Issue Draft", "Opening issue reporter for this structural diff")} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
     <AlertCircle className="w-4 h-4" /> Raise Issue
   </button>
          </div>
        }
      />
      
      <div className="flex-1 flex flex-col p-6 max-w-[1800px] mx-auto w-full gap-6">
        
        {/* Controls Bar */}
        <Card className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 bg-surface-variant/50 p-1 rounded-lg border border-outline-variant">
              <button 
                onClick={() => setMode("side-by-side")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  mode === "side-by-side" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <SplitSquareHorizontal className="w-4 h-4" />
                Side-by-Side
              </button>
              <button 
                onClick={() => setMode("overlay")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  mode === "overlay" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <Layers className="w-4 h-4" />
                Overlay Diff
              </button>
            </div>

            {mode === "overlay" && (
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm font-medium text-on-surface-variant">Version A</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={opacity}
                  onChange={(e) => setOpacity(parseInt(e.target.value))}
                  className="w-32 accent-primary"
                />
                <span className="text-sm font-medium text-primary">Version B</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-on-surface-variant border-r border-outline-variant pr-4">
              <button className="p-1.5 hover:bg-surface-variant rounded-md transition-colors"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-sm font-jetbrains">100%</span>
              <button className="p-1.5 hover:bg-surface-variant rounded-md transition-colors"><ZoomIn className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-surface-variant rounded-md transition-colors"><Maximize className="w-4 h-4" /></button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-on-surface">Auto-Highlight Diffs</span>
              <Toggle checked={true} onChange={() => {}} />
            </div>
          </div>
        </Card>

        {/* Viewer Area */}
        <div className="flex-1 min-h-[500px] flex flex-col lg:flex-row gap-6">
          
          {/* Version A Panel */}
          <Card className="flex-1 flex flex-col overflow-hidden border-2 border-outline-variant hover:border-semantic-amber/50 transition-colors">
            <div className="p-3 border-b border-outline-variant bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-semantic-amber" />
                <h3 className="font-semibold text-on-surface">Version A (Base)</h3>
              </div>
              <div className="w-full sm:w-48">
                <Select options={drawings.map(d => ({ label: d.title, value: d.id }))} value={v1} onChange={setV1} />
              </div>
            </div>
            <div className="flex-1 bg-surface-variant/30 flex items-center justify-center relative overflow-hidden">
              {/* Mock Blueprint Canvas A */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative border-4 border-semantic-amber/20 w-3/4 h-3/4 bg-surface shadow-elevation-l1 flex items-center justify-center">
                <FileImage className="w-16 h-16 text-on-surface-variant/30" />
                <span className="absolute bottom-4 right-4 text-xs font-jetbrains text-on-surface-variant">DWG-101-v3</span>
                
                {/* Mock Diff Highlight */}
                {mode === "side-by-side" && (
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-semantic-amber border-dashed bg-semantic-amber/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-semantic-amber">Wall Removed</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Version B Panel */}
          <Card className={`flex-1 flex flex-col overflow-hidden border-2 border-outline-variant hover:border-primary/50 transition-colors ${mode === "overlay" ? "hidden" : ""}`}>
            <div className="p-3 border-b border-outline-variant bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <h3 className="font-semibold text-on-surface">Version B (Compare)</h3>
              </div>
              <div className="w-full sm:w-48">
                <Select options={drawings.map(d => ({ label: d.title, value: d.id }))} value={v2} onChange={setV2} />
              </div>
            </div>
            <div className="flex-1 bg-surface-variant/30 flex items-center justify-center relative overflow-hidden">
              {/* Mock Blueprint Canvas B */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="relative border-4 border-primary/20 w-3/4 h-3/4 bg-surface shadow-elevation-l1 flex items-center justify-center">
                <FileImage className="w-16 h-16 text-on-surface-variant/30" />
                <span className="absolute bottom-4 right-4 text-xs font-jetbrains text-on-surface-variant">DWG-101-v4</span>

                {/* Mock Diff Highlight */}
                <div className="absolute top-1/4 left-1/4 w-40 h-40 border-2 border-primary bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-primary bg-surface px-2 py-1 rounded shadow">New Load-Bearing Structure</span>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
