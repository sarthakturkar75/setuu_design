"use client";

import React from "react";
import { TrashIcon } from "lucide-react";
import { deleteDailyLog } from "@/app/actions/dailyLogActions";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export function DeleteDailyLogButton({ logId }: { logId: string }) {
  const toast = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this Daily Log?")) return;
    const res = await deleteDailyLog(logId);
    if (res.success) {
      toast.success("Daily Log deleted successfully.");
      router.refresh();
    } else {
      toast.error("Failed to delete log.");
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 bg-surface-variant hover:bg-semantic-crimson/10 text-on-surface-variant hover:text-semantic-crimson rounded-lg transition-colors border border-outline-variant hover:border-semantic-crimson/30"
      title="Delete Daily Log"
    >
      <TrashIcon className="w-4 h-4" />
    </button>
  );
}
