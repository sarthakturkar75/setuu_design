"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TabBar } from "@/components/ui/TabBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable } from "@/components/ui/DataTable";
import { FileCheckIcon, CalendarIcon, PlusIcon } from "lucide-react";

export default function PMHandoversHub() {
  const [activeTab, setActiveTab] = useState("packages");
  
  const [handovers, setHandovers] = useState([
    { id: "1", project: "Alpha Tower Build", title: "Phase 1 Structure Handover", status: "In Review", statusTone: "amber", completeness: 85 },
    { id: "2", project: "Sector 7 Pipeline", title: "Environmental Sign-off", status: "Draft", statusTone: "slate", completeness: 40 },
    { id: "3", project: "Refinery Expansion", title: "Electrical Subsystem Handover", status: "Approved", statusTone: "emerald", completeness: 100 },
  ]);

  const [meetings, setMeetings] = useState([
    { id: "1", date: "Aug 19, 2026", project: "Alpha Tower Build", topic: "Phase 1 Review", status: "Scheduled", statusTone: "sky", attendees: "Client, Architect, PM" },
    { id: "2", date: "Aug 15, 2026", project: "Sector 7 Pipeline", topic: "Delay Mitigation", status: "Completed", statusTone: "emerald", attendees: "Client, Contractor, PM" },
  ]);

  const addHandover = () => {
      setHandovers([{ id: Date.now().toString(), project: "New Project", title: "Draft Handover", status: "Draft", statusTone: "slate", completeness: 0 }, ...handovers]);
      setActiveTab("packages");
  };

  const addMeeting = () => {
      setMeetings([{ id: Date.now().toString(), date: "TBD", project: "New Project", topic: "Kickoff Meeting", status: "Scheduled", statusTone: "sky", attendees: "TBD" }, ...meetings]);
      setActiveTab("meetings");
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
                  <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">{pkg.project}</div>
                  <h4 className="font-bold text-on-surface">{pkg.title}</h4>
                </div>
                <StatusBadge label={pkg.status} tone={pkg.statusTone as any} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-on-surface-variant">
                  <span>Completeness</span>
                  <span>{pkg.completeness}%</span>
                </div>
                <div className="w-full bg-surface-variant rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${pkg.completeness}%` }}></div>
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
            { header: "Date", key: "date", cell: (row: any) => <span className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-outline" /> {row.date}</span> },
            { header: "Project", key: "project", cell: (row: any) => <>{row.project}</> },
            { header: "Topic", key: "topic", cell: (row: any) => <span className="font-medium text-on-surface">{row.topic}</span> },
            { header: "Status", key: "status", cell: (row: any) => <StatusBadge label={row.status} tone={row.statusTone as any} /> },
            { header: "Attendees", key: "attendees", cell: (row: any) => <>{row.attendees}</> },
          ]}
         
        />
      )}
    </div>
  );
}