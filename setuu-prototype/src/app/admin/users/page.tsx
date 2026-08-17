"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { FilterBar } from "@/components/ui/FilterBar";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card } from "@/components/ui/Card";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { Plus, MoreVertical, Search, Download } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { TextInput } from "@/components/ui/TextInput";

const mockUsers = [
  { id: "USR-001", name: "Alice Chen", email: "alice@setuu.com", role: "Project Manager", status: "active", lastActive: "2 mins ago" },
  { id: "USR-002", name: "Bob Smith", email: "bob@setuu.com", role: "Site Engineer", status: "active", lastActive: "1 hour ago" },
  { id: "USR-003", name: "Charlie Davis", email: "charlie@acmecorp.com", role: "Client Rep", status: "pending", lastActive: "Never" },
  { id: "USR-004", name: "Diana Prince", email: "diana@setuu.com", role: "Architect", status: "inactive", lastActive: "2 weeks ago" },
];

export default function UserDirectoryPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const columns = [
    { 
      key: "name_email", 
      header: "User", 
      sortable: true,
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {row.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <Link href={`/admin/users/${row.id}`} className="font-semibold text-on-surface hover:text-primary transition-colors">{row.name}</Link>
            <span className="text-xs text-on-surface-variant">{row.email}</span>
          </div>
        </div>
      )
    },
    { 
      key: "role", 
      header: "System Role", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface-variant">{row.role}</span>
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "active" ? "emerald" : row.status === "pending" ? "amber" : "slate"} 
          label={row.status} 
        />
      )
    },
    { 
      key: "lastActive", 
      header: "Last Active", 
      sortable: true,
      cell: (row: any) => <span className="text-sm font-jetbrains text-on-surface-variant">{row.lastActive}</span>
    },
    { 
      key: "actions", 
      header: "", 
      cell: () => (
        <button className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="User Directory" 
        subtitle="Manage platform access, roles, and organizational accounts"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <span>Admin</span>
            <span>/</span>
            <span>Users</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Invite User
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">
            <FilterBar onClear={() => {}} onApply={() => {}}>
              <div className="w-full sm:w-64 relative">
                <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                <TextInput placeholder="Search users by name or email..." className="pl-9" />
              </div>
              <SelectMenu 
                options={[
                  { label: "All Roles", value: "" },
                  { label: "Project Manager", value: "pm" },
                  { label: "Site Engineer", value: "eng" },
                  { label: "Client Rep", value: "client" },
                ]}
                value=""
                onChange={() => {}}
              />
              <SelectMenu 
                options={[
                  { label: "All Statuses", value: "" },
                  { label: "Active", value: "active" },
                  { label: "Pending", value: "pending" },
                  { label: "Inactive", value: "inactive" },
                ]}
                value=""
                onChange={() => {}}
              />
            </FilterBar>

            <Card className="flex-1 min-h-[400px]">
              <DataTable 
                data={mockUsers}
                columns={columns}
                getRowId={(row: any) => row.id}
                selectable={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
              />
            </Card>
          </div>

          {/* Context Sidebar */}
          <div className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-6">
            <Card className="p-5">
              <h3 className="font-merriweather font-bold text-on-surface mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <span className="text-sm text-on-surface-variant">Total Users</span>
                  <span className="font-jetbrains font-bold text-lg text-on-surface">1,248</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <span className="text-sm text-on-surface-variant">Active This Week</span>
                  <span className="font-jetbrains font-bold text-lg text-semantic-emerald">942</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <span className="text-sm text-on-surface-variant">Pending Invites</span>
                  <span className="font-jetbrains font-bold text-lg text-semantic-amber">14</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-surface-variant/30 border-primary/20">
              <h3 className="font-merriweather font-bold text-on-surface mb-2">Role Management</h3>
              <p className="text-sm text-on-surface-variant mb-4">Need to configure specific permissions or create custom access levels?</p>
              <Link href="/admin/users/roles" className="block text-center w-full py-2 bg-surface text-primary border border-primary/30 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors">
                Manage Roles & Permissions
              </Link>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
