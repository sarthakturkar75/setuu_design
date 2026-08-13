"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { AdminSidebar } from "@/components/navigation/roles/AdminSidebar";
import { AdminTopbar } from "@/components/navigation/roles/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <AdminSidebar activePath={activePath} />}
      topbar={({ onMenuClick }) => <AdminTopbar onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
