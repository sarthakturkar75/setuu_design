"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjects } from "@/app/actions/projectActions";
import { getProjectDrawings } from "@/app/actions/drawingActions";
import { Button } from "@/components/ui/Button";

export default function ClientDrawings() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const projs = await getProjects();
        setProjects(projs || []);
        if (projs && projs.length > 0) {
          setSelectedProject(projs[0].id);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadDrawings() {
      if (!selectedProject) return;
      setLoading(true);
      try {
        const data = await getProjectDrawings(selectedProject);
        setDrawings(data || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadDrawings();
  }, [selectedProject]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end">
        <PageHeader title="Drawing Hub" subtitle="Read-only access to approved site drawings." />
        <select 
          className="bg-surface-container border border-outline rounded p-2 text-on-surface mb-2"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      
      <Card className="flex-1 p-0 overflow-hidden flex flex-col bg-slate-900 border-none min-h-[500px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-slate-500 animate-pulse">
            Loading blueprints...
          </div>
        ) : drawings.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            No approved drawings available for this project.
          </div>
        ) : (
          <div className="h-full flex flex-col relative">
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur text-white px-4 py-2 rounded-lg">
              <div className="font-bold">{drawings[0].title}</div>
              <div className="text-xs opacity-70">Read Only View</div>
            </div>
            <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-700 m-4 rounded-lg">
              [ Interactive Drawing Canvas (Read-Only) ]
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
