import * as React from "react";
import { Topbar } from "@/components/navigation/Topbar";

export function ClientTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Topbar 
      title="Client Portal" 
      onMenuClick={onMenuClick}
      actions={
        null
      }
    />
  );
}
