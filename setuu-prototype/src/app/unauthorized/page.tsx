"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function UnauthorizedPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Unauthorized Access" subtitle="You do not have permission to view this page." />
      <div className="bg-surface p-6 rounded-lg border border-outline-variant text-center">
        <h3 className="text-xl font-bold text-semantic-crimson">Access Denied</h3>
        <p className="text-on-surface-variant mt-2">Please contact your system administrator if you believe this is an error.</p>
        <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-md">Go Back</button>
      </div>
    </div>
  );
}
