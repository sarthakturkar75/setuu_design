"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { FilterBar } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import { CheckCircle2, XCircle, Edit3, MessageSquare, Image as ImageIcon, MapPin, Clock, Building2, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUpdates } from "@/app/actions/updateActions";

export default function ModerationFeedPage() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUpdates();
        setUpdates(data.map(u => ({
          id: u.id,
          user: u.user_actor?.display_name || "Unknown User",
          role: "Site Superintendent", // Assuming from user_actor, hardcoded fallback
          project: u.project_name || "Unknown Project",
          zone: "Zone A", // No zone in updates table
          time: u.created_at ? new Date(u.created_at).toLocaleString() : "Unknown",
          content: u.caption,
          hasImage: u.media_attachments && u.media_attachments.length > 0,
          status: u.approval_status
        })));
      } catch (e) {
        console.error("Failed to load updates", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const displayedUpdates = updates.filter(u => activeTab === "pending" ? u.status === "Pending" : u.status !== "Pending");
  const pendingCount = updates.filter(u => u.status === "Pending").length;

  const toggleSelect = (id: string) => {
    setSelectedUpdates(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUpdates.length === displayedUpdates.length) {
      setSelectedUpdates([]);
    } else {
      setSelectedUpdates(displayedUpdates.map(u => u.id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader
        title="Progress Update Moderation Feed"
        subtitle="Review, approve, or reject field updates before they go live on project dashboards"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Moderation</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Generate Report
            </button>
            {selectedUpdates.length > 0 && activeTab === "pending" && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4">
                <span className="text-sm font-medium text-primary mr-2">{selectedUpdates.length} selected</span>
                <button className="flex items-center gap-2 px-4 py-2 bg-crimson text-white rounded-lg text-sm font-semibold hover:bg-crimson/90 transition-colors shadow-elevation-l1">
                  Reject All
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-semantic-emerald text-white rounded-lg text-sm font-semibold hover:bg-semantic-emerald/90 transition-colors shadow-elevation-l1">
                  <CheckCircle2 className="w-4 h-4" />
                  Approve All
                </button>
              </div>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 max-w-300 mx-auto w-full flex flex-col gap-6">

        {/* Tabs */}
        <div className="flex border-b border-outline-variant bg-surface">
          <button
            onClick={() => { setActiveTab("pending"); setSelectedUpdates([]); }}
            className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "pending" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
          >
            Pending Review
            {pendingCount > 0 && <span className="bg-primary text-on-primary text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
          <button
            onClick={() => { setActiveTab("processed"); setSelectedUpdates([]); }}
            className={`px-6 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === "processed" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
          >
            Processed
          </button>
        </div>

        <FilterBar onClear={() => { }} onApply={() => { }}>
          <Select
            options={[
              { label: "All Projects", value: "" },
              { label: "Alpha Tower", value: "alpha" },
              { label: "Beta Complex", value: "beta" },
            ]}
            value=""
            onChange={() => { }}
          />
          <Select
            options={[
              { label: "All Priorities", value: "" },
              { label: "Flagged by AI", value: "flagged" },
            ]}
            value=""
            onChange={() => { }}
          />
        </FilterBar>

        <div className="flex flex-col gap-4">

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
                checked={selectedUpdates.length === displayedUpdates.length && displayedUpdates.length > 0}
                onChange={toggleSelectAll}
              />
              <span className="text-sm font-semibold text-on-surface-variant">Select All ({displayedUpdates.length})</span>
            </div>
            {activeTab === "pending" && (
              <button className="text-sm font-semibold text-primary hover:underline">Auto-Approve Rules</button>
            )}
          </div>

          {loading ? (
            <div className="p-12 flex items-center justify-center text-on-surface-variant">Loading updates...</div>
          ) : (
            displayedUpdates.map(update => (
              <Card key={update.id} className={`p-0 overflow-hidden flex flex-col transition-colors border-2 ${selectedUpdates.includes(update.id) ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50"}`}>
                <div className="p-4 flex items-start gap-4">

                  {/* Checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
                      checked={selectedUpdates.includes(update.id)}
                      onChange={() => toggleSelect(update.id)}
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-4">

                    {/* Meta Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-sm font-bold text-on-surface-variant uppercase">
                          {update.user.substring(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface leading-tight">{update.user}</span>
                          <span className="text-xs text-on-surface-variant">{update.role}</span>
                        </div>
                      </div>
                      <span className="text-xs font-jetbrains font-medium text-on-surface-variant flex items-center gap-1 bg-surface-variant/50 px-2 py-1 rounded">
                        <Clock className="w-3 h-3" /> {update.time}
                      </span>
                    </div>

                    {/* Context Badges */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {update.project}
                      </span>
                      <span className="text-xs font-semibold text-on-surface-variant bg-surface-variant/50 px-2 py-1 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {update.zone}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-on-surface leading-relaxed">
                        {update.content}
                      </p>
                      {update.hasImage && (
                        <div className="w-full max-w-sm h-48 bg-surface-variant rounded-xl border border-outline-variant flex items-center justify-center relative overflow-hidden group cursor-pointer">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                          <ImageIcon className="w-8 h-8 text-on-surface-variant/50" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-sm font-bold text-white">View Full Image</span>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Actions Footer */}
                {activeTab === "pending" && (
                  <div className="bg-surface-variant/30 border-t border-outline-variant p-3 flex justify-end gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
                      <Edit3 className="w-4 h-4" /> Edit & Approve
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-crimson/30 bg-crimson/5 text-crimson rounded-lg text-sm font-semibold hover:bg-crimson/10 transition-colors">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-semantic-emerald text-white rounded-lg text-sm font-semibold hover:bg-semantic-emerald/90 transition-colors shadow-elevation-l1">
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                  </div>
                )}

              </Card>
            ))
          )}

          {!loading && displayedUpdates.length === 0 && (
            <div className="p-12 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-12 h-12 text-on-surface-variant/50 mb-4" />
              <h3 className="text-lg font-bold text-on-surface">Inbox Zero</h3>
              <p className="text-sm text-on-surface-variant mt-1">All field updates have been reviewed.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
