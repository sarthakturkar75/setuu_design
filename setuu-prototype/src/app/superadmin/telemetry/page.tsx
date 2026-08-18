"use client";

import React, { useEffect, useState } from "react";
import { getTelemetryData } from "@/app/actions/platformActions";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { KPICard } from "@/components/ui/KPICard";
import { BarChart } from "@/components/ui/BarChart";
import { DonutChart } from "@/components/ui/DonutChart";
import { DataTable } from "@/components/ui/DataTable";
import { Activity, Shield, HardDrive, Download, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function PlatformTelemetry() {
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [apiRequestData, setApiRequestData] = useState<any[]>([]);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [securityEvents, setSecurityEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTelemetryData().then(data => {
      setKpiData(data.kpiData || []);
      setApiRequestData(data.apiRequestData || []);
      setRegionalData(data.regionalData || []);
      setSecurityEvents(data.securityEvents || []);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: "time", header: "Time", cell: (row: any) => <span className="font-jetbrains-mono text-xs">{row.created_at}</span> },
    { key: "type", header: "Event Type", cell: (row: any) => row.event_type },
    { key: "region", header: "Table", cell: (row: any) => row.table_name },
    { key: "severity", header: "Severity", cell: (row: any) => (
      <StatusBadge tone="slate" label="Log" />
    )},
    { key: "status", header: "Resolution", cell: (row: any) => (
      <span className="text-xs font-semibold text-semantic-emerald">Logged</span>
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
