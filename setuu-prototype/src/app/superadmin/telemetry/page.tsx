"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { BarChart } from "@/components/ui/BarChart";
import { DonutChart } from "@/components/ui/DonutChart";
import { DataTable } from "@/components/ui/DataTable";
import { Activity, Shield, HardDrive, Download, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function PlatformTelemetry() {
  const kpiData = [
    { label: "Total API Requests (24h)", value: "12.4M", trend: { value: 5.2, label: "% increase", isPositive: true }, icon: <Activity className="w-5 h-5 text-semantic-blue" /> },
    { label: "Threats Intercepted", value: "8,942", trend: { value: 12, label: "% decrease", isPositive: true }, icon: <Shield className="w-5 h-5 text-semantic-emerald" /> },
    { label: "Storage Saved (Dedup)", value: "452 GB", trend: { value: 45, label: "GB this week", isPositive: true }, icon: <HardDrive className="w-5 h-5 text-semantic-purple" /> },
  ];

  // Map to BarChart structure
  const apiRequestData = [
    { hour: "00:00", Requests: 450 },
    { hour: "04:00", Requests: 300 },
    { hour: "08:00", Requests: 800 },
    { hour: "12:00", Requests: 1200 },
    { hour: "16:00", Requests: 950 },
    { hour: "20:00", Requests: 600 },
    { hour: "23:59", Requests: 480 },
  ];

  const regionalData = [
    { name: "US East", value: 45, color: "var(--semantic-blue)" },
    { name: "EU Central", value: 30, color: "var(--semantic-emerald)" },
    { name: "AP South", value: 15, color: "var(--semantic-amber)" },
    { name: "SA East", value: 10, color: "var(--semantic-purple)" }
  ];

  const securityEvents = [
    { id: "SEC-101", time: "10:45:00 UTC", type: "DDoS Attempt", region: "EU Central", status: "Mitigated", severity: "high" },
    { id: "SEC-102", time: "09:30:12 UTC", type: "Brute Force (SSH)", region: "US East", status: "Blocked", severity: "medium" },
    { id: "SEC-103", time: "08:15:44 UTC", type: "Suspicious API Pattern", region: "AP South", status: "Flagged", severity: "low" },
    { id: "SEC-104", time: "05:00:10 UTC", type: "SQL Injection Payload", region: "US East", status: "Blocked", severity: "critical" },
  ];

  const columns = [
    { key: "time", header: "Time", cell: (row: any) => <span className="font-jetbrains-mono text-xs">{row.time}</span> },
    { key: "type", header: "Event Type", cell: (row: any) => row.type },
    { key: "region", header: "Region", cell: (row: any) => row.region },
    { key: "severity", header: "Severity", cell: (row: any) => (
      <StatusBadge 
        tone={row.severity === "critical" ? "crimson" : row.severity === "high" ? "amber" : row.severity === "medium" ? "amber" : "slate"} 
        label={row.severity} 
      />
    )},
    { key: "status", header: "Resolution", cell: (row: any) => (
      <span className={`text-xs font-semibold uppercase ${row.status === 'Blocked' || row.status === 'Mitigated' ? 'text-semantic-emerald' : 'text-semantic-amber'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Platform Telemetry" 
        subtitle="Global metrics, API traffic analysis, and edge security events."
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant/80 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((kpi, idx) => (
          <KPICard 
            key={idx}
            title={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="API Request Volume (24h)" className="col-span-1 lg:col-span-2">
          <div className="p-4 h-72">
            <BarChart 
              data={apiRequestData}
              keys={["Requests"]}
              colors={["var(--semantic-blue)"]}
              xAxisKey="hour"
              height={260}
            />
          </div>
        </Card>

        <Card title="Regional Traffic Distribution" className="col-span-1 flex flex-col items-center py-6">
          <DonutChart 
            data={regionalData} 
            title="Global Traffic"
            totalLabel="100%"
          />
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {regionalData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Global Security Events">
        <div className="p-2">
          <DataTable 
            columns={columns}
            data={securityEvents}
          />
        </div>
      </Card>
    </div>
  );
}
