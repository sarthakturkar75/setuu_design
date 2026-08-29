"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjectDrawings } from "@/app/actions/drawingActions";
import { Button } from "@/components/ui/Button";

export default function EngineerDrawings({ params }: { params: { id: string } }) {
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrawing, setSelectedDrawing] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjectDrawings(params.id);
        setDrawings(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <PageHeader title="Drawings Hub" subtitle="View latest revisions and annotations." />
      
      <div className="flex flex-1 gap-6 min-h-[500px]">
        {/* Left Panel: Drawing List */}
        <Card className="w-1/4 p-4 overflow-y-auto">
          <h3 className="font-bold mb-4 text-on-surface">Sheets</h3>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-10 bg-surface-variant rounded"></div>
              <div className="h-10 bg-surface-variant rounded"></div>
            </div>
          ) : drawings.length === 0 ? (
            <div className="text-sm text-on-surface-variant">No drawings found.</div>
          ) : (
            <div className="space-y-2">
              {drawings.map(d => (
                <div 
                  key={d.id} 
                  onClick={() => setSelectedDrawing(d)}
                  className={`p-2 rounded cursor-pointer text-sm font-medium border border-outline-variant/30 ${selectedDrawing?.id === d.id ? 'bg-primary/10 text-primary border-primary/50' : 'hover:bg-surface-variant text-on-surface'}`}
                >
                  <div className="font-bold truncate">{d.title}</div>
                  <div className="text-xs text-on-surface-variant mt-1">Discipline: {d.discipline || 'General'}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Right Panel: Interactive Canvas Placeholder */}
        <Card className="flex-1 p-0 overflow-hidden flex flex-col bg-slate-900 border-none">
          {selectedDrawing ? (
            <div className="h-full flex flex-col relative">
              <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur text-white px-4 py-2 rounded-lg">
                <div className="font-bold">{selectedDrawing.title}</div>
                <div className="text-xs opacity-70">Rev {selectedDrawing.drawing_versions?.length || 1}</div>
              </div>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20">Diff Version</Button>
                <Button size="sm" variant="outline" className="bg-black/50 text-white border-white/20">Add Pin</Button>
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-700 m-4 rounded-lg">
                {selectedDrawing.file_url ? <iframe src={selectedDrawing.file_url} className="w-full h-full rounded-lg" title={selectedDrawing.title} /> : "[ PDF or Image Canvas Rendered Here ]"}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">
              Select a sheet to view
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
