"use client";

import { DashboardShell } from "@/components/navigation/DashboardShell";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { MobileBottomNav } from "@/components/navigation/MobileBottomNav";
import { Topbar } from "@/components/navigation/Topbar";
import { Plus } from "lucide-react";
import Link from "next/link";
import * as React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const topbarActions = (
    <Link 
      href="/admin/projects/new" 
      className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
    >
      <Plus className="w-4 h-4" />
      New Project
    </Link>
  );

  return (
    <DashboardShell
      sidebar={(props) => <AdminSidebar />}
      bottomNav={(props) => <MobileBottomNav onMenuClick={props.onMenuClick} />}
      topbar={(props) => (
        <Topbar
          title="Admin Portal"
          isAdmin={true}
          onMenuClick={props.onMenuClick}
          actions={topbarActions}
        />
      )}
    >
      {children}
    </DashboardShell>
  );
}
