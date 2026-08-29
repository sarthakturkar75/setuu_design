"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getClientApprovals, reviewClientApproval } from "@/app/actions/clientActions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { TextArea } from "@/components/ui/TextArea";
import { toast } from "@/components/ui/Toast";

export default function ClientApprovals() {
  const { organizationId } = useAuth();
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!organizationId) return;
      setLoading(true);
      try {
        const data = await getClientApprovals();
        setApprovals(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [organizationId]);

  const handleAction = async (action: "approved" | "revision_requested") => {
    if (!selectedApproval) return;
    setIsSubmitting(true);
    try {
      const res = await reviewClientApproval(selectedApproval.id, action, comments);
      if (res.success) {
        toast.success(action === "approved" ? "Approved Successfully" : "Revision Requested");
        setSelectedApproval(null);
        setComments("");
        const data = await getClientApprovals();
        setApprovals(data || []);
      } else {
        toast.error(res.error || "Failed to submit approval.");
      }
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "project", header: "Project", cell: (r: any) => <span className="font-medium">{r.projects?.name}</span> },
    { key: "title", header: "Title", cell: (r: any) => r.document_title },
    { key: "milestone", header: "Milestone", cell: (r: any) => r.milestone_name || "—" },
    { key: "revision", header: "Revision", cell: (r: any) => r.revision_number || "—" },
    { key: "status", header: "Status", cell: (r: any) => <StatusBadge tone={r.status === 'pending' ? 'amber' : 'slate'} label={r.status.replace(/_/g, " ")} /> },
    { key: "actions", header: "", cell: (r: any) => (
      <Button variant="ghost" size="sm" onClick={() => setSelectedApproval(r)}>
        Review
      </Button>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Approvals & Sign-offs" subtitle="Review and approve documents and milestone gates." />
      
      <Card className="p-0 overflow-hidden">
        <DataTable columns={columns} data={approvals} isLoading={loading} />
      </Card>

      <Drawer
        isOpen={!!selectedApproval}
        onClose={() => setSelectedApproval(null)}
        title="Review Document"
      >
        {selectedApproval && (
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">{selectedApproval.document_title}</h4>
                <p className="text-on-surface-variant text-sm">{selectedApproval.projects?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-surface-variant/30 p-4 rounded-lg">
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1">Milestone</span>
                  <span className="font-medium text-on-surface">
                    {selectedApproval.milestone_name || "General"}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-on-surface-variant uppercase tracking-wider block mb-1">Revision Number</span>
                  <span className="font-medium text-on-surface">
                    {selectedApproval.revision_number || "Initial"}
                  </span>
                </div>
              </div>

              {selectedApproval.document_url && (
                <div>
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Document</h4>
                  <a href={selectedApproval.document_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                    View Document PDF
                  </a>
                </div>
              )}

              <div className="pt-4 border-t border-outline-variant/30">
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Your Feedback</h4>
                <TextArea 
                  label="Comments / Contingencies"
                  placeholder="Enter any notes before approving or requesting a revision..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/30 flex gap-3 mt-auto">
              <Button 
                onClick={() => handleAction("approved")} 
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent flex-1"
              >
                {isSubmitting ? "Processing..." : "Approve & E-Sign"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleAction("revision_requested")}
                disabled={isSubmitting || !comments.trim()}
                className="flex-1"
              >
                Request Revision
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
