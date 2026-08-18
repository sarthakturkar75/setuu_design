import * as React from "react";
import { Topbar } from "@/components/navigation/Topbar";
import { ChevronDownIcon } from "lucide-react";

export function PMTopbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <Topbar 
      title="PM Command Center" 
      onMenuClick={onMenuClick}
      isAdmin={false} // PM is not a system admin, so hide emergency button
      actions={
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant hover:bg-surface-variant/80 text-on-surface rounded-lg text-sm font-medium transition-colors border border-outline-variant">
              <span>Alpha Tower Build</span>
              <ChevronDownIcon className="w-4 h-4 text-on-surface-variant" />
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-l2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              <div className="px-3 py-2 text-xs font-semibold text-outline tracking-wider uppercase">Active Projects</div>
              <a href="/pm/projects/1" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">Alpha Tower Build</a>
              <a href="/pm/projects/2" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">Sector 7 Pipeline</a>
              <a href="/pm/projects/3" className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">Refinery Expansion</a>
              <div className="border-t border-outline-variant/30 my-1"></div>
              <a href="/pm/projects" className="block px-4 py-2 text-sm text-primary hover:bg-surface-variant transition-colors font-medium">View All Projects</a>
            </div>
          </div>
        </div>
      }
    />
  );
}
