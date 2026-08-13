"use client";

import * as React from "react";
import { useState } from "react";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PlusIcon, UserPlusIcon } from "lucide-react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  isActive: boolean;
};

interface UserDirectoryClientProps {
  users: UserRow[];
}

export function UserDirectoryClient({ users }: UserDirectoryClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: Column<UserRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => <span className="font-semibold text-on-surface">{row.name}</span>,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <span className="text-on-surface-variant">{row.email}</span>,
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => <span className="uppercase text-xs font-bold tracking-wider">{row.role}</span>,
    },
    {
      key: "organization",
      header: "Organization",
      cell: (row) => row.organization,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <StatusBadge
          tone={row.isActive ? "emerald" : "slate"}
          label={row.isActive ? "Active" : "Inactive"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <button className="text-sm text-primary font-medium hover:underline focus:outline-none">
          Manage
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">User & Vendor Directory</h1>
          <p className="text-on-surface-variant font-inter mt-1">
            Manage platform access for employees, vendors, and clients.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-md font-medium text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          Invite User
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={users} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite New User"
        description="Send an invitation email to provision a new account on the platform."
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-on-surface">Email Address *</label>
            <input
              required
              id="email"
              type="email"
              className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="role" className="text-sm font-medium text-on-surface">Role *</label>
            <select
              required
              id="role"
              className="w-full rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="vendor">Vendor</option>
              <option value="client">Client</option>
              <option value="pm">Project Manager</option>
              <option value="engineer">Engineer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-md font-medium text-sm transition-colors hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-md font-medium text-sm transition-colors hover:bg-primary/90"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
