"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { Button } from "@/components/ui/Button";
import { Download, ExternalLink, Archive, FileText } from "lucide-react";

// Assuming we fetch from a document action or asset action
import { getClientPortfolio } from "@/app/actions/clientActions"; 
import { getProjectAssets } from "@/app/actions/handoverActions";

export default function ClientHandoverVault() {
  const { organizationId } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      if (!organizationId) return;
      try {
        const pData = await getClientPortfolio(organizationId);
        setProjects(pData || []);
        
        // Fetch assets for all projects
        if (pData && pData.length > 0) {
          const allAssets = await Promise.all(
            pData.map((p: any) => getProjectAssets(p.id))
          );
          setDocuments(allAssets.flat());
        }
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [organizationId]);

  const columns = [
    { key: "title", header: "Document Title", cell: (r: any) => (
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-primary" />
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { key: "system", header: "System", cell: (r: any) => r.custom_data?.system || "General" },
    { key: "category", header: "Category", cell: (r: any) => (
      <span className="inline-flex items-center text-xs px-2 py-1 bg-surface-variant rounded-md text-on-surface">
        {r.category || "Asset"}
      </span>
    )},
    { key: "date", header: "Date Added", cell: (r: any) => r.created_at ? new Date(r.created_at).toLocaleDateString() : "—" },
    { key: "actions", header: "", cell: (r: any) => (
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" aria-label="View">
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" aria-label="Download">
          <Download className="w-4 h-4" />
        </Button>
      </div>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader 
        title="Asset & Handover Vault" 
        subtitle="Secure repository for O&M manuals, warranties, and as-built drawings." 
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput placeholder="Search documents, systems, or tags..." />
        </div>
        <div className="flex-none">
          <FilterBar 
            filters={[
              { 
                key: "project", 
                label: "Project", 
                options: projects.map(p => ({ label: p.name, value: p.id })) 
              },
              {
                key: "category",
                label: "Category",
                options: [
                  { label: "O&M Manuals", value: "om" },
                  { label: "Warranties", value: "warranties" },
                  { label: "As-Builts", value: "asbuilts" }
                ]
              }
            ]}
            onFilterChange={() => {}}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Archive className="w-4 h-4" /> Batch Export
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Download a compiled zip archive of all handover documentation for the selected project.
            </p>
            <Button className="w-full text-xs" variant="outline">Request Full Export</Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-on-surface mb-3">Systems Tree</h3>
            <ul className="text-sm space-y-2 text-on-surface-variant">
              <li className="font-medium text-primary cursor-pointer">All Systems</li>
              <li className="cursor-pointer hover:text-on-surface pl-2 border-l border-outline-variant/50">Mechanical</li>
              <li className="cursor-pointer hover:text-on-surface pl-2 border-l border-outline-variant/50">Electrical</li>
              <li className="cursor-pointer hover:text-on-surface pl-2 border-l border-outline-variant/50">Plumbing</li>
              <li className="cursor-pointer hover:text-on-surface pl-2 border-l border-outline-variant/50">Life Safety</li>
              <li className="cursor-pointer hover:text-on-surface pl-2 border-l border-outline-variant/50">Vertical Transport</li>
            </ul>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="p-0 overflow-hidden">
            <DataTable columns={columns} data={documents} />
          </Card>
        </div>
      </div>
    </div>
  );
}
