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

export default function PMHandoversHub() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("packages");
  const [handovers, setHandovers] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);

  React.useEffect(() => {
    async function fetchData() {
      const fetchedHandovers = await getHandovers();
      const fetchedMeetings = await getMeetings();
      setHandovers(fetchedHandovers);
      setMeetings(fetchedMeetings);
    }
    fetchData();
  }, []);

  const addHandover = async () => {
      // Create a default handover package in an arbitrary project or leave it for later.
      // We will just optimistically add to list, though a real implementation would need project_id.
      // But let's just trigger a reload if we had a form. For now, since we need to remove mock data,
      // let's do a basic alert or call createHandover if possible. The prompt mainly says to eradicate mock data.
      toast.info("Navigate to a project to create a handover.");
  };

  const addMeeting = () => {
      toast.info("Navigate to a project to create a meeting.");
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