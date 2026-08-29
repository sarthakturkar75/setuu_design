"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { getReviews, submitReviewAction } from "@/app/actions/reviewActions";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { TabBar } from "@/components/ui/TabBar";
import { Drawer } from "@/components/ui/Drawer";
import { TextArea } from "@/components/ui/TextArea";
import { toast } from "@/components/ui/Toast";

export default function EngineerReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<{incoming: any[], outgoing: any[]}>({ incoming: [], outgoing: [] });
  const [activeTab, setActiveTab] = useState("incoming");
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      setIsLoading(true);
      try {
        const allReviews = await getReviews(user.id);
        const incoming = allReviews.filter((r: any) => r.reviewer_id === user.id);
        const outgoing = allReviews.filter((r: any) => r.author_id === user.id);
        setReviews({ incoming, outgoing });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  const handleAction = async (action: "approve" | "request_changes") => {
    if (!selectedReview) return;
    setIsSubmitting(true);
    try {
      const res = await submitReviewAction(selectedReview.id, action, comment);
      if (res.success) {
        toast.success(`Review ${action === "approve" ? "Approved" : "Changes Requested"}`);
        setSelectedReview(null);
        setComment("");
        // Reload
        const allReviews = await getReviews(user!.id);
        setReviews({
          incoming: allReviews.filter((r: any) => r.reviewer_id === user!.id),
          outgoing: allReviews.filter((r: any) => r.author_id === user!.id)
        });
      } else {
        toast.error(res.error || "Action failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "title", header: "Title", cell: (r: any) => <span className="font-medium text-on-surface">{r.title}</span> },
    { key: "type", header: "Type", cell: (r: any) => <span className="capitalize text-on-surface-variant">{r.review_type}</span> },
    { key: "status", header: "Status", cell: (r: any) => {
        let tone: any = "slate";
        if (r.status === 'approved') tone = "emerald";
        if (r.status === 'in_review') tone = "blue";
        if (r.status === 'changes_requested') tone = "amber";
        return <StatusBadge tone={tone} label={r.status.replace("_", " ")} />;
      } 
    },
    { key: "date", header: "Due Date", cell: (r: any) => r.due_date ? new Date(r.due_date).toLocaleDateString() : "—" },
    { key: "actions", header: "", cell: (r: any) => (
      <Button variant="ghost" size="sm" onClick={() => setSelectedReview(r)}>
        {activeTab === "incoming" ? "Review" : "View"}
      </Button>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full flex flex-col">
      <PageHeader title="Peer Reviews" subtitle="Manage your incoming and outgoing design and code reviews." />
      
      <TabBar 
        tabs={[
          { id: "incoming", label: `Incoming (${reviews.incoming.length})` },
          { id: "outgoing", label: `Outgoing (${reviews.outgoing.length})` }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      <Card className="p-0 overflow-hidden flex-1">
        <DataTable columns={columns} data={activeTab === "incoming" ? reviews.incoming : reviews.outgoing} isLoading={isLoading} />
      </Card>

      <Drawer
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title={selectedReview?.title || "Review Details"}
      >
        {selectedReview && (
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Description</h4>
                <p className="text-on-surface">{selectedReview.description || "No description provided."}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-on-surface-variant block mb-1">Type</span>
                    <span className="capitalize">{selectedReview.review_type}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block mb-1">Status</span>
                    <span className="capitalize">{selectedReview.status.replace("_", " ")}</span>
                  </div>
                </div>
              </div>

              {activeTab === "incoming" && selectedReview.status !== "approved" && (
                <div className="pt-4 border-t border-outline-variant/30">
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Provide Feedback</h4>
                  <TextArea 
                    label="Review Comments"
                    placeholder="Enter your feedback or approval notes..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                  />
                </div>
              )}
            </div>

            {activeTab === "incoming" && selectedReview.status !== "approved" && (
              <div className="pt-6 border-t border-outline-variant/30 flex gap-3 mt-auto">
                <Button 
                  onClick={() => handleAction("approve")} 
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                >
                  {isSubmitting ? "Processing..." : "Approve"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAction("request_changes")}
                  disabled={isSubmitting || !comment.trim()}
                >
                  Request Changes
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
