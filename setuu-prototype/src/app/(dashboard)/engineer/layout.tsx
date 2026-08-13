"use client";
import * as React from "react";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { EngineerSidebar } from "@/components/navigation/roles/EngineerSidebar";
import { EngineerTopbar } from "@/components/navigation/roles/EngineerTopbar";

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      sidebar={({ activePath }) => <EngineerSidebar activePath={activePath} />}
      topbar={({ onMenuClick }) => <EngineerTopbar onMenuClick={onMenuClick} />}
    >
      {children}
    </DashboardShell>
  );
}
