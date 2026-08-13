import * as React from "react";
import { Topbar } from "@/components/navigation/Topbar";

export function SuperadminTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Topbar 
      title="Platform Administration" 
      onMenuClick={onMenuClick}
      actions={
        <button className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> Emergency Override Log</button>
      }
    />
  );
}
