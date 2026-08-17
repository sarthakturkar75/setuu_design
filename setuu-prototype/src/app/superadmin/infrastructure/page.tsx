"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FilterBar } from "@/components/ui/FilterBar";
import { Server, ShieldAlert, Activity, Database, Play, Pause, Maximize2 } from "lucide-react";

export default function InfrastructureCommand() {
  const [isPaused, setIsPaused] = React.useState(false);

  const nodeTopology = [
    { region: "ap-south-1 (Mumbai)", status: "emerald", load: 45, type: "Primary Cluster" },
    { region: "eu-central-1 (Frankfurt)", status: "emerald", load: 62, type: "Replica" },
    { region: "us-east-1 (N. Virginia)", status: "amber", load: 88, type: "Edge Node" },
    { region: "ap-southeast-1 (Singapore)", status: "emerald", load: 30, type: "Edge Node" }
  ];

  const edgeThreats = [
    { timestamp: "2026-08-17T06:12:00Z", ip: "192.168.1.45", threat: "DDoS Attempt", status: "Blocked" },
    { timestamp: "2026-08-17T05:40:00Z", ip: "45.22.19.102", threat: "SQL Injection", status: "Blocked" },
    { timestamp: "2026-08-17T04:15:00Z", ip: "112.44.55.10", threat: "Brute Force", status: "Blocked" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Infrastructure Command" 
        subtitle="Global Node Topology & Edge Security" 
        actions={
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant/80 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "Resume Live Feed" : "Pause Live Feed"}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Maximize2 className="w-4 h-4" />
              Expand View
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Visualization */}
        <Card title="Global Node Topology" className="col-span-1 lg:col-span-2">
          <div className="p-2 space-y-4">
            <FilterBar onClear={() => {}} onApply={() => {}}>
              <input type="text" placeholder="Filter Errors..." className="w-full bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface focus:outline-none" />
            </FilterBar>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {nodeTopology.map((node, idx) => (
                <div key={idx} className="p-4 border border-outline-variant/30 rounded-lg bg-surface-container flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-on-surface-variant" />
                      <div>
                        <h4 className="text-sm font-semibold text-on-surface">{node.region}</h4>
                        <p className="text-xs text-on-surface-variant">{node.type}</p>
                      </div>
                    </div>
                    <StatusBadge tone={node.status as any} label={node.status === "emerald" ? "Healthy" : "Warning"} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-on-surface-variant">Compute Load</span>
                      <span className="text-on-surface">{node.load}%</span>
                    </div>
                    <ProgressBar progress={node.load} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="col-span-1 space-y-6">
          {/* Storage Quota Panel */}
          <Card title="S3 Storage Quota">
            <div className="p-2 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant flex items-center gap-2">
                  <Database className="w-4 h-4" /> Allocated
                </span>
                <span className="font-jetbrains-mono font-medium text-on-surface">1,024 TB</span>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface-variant">Utilized</span>
                  <span className="font-medium text-semantic-amber">842 TB (82%)</span>
                </div>
                <ProgressBar progress={82} />
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-surface-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-variant/80 transition-colors">
                Request Quota Increase
              </button>
            </div>
          </Card>

          {/* Edge Threat Panel */}
          <Card title="Edge Threat Detection">
            <div className="p-2 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-semantic-crimson-bg/10 rounded-lg border border-semantic-crimson-bg/20">
                <ShieldAlert className="w-6 h-6 text-semantic-crimson shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-semantic-crimson">Active Protection On</h4>
                  <p className="text-xs text-on-surface-variant">42 threats neutralized in last 24h</p>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h5 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Recent Intercepts</h5>
                {edgeThreats.map((threat, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-outline-variant/20 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{threat.threat}</p>
                      <p className="text-xs font-jetbrains-mono text-on-surface-variant">{threat.ip}</p>
                    </div>
                    <StatusBadge tone="slate" label={threat.status} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
