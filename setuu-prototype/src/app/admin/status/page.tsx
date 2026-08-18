"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Activity, Database, Key, HardDrive, Globe, ServerCrash, AlertTriangle, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function SystemStatusPage() {
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Global System Status" 
        subtitle="Real-time uptime monitoring and incident communication center"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Status</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
            <PlusCircle className="w-4 h-4" />
            Post Incident Update
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full flex flex-col gap-8">
        
        {/* Global Status Banner */}
        <div className="w-full p-8 rounded-xl bg-emerald-500/10 border-2 border-semantic-emerald/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-semantic-emerald flex items-center justify-center shadow-elevation-l2">
              <ShieldCheck className="w-8 h-8 text-on-primary" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-semantic-emerald tracking-tight">All Systems Operational</h1>
              <p className="text-on-surface-variant mt-1">Uptime: 99.998% over the last 30 days.</p>
            </div>
          </div>
          <div className="flex flex-col items-end text-sm text-on-surface-variant font-jetbrains">
            <span>Last checked: Just now</span>
            <span className="flex items-center gap-2 mt-1"><Activity className="w-4 h-4 text-primary" /> Active Monitoring</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Services List */}
          <Card className="col-span-1 lg:col-span-2 flex flex-col p-0 overflow-hidden border-outline-variant">
            <div className="p-4 border-b border-outline-variant bg-surface-variant/30">
              <h3 className="font-semibold text-on-surface">Core Infrastructure Components</h3>
            </div>
            
            <div className="flex flex-col divide-y divide-outline-variant">
              
              <div className="p-4 flex items-center justify-between bg-surface hover:bg-surface-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-on-surface-variant" />
                  <span className="font-medium text-on-surface">Edge Network & Routing</span>
                </div>
                <span className="text-sm font-bold text-semantic-emerald flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-semantic-emerald animate-pulse" /> Operational
                </span>
              </div>
              
              <div className="p-4 flex items-center justify-between bg-surface hover:bg-surface-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-on-surface-variant" />
                  <span className="font-medium text-on-surface">Authentication & IAM</span>
                </div>
                <span className="text-sm font-bold text-semantic-emerald flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-semantic-emerald animate-pulse" /> Operational
                </span>
              </div>

              <div className="p-4 flex items-center justify-between bg-surface hover:bg-surface-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-on-surface-variant" />
                  <span className="font-medium text-on-surface">Core API Layer</span>
                </div>
                <span className="text-sm font-bold text-semantic-emerald flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-semantic-emerald animate-pulse" /> Operational
                </span>
              </div>

              <div className="p-4 flex items-center justify-between bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <div className="flex items-center gap-3">
                  <HardDrive className="w-5 h-5 text-semantic-amber" />
                  <span className="font-medium text-on-surface">Document Storage S3</span>
                </div>
                <span className="text-sm font-bold text-semantic-amber flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Degraded Performance
                </span>
              </div>

              <div className="p-4 flex items-center justify-between bg-surface hover:bg-surface-variant/30 transition-colors">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-on-surface-variant" />
                  <span className="font-medium text-on-surface">Relational Database</span>
                </div>
                <span className="text-sm font-bold text-semantic-emerald flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-semantic-emerald animate-pulse" /> Operational
                </span>
              </div>

            </div>
          </Card>

          {/* Incident Timeline */}
          <Card className="col-span-1 flex flex-col p-0 overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-variant/30 flex items-center justify-between">
              <h3 className="font-semibold text-on-surface">Incident History</h3>
              <span className="text-xs font-bold text-on-surface-variant uppercase">Past 30 Days</span>
            </div>
            
            <div className="p-6 flex flex-col gap-8 relative">
              
              {/* Timeline Line */}
              <div className="absolute left-[39px] top-6 bottom-6 w-px bg-outline-variant" />

              {/* Ongoing Incident */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-semantic-amber/20 border-2 border-surface flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-semantic-amber" />
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  <span className="text-sm font-bold text-semantic-amber">Document Storage Latency</span>
                  <span className="text-xs font-jetbrains text-on-surface-variant">Today, 14:00 UTC</span>
                  <p className="text-sm text-on-surface leading-relaxed">We are currently investigating reports of slow download speeds for PDF drawings larger than 50MB. Engineering is isolating the affected S3 bucket.</p>
                </div>
              </div>

              {/* Past Incident */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-surface-variant border-2 border-surface flex items-center justify-center shrink-0">
                  <ServerCrash className="w-5 h-5 text-on-surface-variant" />
                </div>
                <div className="flex flex-col gap-2 mt-1 opacity-70">
                  <span className="text-sm font-bold text-on-surface">Auth Gateway Timeouts</span>
                  <span className="text-xs font-jetbrains text-on-surface-variant">Oct 12, 2026</span>
                  <p className="text-sm text-on-surface leading-relaxed">Resolved. A misconfigured Redis cache caused intermittent session drops. The cache was purged and scaled horizontally.</p>
                </div>
              </div>

            </div>
          </Card>

        </div>

      </div>
    </div>
  );
}
