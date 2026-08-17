"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { Card } from "@/components/ui/Card";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { TextInput } from "@/components/ui/TextInput";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, UploadCloud, LayoutGrid, List, FileImage, Maximize2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockDrawings = [
  { id: "DWG-101", title: "Level 4 Floor Plan", project: "Alpha Tower", type: "Architectural", version: "v4", date: "Oct 10, 2026" },
  { id: "DWG-102", title: "HVAC Layout North", project: "Alpha Tower", type: "MEP", version: "v2", date: "Oct 12, 2026" },
  { id: "DWG-103", title: "Foundation Detail", project: "Beta Complex", type: "Structural", version: "v1", date: "Sep 28, 2026" },
  { id: "DWG-104", title: "Electrical Schematics", project: "Gamma Hub", type: "MEP", version: "v3", date: "Oct 05, 2026" },
  { id: "DWG-105", title: "Exterior Elevations", project: "Alpha Tower", type: "Architectural", version: "v5", date: "Oct 14, 2026" },
  { id: "DWG-106", title: "Plumbing Riser", project: "Beta Complex", type: "MEP", version: "v1", date: "Oct 01, 2026" },
];

export default function DrawingHubPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const columns = [
    { 
      key: "title_id", 
      header: "Drawing", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-surface-variant flex items-center justify-center shrink-0">
            <FileImage className="w-5 h-5 text-on-surface-variant" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface">{row.title}</span>
            <span className="text-xs text-on-surface-variant font-jetbrains">{row.id}</span>
          </div>
        </div>
      )
    },
    { 
      key: "project", 
      header: "Project", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface-variant">{row.project}</span>
    },
    { 
      key: "type", 
      header: "Discipline", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface-variant">{row.type}</span>
    },
    { 
      key: "version", 
      header: "Latest Version",
      cell: (row: any) => <StatusBadge tone="sky" label={row.version} />
    },
    { 
      key: "date", 
      header: "Last Updated", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.date}</span>
    },
    { 
      key: "actions", 
      header: "", 
      cell: (row: any) => (
        <button className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          <Maximize2 className="w-4 h-4" /> Fullscreen
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Drawing & Media Hub" 
        subtitle="Manage architectural blueprints, engineering schematics, and site media"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Drawings</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center p-1 bg-surface-variant rounded-lg border border-outline-variant mr-2">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-surface text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            
            <Link href="/admin/drawings/compare" className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              Compare Diff
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <UploadCloud className="w-4 h-4" />
              Upload New
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full">
        
        <FilterBar onClear={() => {}} onApply={() => {}}>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput placeholder="Search drawing title or ID..." className="pl-9" />
          </div>
          <SelectMenu 
            options={[
              { label: "All Projects", value: "" },
              { label: "Alpha Tower", value: "alpha" },
              { label: "Beta Complex", value: "beta" },
            ]}
            value=""
            onChange={() => {}}
          />
          <SelectMenu 
            options={[
              { label: "All Disciplines", value: "" },
              { label: "Architectural", value: "arch" },
              { label: "Structural", value: "str" },
              { label: "MEP", value: "mep" },
            ]}
            value=""
            onChange={() => {}}
          />
        </FilterBar>

        {viewMode === "table" ? (
          <Card className="mt-6 min-h-[400px]">
            <DataTable 
              data={mockDrawings}
              columns={columns}
              getRowId={(row: any) => row.id}
              selectable={true}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {mockDrawings.map((drawing) => (
              <Card key={drawing.id} className="overflow-hidden flex flex-col group hover:shadow-elevation-l2 transition-all">
                {/* Thumbnail Area */}
                <div className="h-48 bg-surface-variant/50 relative border-b border-outline-variant flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
                  <FileImage className="w-16 h-16 text-primary/20" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-scrim/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button className="p-2 bg-surface text-primary rounded-full shadow-elevation-l2 hover:scale-105 transition-transform" title="Fullscreen">
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-surface text-on-surface rounded-full shadow-elevation-l2 hover:scale-105 transition-transform" title="Compare">
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="absolute top-3 right-3">
                    <StatusBadge tone="sky" label={drawing.version} />
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-on-surface text-lg line-clamp-1">{drawing.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-medium text-on-surface-variant">{drawing.project}</span>
                    <span className="text-xs text-on-surface-variant/70 uppercase tracking-wider font-bold">{drawing.type}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant border-dashed">
                    <span className="text-xs font-jetbrains text-on-surface-variant">{drawing.id}</span>
                    <span className="text-xs text-on-surface-variant">{drawing.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
