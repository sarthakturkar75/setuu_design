import * as React from "react";
import { KPICard } from "@/components/ui/KPICard";
import { DonutChart } from "@/components/ui/DonutChart";
import { BarChart } from "@/components/ui/BarChart";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Activity, Database, Zap, AlertOctagon, RefreshCcw } from "lucide-react";

export default function SuperadminControlCenter() {
  // Mock data for prototype rendering
  const kpiData = [
    { label: "Active Sessions", value: "1,248", trend: { value: 12, label: "vs last hour", isPositive: true }, icon: <Activity className="w-5 h-5" /> },
    { label: "DB Connections", value: "342", icon: <Database className="w-5 h-5" /> },
    { label: "API Latency", value: "48ms", trend: { value: 5, label: "ms slower", isPositive: false }, icon: <Zap className="w-5 h-5" /> },
    { label: "Error Rate (5xx)", value: "0.02%", trend: { value: 0.01, label: "% down", isPositive: true }, icon: <AlertOctagon className="w-5 h-5 text-crimson-500" /> },
    { label: "Sync Queue", value: "45", trend: { value: 20, label: "items cleared", isPositive: true }, icon: <RefreshCcw className="w-5 h-5" /> }
  ];

  const storageData = [
    { name: "Praimo", value: 450, color: "var(--semantic-emerald)" },
    { name: "Acme Corp", value: 320, color: "var(--semantic-blue)" },
    { name: "Stark Ind", value: 150, color: "var(--semantic-purple)" },
    { name: "Available", value: 80, color: "var(--surface-variant)" }
  ];

  // Map to BarChart structure
  const regionalData = [
    { region: "ap-south-1", Usage: 45 },
    { region: "eu-central-1", Usage: 30 },
    { region: "us-east-1", Usage: 15 },
    { region: "ap-southeast-1", Usage: 10 }
  ];

  const systemStatus = [
    { service: "Core API Gateway", tone: "emerald", label: "Operational" },
    { service: "Auth Subsystem", tone: "emerald", label: "Operational" },
    { service: "Real-time Sync Engine", tone: "sky", label: "Syncing" },
    { service: "Blob Storage", tone: "emerald", label: "Operational" },
    { service: "PDF Generation Service", tone: "amber", label: "Queued" },
    { service: "Threat Detection (ClamAV)", tone: "emerald", label: "Operational" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Control Center" 
        subtitle="Global platform telemetry and real-time infrastructure health." 
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
        {/* Storage Quota */}
        <Card title="Global Storage Quota" className="col-span-1 flex flex-col items-center justify-center py-6">
          <DonutChart 
            data={storageData} 
            title="Global Storage"
            totalLabel="1 TB"
          />
          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            {storageData.map((s, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-on-surface-variant">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Distribution */}
        <Card title="Regional Data Distribution (%)" className="col-span-1 lg:col-span-2 flex flex-col justify-center">
          <div className="h-64 px-4 w-full pt-4">
            <BarChart 
              data={regionalData}
              keys={["Usage"]}
              colors={["var(--semantic-blue)"]}
              xAxisKey="region"
              height={220}
            />
          </div>
        </Card>
      </div>

      {/* System Status Indicators */}
      <Card title="Infrastructure Services Health">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
          {systemStatus.map((sys, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-surface-variant/50 border border-outline-variant/30">
              <span className="font-medium text-on-surface text-sm">{sys.service}</span>
              <StatusBadge tone={sys.tone as any} label={sys.label} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
