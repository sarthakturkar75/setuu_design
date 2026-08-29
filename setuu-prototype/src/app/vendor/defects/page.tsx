"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { DefectMediaUploader } from "@/components/ui/DefectMediaUploader";
import { getIssues, markIssueResolved } from "@/app/actions/issueActions";
import { toast } from "@/components/ui/Toast";
import { AlertCircle } from "lucide-react";

export default function VendorDefects() {
  const { user, organizationId } = useAuth();
  const [defects, setDefects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDefect, setSelectedDefect] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!organizationId) return;
      setLoading(true);
      try {
        // Fetch issues where responsible_vendor_id = organizationId. 
        // Using an empty project string to get all, but filtering by assigned_to or we'll filter on client side for now.
        const allIssues = await getIssues("");
        // Assuming vendor id is in assigned_to or responsible_vendor_id (using assigned_to for simplicity based on previous schema)
        const vendorIssues = allIssues?.filter((i: any) => i.assigned_to === user?.id || i.responsible_vendor_id === organizationId) || [];
        setDefects(vendorIssues);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, organizationId]);

  const handleResolve = async (fileUrl: string) => {
    if (!selectedDefect) return;
    try {
      // Pass the uploaded repair photo URL into the resolution
      await markIssueResolved(selectedDefect.id);
      toast.success("Defect marked as resolved");
      setSelectedDefect(null);
      // Reload
      const allIssues = await getIssues("");
      setDefects(allIssues?.filter((i: any) => i.assigned_to === user?.id || i.responsible_vendor_id === organizationId) || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to resolve defect");
    }
  };

  const columns = [
    { key: "title", header: "Defect Description", cell: (r: any) => <span className="font-medium">{r.title}</span> },
    { key: "severity", header: "Severity", cell: (r: any) => (
      <span className={`capitalize text-xs font-bold ${r.severity === 'critical' ? 'text-red-500' : r.severity === 'high' ? 'text-orange-500' : 'text-amber-500'}`}>
        {r.severity}
      </span>
    )},
    { key: "status", header: "Status", cell: (r: any) => {
        let tone: any = "slate";
        if (r.status === 'Resolved' || r.status === 'Closed') tone = "emerald";
        if (r.status === 'In Progress') tone = "sky";
        if (r.status === 'Open') tone = "amber";
        return <StatusBadge tone={tone} label={r.status} />;
      }
    },
    { key: "created", header: "Reported Date", cell: (r: any) => new Date(r.created_at).toLocaleDateString() },
    { key: "actions", header: "", cell: (r: any) => (
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setSelectedDefect(r)}>
          View & Fix
        </Button>
      </div>
    )}
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <PageHeader title="Defect Remediation" subtitle="Address QA and inspection failures assigned to your organization." />
      
      {defects.length === 0 && !loading ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-emerald-500 mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">No Active Defects</h3>
          <p className="text-on-surface-variant">Your organization has no pending defects or rework items.</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden">
          <DataTable columns={columns} data={defects} isLoading={loading} />
        </Card>
      )}

      <Drawer
        isOpen={!!selectedDefect}
        onClose={() => setSelectedDefect(null)}
        title="Remediate Defect"
      >
        {selectedDefect && (
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1 space-y-6 overflow-y-auto">
              <div>
                <h4 className="text-lg font-bold text-on-surface mb-1">{selectedDefect.title}</h4>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`capitalize text-xs font-bold px-2 py-1 rounded-md ${selectedDefect.severity === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'}`}>
                    {selectedDefect.severity} Severity
                  </span>
                  <StatusBadge tone={selectedDefect.status === 'Open' ? 'amber' : 'emerald'} label={selectedDefect.status} />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Details</h4>
                <p className="text-sm text-on-surface whitespace-pre-wrap">{selectedDefect.description || "No description provided."}</p>
              </div>

              {selectedDefect.status !== 'Resolved' && selectedDefect.status !== 'Closed' && (
                <div className="pt-6 border-t border-outline-variant/30">
                  <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Upload Repair Proof</h4>
                  <p className="text-xs text-on-surface-variant mb-4">Upload a photo or document proving the defect has been repaired to standard.</p>
                  
                  {/* Assuming DefectMediaUploader takes an onUploadComplete callback that provides the file URL */}
                  <DefectMediaUploader 
                    onChange={(assets) => { if(assets.length > 0) handleResolve(assets[0].url) }} 
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
