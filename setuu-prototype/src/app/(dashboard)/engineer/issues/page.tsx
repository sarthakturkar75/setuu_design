"use client";

import * as React from "react";
import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Modal } from "@/components/ui/Modal";
import { 
  PlusCircle, 
  Search, 
  Filter,
  AlertTriangle,
  UploadCloud,
  FileBox,
  Image as ImageIcon
} from "lucide-react";

// Mock Issues Data
const issues = [
  {
    id: "BUG-9012",
    title: "Thermal throttling on secondary MCU",
    severity: "critical",
    system: "Electrical",
    reportedBy: "Robert Chen",
    reportedAt: "2026-08-13T09:15:00Z"
  },
  {
    id: "BUG-8944",
    title: "CAN bus packet loss at 500kbps",
    severity: "high",
    system: "Software",
    reportedBy: "Jane Smith",
    reportedAt: "2026-08-12T14:30:00Z"
  },
  {
    id: "BUG-8801",
    title: "Enclosure mounting hole misalignment",
    severity: "low",
    system: "Mechanical",
    reportedBy: "Ali Rahman",
    reportedAt: "2026-08-10T11:20:00Z"
  }
];

export default function IssueConsolePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    { 
      key: "id", 
      header: "Issue ID",
      cell: (row: any) => <span className="font-jetbrains-mono font-bold text-primary">{row.id}</span>
    },
    { key: "title", header: "Defect Description", cell: (row: any) => row.title },
    { key: "system", header: "Subsystem", cell: (row: any) => row.system },
    { key: "reportedBy", header: "Reporter", cell: (row: any) => row.reportedBy },
    { 
      key: "severity", 
      header: "Severity",
      cell: (row: any) => {
        let tone: any = "slate";
        let label = "Unknown";
        if (row.severity === "critical") { tone = "crimson"; label = "Critical"; }
        if (row.severity === "high") { tone = "amber"; label = "High"; }
        if (row.severity === "low") { tone = "sky"; label = "Low"; }
        return <StatusBadge tone={tone} label={label} />;
      }
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-merriweather text-2xl font-bold text-on-surface">Issue, Bug & Blocker Console</h1>
          <p className="text-on-surface-variant text-sm mt-1">Cross-disciplinary defect tracking and resolution.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center hover:bg-primary/90 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Log Defect
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search by ID or description..." 
              className="w-full pl-9 pr-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
            />
          </div>
          <button className="flex items-center text-sm font-medium text-on-surface-variant hover:text-on-surface px-3 py-2 border border-outline-variant rounded-lg bg-surface">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* DataTable Wrapper */}
        <div className="overflow-x-auto [&_tr:nth-child(even)]:bg-surface-container-lowest [&_tr:nth-child(odd)]:bg-surface">
          <DataTable 
            data={issues}
            columns={columns}
          />
        </div>
      </div>

      {/* Defect Logging Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={
          <span className="flex items-center text-semantic-amber">
            <AlertTriangle className="w-5 h-5 mr-2" /> Log Technical Defect
          </span>
        }
      >
        <form className="space-y-4 mt-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Subsystem</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Software / Firmware</option>
                <option>Electrical / PCB</option>
                <option>Mechanical / Enclosure</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Severity</label>
              <select className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="critical">Critical (Blocker)</option>
                <option value="high">High (Major Bug)</option>
                <option value="low">Low (Tech Debt / Minor)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Defect Summary</label>
            <input 
              type="text" 
              placeholder="e.g. CAN bus packet loss at 500kbps" 
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Steps to Reproduce</label>
            <textarea 
              rows={3}
              placeholder="1. Power on device&#10;2. Connect CAN analyzer&#10;3. Set baud rate to 500k..." 
              className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm font-jetbrains-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Expected Behavior</label>
              <textarea 
                rows={2}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-on-surface">Actual Behavior</label>
              <textarea 
                rows={2}
                className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-on-surface">Diagnostic Attachments</label>
            <div className="border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest p-6 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container hover:border-primary transition-colors cursor-pointer">
              <div className="flex space-x-2 mb-2">
                <FileBox className="w-6 h-6 text-primary" />
                <ImageIcon className="w-6 h-6 text-semantic-sky" />
              </div>
              <p className="text-sm font-medium">Click to upload diagnostic logs, traces, or screenshots</p>
              <p className="text-xs mt-1 font-jetbrains-mono text-on-surface-variant">Max 50MB (LOG, CSV, PNG)</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg font-medium text-sm text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-semantic-amber hover:bg-semantic-amber/90 text-white rounded-lg font-medium text-sm shadow-sm flex items-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Log Defect
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
