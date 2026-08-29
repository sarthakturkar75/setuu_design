"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjects } from "@/app/actions/projectActions";
import { getProjectCommunications } from "@/app/actions/communicationActions";

export default function EngineerCollaboration() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const projects = await getProjects();
        if (projects && projects.length > 0) {
          // Fetch from first active project as a prototype for cross-project
          const msgs = await getProjectCommunications(projects[0].id);
          setMessages(msgs || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <PageHeader title="Global Collaboration Hub" subtitle="Cross-project @mention feed and recent discussions." />
      
      <Card className="flex-1 p-6 overflow-hidden flex flex-col">
        <h3 className="font-bold text-lg mb-4 text-on-surface">Recent Mentions & Broadcasts</h3>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-surface-variant rounded"></div>
            <div className="h-16 bg-surface-variant rounded"></div>
            <div className="h-16 bg-surface-variant rounded"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-on-surface-variant h-full flex items-center justify-center">No recent messages found.</div>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 bg-surface-container rounded-lg border border-outline-variant/30">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-on-surface">{msg.sender?.full_name || "Unknown"}</span>
                  <span className="text-xs text-on-surface-variant">{new Date(msg.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-on-surface-variant">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
