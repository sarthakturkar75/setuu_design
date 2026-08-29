"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getProjects } from "@/app/actions/projectActions";
import { getProjectCommunications } from "@/app/actions/communicationActions";
import { Button } from "@/components/ui/Button";

export default function VendorCollaboration() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const projects = await getProjects();
        if (projects && projects.length > 0) {
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
      <PageHeader title="Vendor Communications" subtitle="Cross-project messaging and support threads." />
      
      <Card className="flex-1 p-0 flex flex-col overflow-hidden min-h-[500px]">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-surface-variant rounded"></div>
              <div className="h-16 bg-surface-variant rounded w-3/4"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-on-surface-variant py-12">
              No recent messages found.
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className="p-4 bg-surface-variant rounded-lg border border-outline-variant/30">
                <div className="font-semibold text-on-surface">{msg.subject}</div>
                <div className="text-sm text-on-surface-variant mt-1">{msg.body}</div>
                <div className="text-xs text-outline mt-2">{new Date(msg.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-surface-container border-t border-outline-variant/30 flex gap-2">
          <input type="text" placeholder="Type a message..." className="flex-1 bg-surface border border-outline-variant rounded-lg px-4 py-2" />
          <Button variant="primary">Send</Button>
        </div>
      </Card>
    </div>
  );
}
