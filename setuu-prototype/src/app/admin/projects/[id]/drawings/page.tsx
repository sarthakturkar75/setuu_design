"use client";

import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { UploadCloud, BoxSelect, FolderTree, Search } from "lucide-react";
import { getProjectDrawings } from "@/app/actions/drawingActions";
import { useToast } from "@/contexts/ToastContext";

import { InteractiveDrawingCanvas } from "@/components/ui/InteractiveDrawingCanvas";
import { BlueprintDiffViewer } from "@/components/ui/BlueprintDiffViewer";
import { DrawingDisciplineToggle } from "@/components/ui/DrawingDisciplineToggle";
import { UploadDrawingModal } from "@/components/ui/UploadDrawingModal";
import { AutoSlipSheetModal } from "@/components/ui/AutoSlipSheetModal";
import { DrawingSettingsModal } from "@/components/ui/DrawingSettingsModal";
import { Settings } from "lucide-react";

export default function DrawingsList({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [drawings, setDrawings] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mode, setMode] = React.useState<'canvas' | 'diff' | 'disciplines'>('canvas');
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [showSlipSheetModal, setShowSlipSheetModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [disciplineFilter, setDisciplineFilter] = React.useState('All');
  
  const [selectedDrawingId, setSelectedDrawingId] = React.useState<string | null>(null);

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getProjectDrawings(id);
      setDrawings(data || []);
      if (data && data.length > 0 && !selectedDrawingId) {
        setSelectedDrawingId(data[0].id);
      }
    } catch (err) {
      toast.error("Failed to fetch drawings");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [id]);

  // Run NLP OCR Scan Pipeline
  const triggerOCRScan = async (drawingId: string) => {
     toast.info("Running NLP Optical Scan...");
     const res = await fetch('/api/drawings/ocr-scan', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ drawingId, projectId: id })
     });
     const data = await res.json();
     if (data.success) {
       toast.success(`OCR Complete. Mapped ${data.linksCreated} hyperlinks.`);
       loadData();
     } else {
       toast.error(`OCR Failed: ${data.error}`);
     }
  };

  // Group drawings by drawing_name for the sidebar
  const groupedDrawings = drawings.reduce((acc: any, curr: any) => {
    if (!acc[curr.drawing_name]) acc[curr.drawing_name] = [];
    acc[curr.drawing_name].push(curr);
    return acc;
  }, {});

  const selectedDrawing = drawings.find(d => d.id === selectedDrawingId);
  const allVersionsOfSelected = selectedDrawing ? groupedDrawings[selectedDrawing.drawing_name] : [];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Blueprint Management" 
        subtitle="Version control, takeoffs, diffing, and discipline layering."
        actions={
          <div className="flex gap-2">
             <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-4 py-2 bg-surface text-on-surface border border-outline-variant rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors">
                <UploadCloud className="w-4 h-4" /> Upload Blueprint
             </button>
             <button onClick={() => setShowSlipSheetModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                <BoxSelect className="w-4 h-4" /> Auto-Slip Sheet PDF
             </button>
          </div>
        }
      />
      
      {showUploadModal && (
        <UploadDrawingModal 
          projectId={id} 
          onClose={() => setShowUploadModal(false)} 
          onSuccess={() => { setShowUploadModal(false); loadData(); }} 
        />
      )}

      {showSlipSheetModal && (
        <AutoSlipSheetModal 
          projectId={id} 
          onClose={() => setShowSlipSheetModal(false)} 
          onSuccess={() => { setShowSlipSheetModal(false); loadData(); }} 
        />
      )}

      {showSettingsModal && selectedDrawing && (
        <DrawingSettingsModal 
          drawing={selectedDrawing} 
          allVersionsCount={allVersionsOfSelected.length}
          onClose={() => setShowSettingsModal(false)} 
          onSuccess={() => { setShowSettingsModal(false); loadData(); }} 
        />
      )}
      
      {/* Engine Controls */}
      <div className="flex gap-2 mb-4 bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/50 w-fit">
         <button onClick={() => setMode('canvas')} className={`px-4 py-1.5 rounded text-sm font-bold transition-colors ${mode === 'canvas' ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant text-on-surface-variant'}`}>Interactive Canvas</button>
         <button onClick={() => setMode('diff')} className={`px-4 py-1.5 rounded text-sm font-bold transition-colors ${mode === 'diff' ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant text-on-surface-variant'}`}>Visual Diffing</button>
         <button onClick={() => setMode('disciplines')} className={`px-4 py-1.5 rounded text-sm font-bold transition-colors ${mode === 'disciplines' ? 'bg-primary text-on-primary' : 'hover:bg-surface-variant text-on-surface-variant'}`}>Discipline Overlays</button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm font-semibold text-on-surface-variant animate-pulse">Loading blueprints...</div>
      ) : drawings.length === 0 ? (
        <div className="p-12 text-center text-sm font-semibold text-on-surface-variant bg-surface-container rounded-xl border border-outline-variant border-dashed flex flex-col items-center justify-center gap-4">
           <FolderTree className="w-12 h-12 text-outline-variant" />
           <p>No blueprints found. Upload a revision or slip-sheet a master PDF.</p>
        </div>
      ) : (
        <div className="flex gap-6 h-[700px]">
          
          {/* Sidebar Directory */}
          <div className="w-64 flex-shrink-0 bg-surface-container rounded-xl border border-outline-variant/50 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-outline-variant/50 bg-surface-container-lowest">
               <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                 <FolderTree className="w-4 h-4 text-primary" /> Drawing Index
               </h3>
             </div>
             
             {/* Search & Filter Controls */}
             <div className="p-2 border-b border-outline-variant/50 flex flex-col gap-2 bg-surface-container-lowest">
                <div className="relative">
                   <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                   <input 
                      type="text" 
                      placeholder="Search sheets..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-7 pr-2 py-1.5 text-xs bg-surface border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors"
                   />
                </div>
                <select 
                   value={disciplineFilter}
                   onChange={e => setDisciplineFilter(e.target.value)}
                   className="w-full px-2 py-1.5 text-xs bg-surface border border-outline-variant rounded focus:outline-none focus:border-primary transition-colors"
                >
                   <option value="All">All Disciplines</option>
                   <option value="Architectural">Architectural</option>
                   <option value="Structural">Structural</option>
                   <option value="Plumbing">Plumbing</option>
                   <option value="Electrical">Electrical</option>
                   <option value="Mechanical">Mechanical (HVAC)</option>
                   <option value="Fire Protection">Fire Protection</option>
                </select>
             </div>

             <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
               {Object.keys(groupedDrawings).filter(name => {
                 const latest = groupedDrawings[name][0];
                 const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
                 const matchesDiscipline = disciplineFilter === 'All' || latest?.custom_data?.discipline === disciplineFilter;
                 return matchesSearch && matchesDiscipline;
               }).length === 0 ? (
                 <div className="text-center p-4 text-xs text-on-surface-variant italic">
                   No sheets match your filters.
                 </div>
               ) : (
                 Object.keys(groupedDrawings).filter(name => {
                   const latest = groupedDrawings[name][0];
                   const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
                   const matchesDiscipline = disciplineFilter === 'All' || latest?.custom_data?.discipline === disciplineFilter;
                   return matchesSearch && matchesDiscipline;
                 }).map(name => {
                   const latestVersion = groupedDrawings[name][0]; // Assuming pre-sorted by DB
                   const isSelected = selectedDrawing?.drawing_name === name;
                   return (
                     <button 
                       key={name} 
                       onClick={() => setSelectedDrawingId(latestVersion.id)}
                       className={`text-left p-3 rounded-lg border flex flex-col gap-1 transition-colors ${isSelected ? 'bg-primary/10 border-primary/30 text-on-surface' : 'bg-transparent border-transparent text-on-surface-variant hover:bg-surface-variant'}`}
                     >
                       <span className="text-sm font-bold truncate">{name}</span>
                       <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] uppercase font-bold bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant">
                            {latestVersion.custom_data?.discipline || 'Unknown'}
                          </span>
                          <span className="text-[10px] font-medium text-on-surface-variant">
                            {groupedDrawings[name].length} {groupedDrawings[name].length === 1 ? 'version' : 'versions'}
                          </span>
                       </div>
                     </button>
                   );
                 })
               )}
             </div>
          </div>

          {/* Main Viewer Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {mode === 'canvas' && selectedDrawing && (
              <div className="space-y-4 h-full flex flex-col">
                 <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant/50">
                   <div className="flex items-center gap-4">
                     <span className="text-sm font-bold text-on-surface">Revision History:</span>
                     <div className="flex gap-2">
                       {allVersionsOfSelected.map((v: any) => (
                         <button 
                           key={v.id} 
                           onClick={() => setSelectedDrawingId(v.id)}
                           className={`px-3 py-1 rounded text-xs font-bold transition-colors ${selectedDrawingId === v.id ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
                         >
                           v{v.version_number}
                         </button>
                       ))}
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => setShowSettingsModal(true)} className="flex items-center gap-1 text-[10px] bg-surface-variant text-on-surface py-1.5 px-3 rounded font-bold uppercase hover:bg-surface-variant/80">
                       <Settings className="w-3 h-3" /> Manage
                     </button>
                     <button onClick={() => selectedDrawingId && triggerOCRScan(selectedDrawingId)} className="text-[10px] bg-primary/10 text-primary py-1.5 px-3 rounded font-bold uppercase hover:bg-primary/20">Run AI OCR Scan</button>
                   </div>
                 </div>
                 <div className="flex-1 min-h-0">
                   <InteractiveDrawingCanvas drawing={selectedDrawing} />
                 </div>
              </div>
            )}

            {mode === 'diff' && allVersionsOfSelected.length >= 2 && (
               <BlueprintDiffViewer v1Url={allVersionsOfSelected[1].file_url} v2Url={allVersionsOfSelected[0].file_url} />
            )}
            {mode === 'diff' && allVersionsOfSelected.length < 2 && (
               <div className="p-12 text-center text-sm font-semibold text-on-surface-variant bg-surface-container rounded-xl border border-outline-variant border-dashed">
                 Need at least 2 revisions of this drawing to run the diff engine. Upload another blueprint with the same name.
               </div>
            )}

            {mode === 'disciplines' && (
               <DrawingDisciplineToggle drawings={drawings} />
            )}
          </div>

        </div>
      )}
    </div>
  );
}
