"use client";

import React, { useState } from "react";
import { X, ShieldAlert, Check } from "lucide-react";
import { toggleUserPermission } from "@/app/actions/permissionActions";
import { useToast } from "@/contexts/ToastContext";

export function EditPermissionsModal({
  projectId,
  user,
  permissions,
  onClose,
  onRefresh,
}: {
  projectId: string;
  user: any;
  permissions: any;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [perms, setPerms] = useState({
    can_view_drawings: permissions?.can_view_drawings || false,
    can_view_financials: permissions?.can_view_financials || false,
    can_edit_timeline: permissions?.can_edit_timeline || false,
    can_manage_issues: permissions?.can_manage_issues || false,
    can_approve_changes: permissions?.can_approve_changes || false,
    can_manage_materials: permissions?.can_manage_materials || false,
    can_manage_labor: permissions?.can_manage_labor || false,
    can_view_reports: permissions?.can_view_reports || false,
  });

  const handleToggle = (key: string) => {
    setPerms((prev) => ({ ...prev, [key]: !(prev as any)[key] }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Since we only have toggleUserPermission for single toggles, we would ideally have a bulk update.
    // For now, we'll fire them off in parallel (or sequential) or just create a new bulk action.
    // Let's fire them sequentially to avoid race conditions.

    let errorOccurred = false;
    for (const [key, value] of Object.entries(perms)) {
      if (value !== permissions?.[key]) {
        // Only update if changed
        const res = await toggleUserPermission(projectId, user.id, key, value);
        if (!res.success) {
          errorOccurred = true;
          toast.error(`Failed to update ${key}: ` + res.error);
        }
      }
    }

    if (!errorOccurred) {
      toast.success("Permissions updated successfully!");
      onRefresh();
      onClose();
    }
    setLoading(false);
  };

  const toggleGroup = (title: string, desc: string, key: string) => (
    <div className="flex justify-between items-center p-3 bg-surface border border-outline-variant/30 rounded-lg">
      <div>
        <p className="font-semibold text-sm text-on-surface">{title}</p>
        <p className="text-xs text-on-surface-variant">{desc}</p>
      </div>
      <button
        onClick={() => handleToggle(key)}
        className={`w-10 h-5 rounded-full relative transition-colors ${(perms as any)[key] ? "bg-primary" : "bg-surface-variant"}`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${(perms as any)[key] ? "left-5.5" : "left-0.5"}`}
        ></div>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-xl rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30">
        <div className="px-6 py-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface">
          <div>
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2 font-merriweather">
              <ShieldAlert className="w-5 h-5 text-primary" /> Edit Access:{" "}
              {user.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-variant rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 max-h-[60vh] space-y-4">
          <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-2">
            Core Access
          </h3>
          {toggleGroup(
            "View Drawings",
            "Access to the 2D/3D model viewer",
            "can_view_drawings",
          )}
          {toggleGroup(
            "View Financials",
            "Access to budget, invoices, and labor costs",
            "can_view_financials",
          )}
          {toggleGroup(
            "View Reports",
            "Access to generated analytical reports",
            "can_view_reports",
          )}

          <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-2 mt-6">
            Write Access
          </h3>
          {toggleGroup(
            "Edit Timeline",
            "Can add/modify Gantt chart dependencies",
            "can_edit_timeline",
          )}
          {toggleGroup(
            "Manage Issues",
            "Can create and assign QA/Safety issues",
            "can_manage_issues",
          )}
          {toggleGroup(
            "Manage Materials",
            "Can log and track material receipts",
            "can_manage_materials",
          )}
          {toggleGroup(
            "Manage Labor",
            "Can add and edit generic project resources",
            "can_manage_labor",
          )}

          <h3 className="font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-2 mt-6">
            Administrative Access
          </h3>
          {toggleGroup(
            "Approve Changes",
            "Can electronically sign Variation Orders",
            "can_approve_changes",
          )}
        </div>

        <div className="p-4 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 flex items-center gap-2"
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <Check className="w-4 h-4" /> Save Permissions
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
