"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Card } from "@/components/ui/Card";
import { CreditCard, Download, Edit } from "lucide-react";
import { getSubscriptionTiers } from "@/app/actions/platformActions";

export default function SubscriptionsPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubscriptionTiers()
      .then(data => {
        setTiers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load subscription tiers", err);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      key: "tier_name",
      header: "Tier Name",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-primary" />
          <span className="font-semibold">{row.tier_name}</span>
        </div>
      )
    },
    {
      key: "max_projects",
      header: "Max Projects",
      cell: (row: any) => (
        <span className="font-jetbrains-mono">{row.max_projects}</span>
      )
    },
    {
      key: "max_storage_gb",
      header: "Storage Allocation (GB)",
      cell: (row: any) => (
        <span className="font-jetbrains-mono">{row.max_storage_gb} GB</span>
      )
    },
    {
      key: "actions",
      header: "",
      cell: () => (
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <Edit className="w-4 h-4" />
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Subscription Tiers" 
        subtitle="Manage billing tiers and resource quotas for organizations"
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export Config
            </button>
          </div>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1200px] mx-auto w-full">
        <Card className="flex flex-col min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full text-on-surface-variant py-20">Loading subscription tiers...</div>
          ) : (
            <DataTable 
              data={tiers}
              columns={columns}
              getRowId={(row: any) => row.tier_name}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
