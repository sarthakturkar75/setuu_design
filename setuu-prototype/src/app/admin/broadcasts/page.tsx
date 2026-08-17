"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { TextInput } from "@/components/ui/TextInput";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { Radio, AlertTriangle, Send, Save, Bold, Italic, List, Link as LinkIcon, Users, Building2, MousePointerClick, MailOpen } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function BroadcastCenterPage() {
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Bulk Notification & Broadcast Center" 
        subtitle="Dispatch targeted communications or emergency alerts across the network"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Broadcasts</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Link href="/admin/security/audit" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              View Audit Log
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Save className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row gap-6">
        
        {/* Composer Panel */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          <Card className="flex flex-col overflow-hidden">
            <div className="p-4 border-b border-outline-variant bg-surface-variant/30 flex items-center justify-between">
              <h2 className="font-semibold text-on-surface flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" /> Compose Broadcast
              </h2>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Recipient Targeting</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectMenu 
                    options={[
                      { label: "Target: All Organizations", value: "all" },
                      { label: "Specific Project Team", value: "project" },
                      { label: "Specific Role Group", value: "role" },
                    ]}
                    value="all"
                    onChange={() => {}}
                  />
                  <SelectMenu 
                    options={[
                      { label: "Platform: All Devices", value: "all" },
                      { label: "Mobile App Only", value: "mobile" },
                      { label: "Web Portal Only", value: "web" },
                    ]}
                    value="all"
                    onChange={() => {}}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Subject Line</label>
                <TextInput placeholder="e.g., Scheduled Maintenance Window for Q4" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">Message Body</label>
                <div className="border border-outline-variant rounded-lg overflow-hidden flex flex-col focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  
                  {/* Rich Text Toolbar Mock */}
                  <div className="p-2 border-b border-outline-variant bg-surface-variant/30 flex items-center gap-2">
                    <button className="p-1.5 hover:bg-surface rounded text-on-surface-variant hover:text-on-surface transition-colors"><Bold className="w-4 h-4" /></button>
                    <button className="p-1.5 hover:bg-surface rounded text-on-surface-variant hover:text-on-surface transition-colors"><Italic className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-outline-variant mx-1" />
                    <button className="p-1.5 hover:bg-surface rounded text-on-surface-variant hover:text-on-surface transition-colors"><List className="w-4 h-4" /></button>
                    <div className="w-px h-4 bg-outline-variant mx-1" />
                    <button className="p-1.5 hover:bg-surface rounded text-on-surface-variant hover:text-on-surface transition-colors"><LinkIcon className="w-4 h-4" /></button>
                  </div>
                  
                  <textarea 
                    className="w-full p-4 bg-surface text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none min-h-[250px] resize-y"
                    placeholder="Write your broadcast message here..."
                  />
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 flex items-start sm:items-center justify-between gap-4 transition-colors ${isEmergency ? "border-crimson bg-crimson/5" : "border-outline-variant bg-surface"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isEmergency ? "bg-crimson text-white shadow-elevation-l1" : "bg-surface-variant text-on-surface-variant"}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`font-bold ${isEmergency ? "text-crimson" : "text-on-surface"}`}>Emergency Protocol Override</span>
                    <span className="text-sm text-on-surface-variant">Bypass user notification preferences and send immediately via SMS and Push.</span>
                  </div>
                </div>
                <ToggleSwitch checked={isEmergency} onChange={(c) => setIsEmergency(c)} />
              </div>

              <div className="mt-4 border-t border-outline-variant pt-6">
                <button className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-elevation-l1 ${isEmergency ? "bg-crimson text-white hover:bg-crimson/90" : "bg-primary text-on-primary hover:bg-primary/90"}`}>
                  <Send className="w-4 h-4" />
                  {isEmergency ? "DISPATCH EMERGENCY ALERT NOW" : "Dispatch Broadcast"}
                </button>
              </div>

            </div>
          </Card>
        </div>

        {/* Metrics Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <h2 className="text-lg font-bold text-on-surface">Recent Metrics</h2>
          
          <Card className="p-6 flex flex-col gap-6 bg-primary/5 border-primary/20">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Previous Broadcast</span>
              <span className="font-semibold text-on-surface leading-tight">Q3 System Update Notification</span>
              <span className="text-sm font-jetbrains text-on-surface-variant mt-1">Oct 01, 2026</span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-on-surface-variant" />
                  <span className="text-sm font-medium text-on-surface-variant">Total Sent</span>
                </div>
                <span className="font-bold text-on-surface font-jetbrains">4,192</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
                <div className="flex items-center gap-2">
                  <MailOpen className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-medium text-on-surface-variant">Open Rate</span>
                </div>
                <span className="font-bold text-emerald-500 font-jetbrains">68.4%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg border border-outline-variant">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-sky" />
                  <span className="text-sm font-medium text-on-surface-variant">Click Rate</span>
                </div>
                <span className="font-bold text-sky font-jetbrains">21.2%</span>
              </div>
            </div>
            
            <button className="text-sm font-semibold text-primary hover:underline text-left mt-2">
              View Detailed Analytics →
            </button>
          </Card>

          <Card className="p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-on-surface">Targeting Reach Estimate</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">Selected Audience:</span>
              <span className="font-bold text-on-surface">All Organizations</span>
            </div>
            <div className="w-full bg-outline-variant/30 rounded-full h-2">
              <div className="bg-primary h-full rounded-full w-full" />
            </div>
            <div className="flex items-center justify-between text-xs font-jetbrains text-on-surface-variant">
              <span>0</span>
              <span>Est. 8,450 users</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
