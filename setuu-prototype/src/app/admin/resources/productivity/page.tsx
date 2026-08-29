"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminProductivity() {
  const { user, organizationId } = useAuth();
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader title="Platform Productivity Matrix" subtitle="Global analytics engine for all roles" />
      <div className="bg-surface p-6 rounded-lg border border-outline-variant">
        <h3 className="text-xl font-bold">Admin Level Productivity Engine</h3>
        <p className="text-on-surface-variant mt-2">Provides visibility into PM, Engineer, and Vendor productivity indices.</p>
      </div>
    </div>
  );
}
