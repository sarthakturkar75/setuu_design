"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TabBar } from "@/components/ui/TabBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { FileCheckIcon, CalendarIcon, PlusIcon } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

import { getHandovers } from "@/app/actions/handoverActions";
import { getMeetings } from "@/app/actions/meetingActions";

import { createMeeting } from "@/app/actions/meetingActions";
import { getProjects } from "@/app/actions/projectActions";
import { X } from "lucide-react";

function ScheduleMeetingModal({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const toast = useToast();

  React.useEffect(() => {
    if (isOpen) {
      getProjects().then(d => setProjects(d || []));
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await createMeeting({
        project_id: fd.get("project_id"),
        title: fd.get("title"),
        description: fd.get("description"),
        meeting_date: fd.get("meeting_date"),
        attendees: fd.get("attendees"),
      });
      if (res.success) {
        toast.success("Meeting scheduled successfully");
        onRefresh();
        onClose();
      } else {
        toast.error(res.error || "Failed to schedule meeting");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-outline/10">
          <h2 className="text-xl font-semibold text-on-surface">Schedule Meeting</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Project</label>
            <select name="project_id" required className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface">
              <option value="">Select Project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Title / Topic</label>
            <input name="title" required className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Date & Time</label>
            <input type="datetime-local" name="meeting_date" required className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Attendees (Emails or Roles)</label>
            <input name="attendees" placeholder="Client, Subcontractor, Architect..." required className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Agenda / Description</label>
            <textarea name="description" rows={3} className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Schedule"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useRouter } from "next/navigation";

export default function PMHandoversHub() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("packages");
  const [handovers, setHandovers] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  React.useEffect(() => {
    async function fetchData() {
      const fetchedHandovers = await getHandovers();
      const fetchedMeetings = await getMeetings();
      setHandovers(fetchedHandovers);
      setMeetings(fetchedMeetings);
    }
    fetchData();
  }, []);

  const router = useRouter();

  const addHandover = async () => {
      toast.info("Navigate to a project to create a handover.");
      router.push("/pm/projects");
  };

  const addMeeting = () => {
      setIsMeetingModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      <PageHeader 
        title="Handovers & Meetings" 
        subtitle="Manage project closeouts and client engagements."
        actions={
          <div className="flex gap-3">
            <Button variant="outline" onClick={addMeeting}><PlusIcon className="w-4 h-4 mr-2" /> New Meeting</Button>
            <Button variant="primary" onClick={addHandover}><FileCheckIcon className="w-4 h-4 mr-2" /> New Handover</Button>
          </div>
        }
      />

      <TabBar 
        tabs={[
          { id: "packages", label: "Handover Packages" },
          { id: "meetings", label: "Client Meetings" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {handovers.map(pkg => (
            <Card key={pkg.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{pkg.project_name || "Unknown Project"}</div>
                  <h4 className="font-bold text-on-surface">{pkg.package_name}</h4>
                </div>
                <StatusBadge label={pkg.status} tone={pkg.status === "Approved" ? "emerald" : pkg.status === "Draft" ? "slate" : "amber"} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Completeness</span>
                  <span>{pkg.completeness || 0}%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${pkg.completeness || 0}%` }}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "meetings" && (
        <DataTable 
          data={meetings}
          columns={[
            { header: "Date", key: "meeting_date", cell: (row: any) => <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-outline" /> {new Date(row.meeting_date).toLocaleDateString()}</span> },
            { header: "Project", key: "project_name", cell: (row: any) => <>{row.project_name || "Unknown Project"}</> },
            { header: "Topic", key: "title", cell: (row: any) => <span className="font-medium text-on-surface">{row.title}</span> },
            { header: "Status", key: "status", cell: (row: any) => <StatusBadge label={row.status} tone={row.status === "Completed" ? "emerald" : "sky"} /> },
            { header: "Attendees", key: "attendees", cell: (row: any) => <>{row.attendees}</> },
          ]}
         
        />
      )}
    </div>
  );
}