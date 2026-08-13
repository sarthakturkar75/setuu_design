"use client";

import * as React from "react";
import { useState } from "react";
import { 
  FileBox, 
  GitBranch, 
  GitCommit, 
  CheckCircle2, 
  Settings, 
  Cpu, 
  Code2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2 
} from "lucide-react";

// Mock version data
const drawingVersions = [
  { id: "v1.0.4", date: "Today, 10:42 AM", author: "Jane Smith", note: "Adjusted thermal pad clearance for QFP", active: true },
  { id: "v1.0.3", date: "Yesterday, 3:15 PM", author: "Robert Chen", note: "Merged mechanical chassis constraints", active: false },
  { id: "v1.0.2", date: "Aug 10, 1:20 PM", author: "Jane Smith", note: "Updated CAN bus resistor values", active: false },
  { id: "v1.0.1", date: "Aug 09, 9:00 AM", author: "Ali Rahman", note: "Initial schematic import", active: false },
];

export default function EngineeringAssetsPage() {
  const [activeVersion, setActiveVersion] = useState(drawingVersions[0].id);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Main CAD Canvas (Dark Inverse) */}
      <div className="flex-1 bg-[#1B1C19] flex flex-col relative">
        {/* Floating Toolbar Top Left */}
        <div className="absolute top-4 left-4 z-10 flex space-x-2">
          <span className="font-jetbrains-mono text-xs font-bold bg-[#2A2B28] text-white px-3 py-1.5 rounded shadow-lg border border-white/10 flex items-center">
            <Cpu className="w-4 h-4 mr-2 text-semantic-emerald" />
            Main_Controller_PCB.SCH
          </span>
          <span className="bg-semantic-sky/20 text-semantic-sky text-xs font-bold px-2 py-1.5 rounded border border-semantic-sky/30">
            .SCH
          </span>
          <span className="bg-[#2A2B28] text-on-surface-variant px-3 py-1.5 rounded shadow-lg border border-white/10 text-xs flex items-center cursor-pointer hover:text-white transition-colors">
            v1.0.4
          </span>
        </div>

        {/* Floating Tools Top Right */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <button className="bg-[#2A2B28] p-2 rounded shadow-lg border border-white/10 text-on-surface-variant hover:text-white transition-colors">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button className="bg-[#2A2B28] p-2 rounded shadow-lg border border-white/10 text-on-surface-variant hover:text-white transition-colors">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button className="bg-[#2A2B28] p-2 rounded shadow-lg border border-white/10 text-on-surface-variant hover:text-white transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mock Canvas Content (Blueprint Pattern) */}
        <div className="flex-1 w-full h-full relative" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <FileBox className="w-64 h-64 text-white/10" />
          </div>
          
          {/* Mock Schematic element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] border-2 border-semantic-sky/40 rounded-lg p-6 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="w-16 h-16 border-2 border-semantic-sky/60 flex items-center justify-center">
                <span className="text-semantic-sky/60 font-jetbrains-mono text-xs">U1</span>
              </div>
              <div className="w-16 h-16 border-2 border-semantic-emerald/60 rounded-full flex items-center justify-center">
                <span className="text-semantic-emerald/60 font-jetbrains-mono text-xs">M1</span>
              </div>
            </div>
            {/* Connecting Line */}
            <div className="absolute top-[38px] left-[88px] right-[88px] h-0.5 bg-semantic-sky/40"></div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#121310] h-12 border-t border-white/10 flex items-center justify-between px-4">
          <div className="flex items-center space-x-3 text-xs text-on-surface-variant">
            <span className="flex items-center"><Settings className="w-3 h-3 mr-1" /> Mech Constraints Met</span>
            <span className="text-white/20">|</span>
            <span className="flex items-center"><Code2 className="w-3 h-3 mr-1" /> Fw Pins Assigned</span>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white text-xs font-medium px-4 py-1.5 rounded flex items-center transition-colors">
            <CheckCircle2 className="w-3 h-3 mr-2" />
            Request Clearance Validation
          </button>
        </div>
      </div>

      {/* Right Sidebar: Version Control */}
      <div className="w-80 bg-surface-container-lowest border-l border-outline-variant/50 flex flex-col">
        <div className="p-4 border-b border-outline-variant/30 flex items-center space-x-2">
          <GitBranch className="w-5 h-5 text-on-surface-variant" />
          <h2 className="font-merriweather font-bold text-on-surface">Version History</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {drawingVersions.map((v, i) => (
            <div 
              key={v.id} 
              className={`relative pl-6 pb-2 cursor-pointer group`}
              onClick={() => setActiveVersion(v.id)}
            >
              {/* Timeline line */}
              {i !== drawingVersions.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-outline-variant/50"></div>
              )}
              
              {/* Timeline node */}
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center bg-surface border-2 ${activeVersion === v.id ? 'border-primary' : 'border-outline-variant group-hover:border-primary/50'}`}>
                {activeVersion === v.id ? (
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-outline-variant group-hover:bg-primary/50"></div>
                )}
              </div>

              <div className={`p-3 rounded-lg border ${activeVersion === v.id ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-surface border-transparent hover:border-outline-variant'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-jetbrains-mono text-sm font-bold ${activeVersion === v.id ? 'text-primary' : 'text-on-surface'}`}>
                    {v.id}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-inter">
                    {v.date}
                  </span>
                </div>
                <p className="text-xs text-on-surface mb-2 font-inter">
                  {v.note}
                </p>
                <div className="flex items-center text-[10px] text-on-surface-variant font-medium">
                  <GitCommit className="w-3 h-3 mr-1" />
                  {v.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
