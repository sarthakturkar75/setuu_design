import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { DownloadIcon, PlusIcon, SearchIcon, SidebarCloseIcon } from "lucide-react";

export const metadata = {
  title: "Drawing & Media Hub | Setuu",
};

export default async function DrawingsPage() {
  const supabase = await createClient();

  // We fetch drawing_versions joined with projects.
  const { data: drawings } = await supabase
    .from("drawing_versions")
    .select(`
      id,
      drawing_name,
      version_number,
      file_url,
      created_at,
      status,
      projects(name)
    `)
    .order("created_at", { ascending: false });

  // For demonstration, let's group by drawing_name to show history in the sidebar
  // and pick the first one as active in the main viewport.
  
  const selectedDrawing = drawings?.[0] || null;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#1B1C19]">
      {/* Sidebar for Drawing Versions */}
      <aside className="w-80 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-outline-variant/30 bg-surface/50">
          <h2 className="text-lg font-bold font-inter text-on-surface">Drawing Hub</h2>
          <div className="mt-3 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search drawings..."
              className="w-full bg-surface-container rounded-md pl-9 pr-3 py-2 text-sm border-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {drawings?.map((d: any) => (
            <div 
              key={d.id} 
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                d.id === selectedDrawing?.id 
                  ? "bg-primary/10 border-primary shadow-sm" 
                  : "bg-surface border-outline-variant hover:border-primary/50"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-jetbrains-mono">
                  v{d.version_number}.0
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  d.status === "Approved" ? "bg-semantic-emerald-bg text-semantic-emerald-on" : "bg-semantic-amber-bg text-semantic-amber-on"
                }`}>
                  {d.status || "Pending"}
                </span>
              </div>
              <h4 className={`text-sm font-semibold truncate ${d.id === selectedDrawing?.id ? "text-primary" : "text-on-surface"}`}>
                {d.drawing_name}
              </h4>
              <p className="text-xs text-on-surface-variant mt-1 truncate">
                {d.projects?.name}
              </p>
            </div>
          ))}
          {(!drawings || drawings.length === 0) && (
            <p className="text-sm text-on-surface-variant text-center pt-8">No drawings uploaded yet.</p>
          )}
        </div>
        
        <div className="p-4 border-t border-outline-variant/30 bg-surface/50">
          <button className="w-full flex justify-center items-center gap-2 bg-primary text-on-primary rounded-md py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
            <PlusIcon className="w-4 h-4" />
            Upload Revision
          </button>
        </div>
      </aside>

      {/* Main Viewport (Dark Inverse) */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Toolbar */}
        <header className="h-14 border-b border-[#303030] flex items-center justify-between px-4 shrink-0 bg-[#222222]">
          <div className="flex items-center gap-3">
            <button className="text-[#a0a0a0] hover:text-white transition-colors">
              <SidebarCloseIcon className="w-5 h-5" />
            </button>
            <div className="h-4 w-px bg-[#404040]"></div>
            <h1 className="text-white font-medium text-sm">
              {selectedDrawing ? `${selectedDrawing.drawing_name} (v${selectedDrawing.version_number}.0)` : 'No Drawing Selected'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/drawings/compare"
              className="text-xs font-medium bg-[#333333] hover:bg-[#444444] text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Compare Versions
            </Link>
            <button className="text-[#a0a0a0] hover:text-white transition-colors" title="Download">
              <DownloadIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
          {/* Blueprint mockup */}
          {selectedDrawing ? (
            <div className="w-full h-full border-2 border-[#333333] rounded-lg border-dashed flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Grid background to simulate CAD */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                  backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                  backgroundSize: `50px 50px`
                }} 
              />
              <div className="text-center z-10 p-6 bg-[#222222]/80 backdrop-blur-md rounded-xl border border-[#444444] opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-lg font-medium mb-2">{selectedDrawing.drawing_name}</p>
                <p className="text-[#a0a0a0] text-sm">Use standard pinch/scroll to zoom and pan.</p>
              </div>
            </div>
          ) : (
            <div className="text-[#a0a0a0] text-center">
              <p>Select a drawing from the sidebar to view.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
