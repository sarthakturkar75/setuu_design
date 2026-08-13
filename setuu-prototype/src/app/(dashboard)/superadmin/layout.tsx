"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { SuperadminSidebar } from "@/components/navigation/roles/SuperadminSidebar";
import { SuperadminTopbar } from "@/components/navigation/roles/SuperadminTopbar";

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <SuperadminSidebar activePath={activePath} />}
      topbar={({ onMenuClick }) => <SuperadminTopbar onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
