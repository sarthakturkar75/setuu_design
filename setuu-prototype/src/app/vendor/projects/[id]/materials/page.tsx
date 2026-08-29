"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getProjectMaterials } from "@/app/actions/materialActions";
import { Button } from "@/components/ui/Button";

export default function VendorProjectMaterials({ params }: { params: { id: string } }) {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProjectMaterials(params.id);
        // Assuming RLS or action filtering takes care of vendor scoping,
        // or we filter client-side if needed. For prototype, just use the data.
        setMaterials(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const columns = [
    { key: "name", header: "Material", cell: (r: any) => <span className="font-medium">{r.name}</span> },
    { key: "status", header: "Status", cell: (r: any) => {
        let tone: any = "slate";
        if (r.status === 'Delivered') tone = "emerald";
        if (r.status === 'In Transit') tone = "sky";
        if (r.status === 'Pending') tone = "amber";
        return <StatusBadge tone={tone} label={r.status || "Pending"} />;
      }
    },
    { key: "dates", header: "Delivery Est.", cell: (r: any) => r.estimated_delivery ? new Date(r.estimated_delivery).toLocaleDateString() : "—" },
    { key: "actions", header: "", cell: (r: any) => (
      <Button variant="ghost" size="sm">Update Status</Button>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Supplied Materials" subtitle="Materials and deliveries assigned to you for this project." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={materials} isLoading={loading} />
      </Card>
    </div>
  );
}
