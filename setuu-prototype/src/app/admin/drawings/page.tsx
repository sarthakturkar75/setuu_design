"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Search, UploadCloud, LayoutGrid, List, FileImage, Maximize2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { useEffect } from "react";
import { getDrawings } from "@/app/actions/drawingActions";

// mockDrawings removed, using live data

export default function DrawingHubPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [drawings, setDrawings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDrawings()
      .then(data => {
        setDrawings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load drawings", err);
        setLoading(false);
      });
  }, []);

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
            <span className="font-semibold text-on-surface line-clamp-1">{row.drawing_name || (row.file_url ? row.file_url.split('/').pop() : 'Drawing')}</span>
            <span className="text-xs text-on-surface-variant font-jetbrains">{row.drawing_id ? `${row.drawing_id.substring(0, 8)}...` : ""}</span>
          </div>
        </div>
      )
    },
    { 
      key: "project", 
      header: "Project", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface-variant">{row.project_name || "Unknown"}</span>
    },
    { 
      key: "type", 
      header: "Status", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface-variant">{row.status}</span>
    },
    { 
      key: "version", 
      header: "Latest Version",
      cell: (row: any) => <StatusBadge tone="sky" label={`v${row.version_number}`} />
    },
    { 
      key: "date", 
      header: "Last Updated", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-sm text-on-surface-variant">{row.created_at ? new Date(row.created_at).toLocaleDateString() : "--"}</span>
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
          <Select 
            options={[
              { label: "All Projects", value: "" },
              { label: "Alpha Tower", value: "alpha" },
              { label: "Beta Complex", value: "beta" },
            ]}
            value=""
            onChange={() => {}}
          />
          <Select 
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
              data={drawings}
              columns={columns}
              getRowId={(row: any) => row.id}
              selectable={true}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-on-surface-variant">Loading drawings...</div>
            ) : drawings.length === 0 ? (
              <div className="col-span-full py-20 text-center text-on-surface-variant">No drawings found.</div>
            ) : drawings.map(dwg => (
              <Card key={dwg.id} className="overflow-hidden group hover:shadow-elevation-l3 hover:border-primary/50 transition-all cursor-pointer">
                {/* Thumbnail Area */}
                <div className="h-48 bg-surface-variant border-b border-outline-variant relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-50" />
                  <FileImage className="w-16 h-16 text-primary/20 absolute inset-0 m-auto" />
                  
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
                    <StatusBadge tone="sky" label={`v${dwg.version_number}`} />
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-4 flex flex-col">
                  <span className="font-semibold text-on-surface line-clamp-1 mb-1">{dwg.drawing_name || (dwg.file_url ? dwg.file_url.split('/').pop() : 'Drawing')}</span>
                  <span className="text-sm font-medium text-primary mb-3">{dwg.project_name || "Unknown"}</span>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-jetbrains text-on-surface-variant">{dwg.drawing_id ? `${dwg.drawing_id.substring(0, 8)}...` : ""}</span>
                    <span className="text-xs text-on-surface-variant">{dwg.created_at ? new Date(dwg.created_at).toLocaleDateString() : "--"}</span>
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
