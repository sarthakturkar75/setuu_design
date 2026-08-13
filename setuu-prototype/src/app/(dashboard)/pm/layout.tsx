"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { PMSidebar } from "@/components/navigation/roles/PMSidebar";
import { PMTopbar } from "@/components/navigation/roles/PMTopbar";

export default function PmLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <PMSidebar activePath={activePath} />}
      topbar={({ onMenuClick }) => <PMTopbar onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
