"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getReviews, submitReviewAction } from "@/app/actions/reviewActions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";

export default function EngineerReviews() {
  const [reviews, setReviews] = useState<{incoming: any[], outgoing: any[]}>({ incoming: [], outgoing: [] });
  
  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  const columns = [
    { key: "title", header: "Title", cell: (r: any) => r.title },
    { key: "type", header: "Type", cell: (r: any) => <span className="capitalize">{r.review_type}</span> },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'approved' ? 'emerald' : 'slate'} label={r.status} /> },
    { key: "actions", header: "Actions", cell: (r: any) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => submitReviewAction(r.id, "approve", "Approved")}>Approve</Button>
      </div>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Peer Reviews" subtitle="Manage your incoming and outgoing design/code reviews." />
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={reviews.incoming} />
      </Card>
    </div>
  );
}
