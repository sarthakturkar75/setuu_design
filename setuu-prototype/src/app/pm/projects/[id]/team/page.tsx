"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";

export default function ProjectTeamPage() {
  const team = [
    { id: "1", name: "David Miller", role: "Site Supervisor", phone: "+1 555-0198" },
    { id: "2", name: "Sarah Jenkins", role: "Lead Engineer", phone: "+1 555-0233" }
  ];

  const columns = [
    { key: "name", header: "Name", cell: (row: any) => <span className="font-medium text-on-surface">{row.name}</span> },
    { key: "role", header: "Role", cell: (row: any) => <>{row.role}</> },
    { key: "phone", header: "Contact", cell: (row: any) => <span className="text-sm">{row.phone}</span> }
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <h2 className="text-xl font-bold font-merriweather text-on-surface mb-6">Team Directory</h2>
      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={team} columns={columns} />
      </div>
    </div>
  );
}
