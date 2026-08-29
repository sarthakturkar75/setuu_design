"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";

export default function EngineerProductivity() {
  const { user, organizationId } = useAuth();
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader title="My Productivity Matrix" subtitle="Personal analytics and performance score" />
      <div className="bg-surface p-6 rounded-lg border border-outline-variant">
        <h3 className="text-xl font-bold">Engineer Productivity Engine</h3>
        <p className="text-on-surface-variant mt-2">See your personal task completion rate, on-time delivery, and composite score.</p>
      </div>
    </div>
  );
}
