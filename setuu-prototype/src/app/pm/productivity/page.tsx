"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getProductivityMatrix } from "@/app/actions/productivityActions";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function PMProductivityMatrix() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const matrix = await getProductivityMatrix();
      setData(matrix || []);
      setIsLoading(false);
    }
    load();
  }, []);

  const columns = [
    { key: "name", header: "User Name", cell: (row: any) => row.name },
    { key: "role", header: "Role", cell: (row: any) => <span className="capitalize">{row.role}</span> },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge tone={row.status === "Active" ? "emerald" : "slate"} label={row.status} /> },
    { key: "score", header: "Productivity Score", cell: (row: any) => (
      <div className="flex items-center space-x-2">
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className={`h-2 rounded-full ${row.score >= 80 ? 'bg-green-500' : row.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${row.score}%` }}></div>
        </div>
        <span className="text-sm text-slate-300 font-medium">{row.score}%</span>
      </div>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Comprehensive Productivity Matrix" 
        subtitle="Monitor efficiency across Engineers, PMs, and Vendors based on role-specific KPIs." 
      />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={data} isLoading={isLoading} />
      </Card>
    </div>
  );
}
