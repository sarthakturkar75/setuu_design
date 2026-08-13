import * as React from "react";
import { Topbar } from "@/components/navigation/Topbar";

export function PMTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Topbar 
      title="PM Command Center" 
      onMenuClick={onMenuClick}
      actions={
        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> Generate Report</button>
      }
    />
  );
}
