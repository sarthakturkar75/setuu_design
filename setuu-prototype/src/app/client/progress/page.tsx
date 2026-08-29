"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjects } from "@/app/actions/projectActions";
import { getUpdates } from "@/app/actions/updateActions";

export default function ClientProgress() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [updates, setUpdates] = useState<any[]>([]);
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
    async function loadUpdates() {
      if (!selectedProject) return;
      setLoading(true);
      try {
        const data = await getUpdates({ projectId: selectedProject });
        setUpdates(data || []);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    }
    loadUpdates();
  }, [selectedProject]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <PageHeader title="Site Progress Feed" subtitle="Daily logs, photos, and updates from the field." />
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

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant before:to-transparent">
        {loading ? (
          <div className="text-center animate-pulse py-8 text-on-surface-variant">Loading feed...</div>
        ) : updates.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant">No updates posted for this project yet.</div>
        ) : (
          updates.map((update, index) => (
            <div key={update.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active`}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-surface-container text-on-surface shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-on-surface">{update.user?.full_name || 'System User'}</span>
                  <span className="text-xs text-on-surface-variant">{new Date(update.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-on-surface-variant">{update.content}</p>
                {update.image_url && (
                  <div className="mt-4 rounded-lg overflow-hidden border border-outline-variant/30 aspect-video bg-black/10 flex items-center justify-center text-on-surface-variant text-xs">
                    [Image Preview: {update.image_url.split('/').pop()}]
                  </div>
                )}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
