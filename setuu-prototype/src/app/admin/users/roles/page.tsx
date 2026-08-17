"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Plus, Shield, Settings2, Users } from "lucide-react";
import Link from "next/link";

const roles = [
  { 
    id: "role-admin", 
    name: "Platform Administrator", 
    type: "System", 
    description: "Full access to all organizational data, billing, and platform settings.",
    users: 4
  },
  { 
    id: "role-pm", 
    name: "Project Manager", 
    type: "Default", 
    description: "Can create projects, manage budgets, approve change requests, and invite team members to assigned projects.",
    users: 42
  },
  { 
    id: "role-eng", 
    name: "Site Engineer", 
    type: "Default", 
    description: "Can log daily reports, view drawings, raise issues, and track material receipts on assigned projects.",
    users: 156
  },
  { 
    id: "role-client", 
    name: "Client Representative", 
    type: "Default", 
    description: "View-only access to high-level dashboards, milestone progress, and approved change orders.",
    users: 28
  },
  { 
    id: "role-vendor", 
    name: "External Vendor", 
    type: "Default", 
    description: "Can view assigned purchase orders, submit invoices, and update delivery schedules.",
    users: 814
  },
];

export default function RoleManagementPage() {
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Role Management" 
        subtitle="Configure permissions and access control matrices"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/users" className="hover:text-primary transition-colors">Users</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Roles</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Create Custom Role
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-5 border-l-4 border-l-primary flex flex-col gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h3 className="font-merriweather font-bold text-lg text-on-surface">System Roles</h3>
            <p className="text-sm text-on-surface-variant">Core administrative roles that cannot be modified or deleted.</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-semantic-emerald flex flex-col gap-2">
            <Users className="w-6 h-6 text-semantic-emerald" />
            <h3 className="font-merriweather font-bold text-lg text-on-surface">Default Roles</h3>
            <p className="text-sm text-on-surface-variant">Standard roles provided by SETUU out-of-the-box.</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-semantic-amber flex flex-col gap-2">
            <Settings2 className="w-6 h-6 text-semantic-amber" />
            <h3 className="font-merriweather font-bold text-lg text-on-surface">Custom Roles</h3>
            <p className="text-sm text-on-surface-variant">Tailored access profiles created specifically for your organization.</p>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-merriweather font-bold text-xl text-on-surface mb-4">Role Definitions</h2>
          
          {roles.map(role => (
            <Card key={role.id} className="p-0 overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-on-surface text-lg">{role.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      role.type === 'System' ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {role.type}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant">{role.description}</p>
                </div>
                
                <div className="flex items-center gap-6 sm:pl-6 sm:border-l border-outline-variant">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-jetbrains font-bold text-xl text-on-surface">{role.users}</span>
                    <span className="text-xs text-on-surface-variant">Assigned</span>
                  </div>
                  <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                    Edit Matrix
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
