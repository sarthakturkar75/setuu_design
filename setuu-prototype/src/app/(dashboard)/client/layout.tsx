"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { ClientSidebar } from "@/components/navigation/roles/ClientSidebar";
import { ClientTopbar } from "@/components/navigation/roles/ClientTopbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <ClientSidebar activePath={activePath} />}
      topbar={({ onMenuClick }) => <ClientTopbar onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
