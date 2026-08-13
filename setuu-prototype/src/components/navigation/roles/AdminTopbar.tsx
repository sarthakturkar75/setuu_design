import * as React from "react";
import { Topbar } from "@/components/navigation/Topbar";

export function AdminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Topbar 
      title="Admin Portal" 
      onMenuClick={onMenuClick}
      actions={
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">Emergency Lock</button>
      }
    />
  );
}
