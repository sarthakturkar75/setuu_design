"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PMProductivity() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <PageHeader title="Project Team Productivity" subtitle="Analytics for your engineers and vendors" />
      <div className="bg-surface p-6 rounded-lg border border-outline-variant">
        <h3 className="text-xl font-bold">PM Level Productivity Engine</h3>
        <p className="text-on-surface-variant mt-2">Provides visibility into Engineer and Vendor productivity across your assigned projects.</p>
      </div>
    </div>
  );
}
