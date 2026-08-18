"use client";

import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FilterBar } from "@/components/ui/FilterBar";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Building2, Plus, Download, MoreVertical, AlertTriangle } from "lucide-react";

export default function OrganizationsHub() {
  const [organizations, setOrganizations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    import("@/app/actions/platformActions").then(({ getOrganizations }) => {
      getOrganizations()
        .then(data => {
          setOrganizations(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load organizations", err);
          setLoading(false);
        });
    });
  }, []);

  const columns = [
    {
      key: "org",
      header: "Organization",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center font-bold text-on-surface-variant">
            {row.name.substring(0, 1)}
          </div>
          <div>
            <div className="font-semibold">{row.name}</div>
            <div className="text-xs text-on-surface-variant font-jetbrains-mono">{row.id}</div>
          </div>
        </div>
      )
    },
    {
      key: "tier",
      header: "Tier",
      cell: (row: any) => <span className="text-sm">{row.subscription_tier}</span>
    },
    {
      key: "members",
      header: "Members",
      cell: (row: any) => <span className="font-jetbrains-mono">{row.member_count || 0}</span>
    },
    {
      key: "storage",
      header: "Storage Usage",
      cell: (row: any) => {
        const used = row.storage_used_gb || 0;
        const quota = row.storage_quota_gb || 100; // default 100
        const percentage = Math.min((used / quota) * 100, 100);
        return (
          <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span>{used} GB</span>
              <span className="text-on-surface-variant">{quota} GB</span>
            </div>
            <ProgressBar progress={percentage} />
          </div>
        );
      }
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "Active" ? "emerald" : "slate"} 
          label={row.status || "Inactive"} 
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Organizations & Subscriptions" 
        subtitle="Manage client organizations, billing tiers, and resource limits."
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-surface-variant text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant/80 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              New Organization
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <FilterBar onClear={() => {}} onApply={() => {}}>
            <div className="flex gap-4 items-center w-full">
              <input type="text" placeholder="Search organizations by name or ID..." className="flex-1 bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface focus:outline-none" />
              <select className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface outline-none">
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="warning">Warning</option>
                <option value="inactive">Inactive</option>
              </select>
              <select className="bg-surface-container border border-outline-variant rounded p-2 text-sm text-on-surface outline-none">
                <option value="">Tier</option>
                <option value="enterprise">Enterprise</option>
                <option value="professional">Professional</option>
                <option value="starter">Starter</option>
              </select>
            </div>
          </FilterBar>
          
          <Card className="min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full text-on-surface-variant py-20">Loading organizations...</div>
            ) : (
              <DataTable 
                columns={columns}
                data={organizations}
                selectable={true}
                rowActions={(row) => (
                  <button className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                )}
                pagination={{ currentPage: 1, totalPages: 1, onPageChange: () => {} }}
              />
            )}
          </Card>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <Card title="Tier Configuration">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-on-surface">Enterprise</span>
                  <span className="text-on-surface-variant">2 Orgs</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-on-surface">Professional</span>
                  <span className="text-on-surface-variant">1 Org</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-on-surface">Starter</span>
                  <span className="text-on-surface-variant">1 Org</span>
                </div>
              </div>
              <button className="w-full mt-2 px-4 py-2 bg-surface-variant text-on-surface text-sm font-medium rounded-lg hover:bg-surface-variant/80 transition-colors">
                Manage Tiers
              </button>
            </div>
          </Card>

          <Card title="Recent Alerts" className="border-semantic-amber-bg/50">
            <div className="p-2 space-y-2">
              <div className="flex gap-3 p-3 rounded hover:bg-surface-variant/50 transition-colors">
                <AlertTriangle className="w-5 h-5 text-semantic-amber shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-on-surface">Stark Industries</h4>
                  <p className="text-xs text-on-surface-variant mt-1">Storage quota at 98%. Risk of suspension.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
