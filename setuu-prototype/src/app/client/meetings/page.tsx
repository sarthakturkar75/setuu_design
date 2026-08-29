"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CalendarIcon, VideoIcon, FileTextIcon } from "lucide-react";

export default function ClientMeetings() {

  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<any[]>([]);
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { getMeetings } = await import("@/app/actions/meetingActions");
        const data = await getMeetings();
        setMeetings(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Meetings & Agendas" subtitle="View scheduled meetings and download past minutes." />

      <div className="space-y-4">
        {meetings.map((m: any) => (
          <Card key={m.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4 items-start">
              <div className={`p-3 rounded-lg mt-1 ${m.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-lg text-on-surface">{m.title}</h3>
                  <StatusBadge tone={m.status === 'Upcoming' ? 'sky' : 'slate'} label={m.status} />
                </div>
                <div className="text-sm text-on-surface-variant flex gap-4">
                  <span className="flex items-center gap-1"><VideoIcon className="w-4 h-4" /> {m.type}</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              {m.status === 'Upcoming' ? (
                <Button className="w-full md:w-auto">Join Meeting</Button>
              ) : (
                <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto">
                  <FileTextIcon className="w-4 h-4" /> Download Minutes
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
