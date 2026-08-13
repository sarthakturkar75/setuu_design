"use client";

import { useTransition } from "react";
import { approveChangeRequest } from "@/app/actions/changeRequestActions";
import { CheckIcon } from "lucide-react";

export function ApproveButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  if (currentStatus === "Approved") {
    return (
      <span className="inline-flex items-center gap-1 text-semantic-emerald text-sm font-medium">
        <CheckIcon className="w-4 h-4" />
        Approved
      </span>
    );
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await approveChangeRequest(id);
        });
      }}
      className="inline-flex items-center justify-center px-3 py-1.5 bg-primary text-on-primary text-xs font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {isPending ? "Approving..." : "Approve"}
    </button>
  );
}
