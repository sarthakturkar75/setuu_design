"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default function VendorPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Supplier Portal" />
      <Card className="p-6">
        <p className="text-slate-400">This module is actively being developed.</p>
      </Card>
    </div>
  );
}
