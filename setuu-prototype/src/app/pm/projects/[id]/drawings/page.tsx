"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getDrawings, deleteDrawing, createDrawing } from "@/app/actions/drawingActions";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EyeIcon, UploadIcon } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function DrawingAnnotationPage() {
  const [drawings, setDrawings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showUploadForm, setShowUploadForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const params = useParams();
  const id = params?.id as string;
  const toast = useToast();

  const fetchDrawings = React.useCallback(async () => {
    if (!id) return;
    try {
      const data = await getDrawings(id);
      setDrawings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchDrawings();
  }, [fetchDrawings]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("project_id", id);
    
    try {
      const res = await createDrawing(formData);
      if (res?.success) {
        toast.success("Drawing uploaded successfully");
        setShowUploadForm(false);
        await fetchDrawings();
      } else {
        toast.error(res?.error || "Failed to upload drawing");
      }
    } catch (err) {
      toast.error("An error occurred while uploading.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "drawing_name", header: "Drawing Name", cell: (row: any) => <span className="font-medium text-on-surface">{row.drawing_name || "Unknown Drawing"}</span> },
    { key: "version_number", header: "Version", cell: (row: any) => <>v{row.version_number}</> },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge label={row.status} tone={row.status === "Active" ? "emerald" : "slate"} /> },
    { key: "actions", header: "", cell: (row: any) => (
      <div className="flex items-center gap-3">
        {row.file_url ? (
          <a href={row.file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm">
            <EyeIcon className="w-4 h-4"/> View
          </a>
        ) : (
          <span className="text-on-surface-variant text-sm">No file</span>
        )}
        <button 
          onClick={async () => {
            if (!window.confirm("Delete this drawing?")) return;
            const res = await deleteDrawing(row.id);
            if (res?.success) {
              setDrawings(d => d.filter(x => x.id !== row.id));
              toast.success("Drawing deleted");
            } else {
              toast.error(res?.error || "Failed to delete drawing");
            }
          }}
          className="text-semantic-crimson hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    ) }
  ];

  if (loading) {
    return <div className="p-6 text-center text-on-surface-variant">Loading drawings...</div>;
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold font-merriweather text-on-surface">Project Drawings</h2>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <UploadIcon className="w-4 h-4" />
          {showUploadForm ? "Cancel Upload" : "Upload Drawing"}
        </button>
      </div>

      {showUploadForm && (
        <form onSubmit={handleUpload} className="bg-surface-variant/30 border border-outline-variant rounded-xl p-6 mb-6 flex flex-col gap-4">
          <h3 className="font-semibold text-on-surface">Upload New Drawing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface-variant">Drawing Name (e.g. A-101 Floor Plan)</label>
              <input name="drawing_name" required className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface-variant">File URL (Mock File Upload)</label>
              <input name="file_url" required type="url" placeholder="https://example.com/plan.pdf" className="w-full p-2.5 rounded-lg border border-outline-variant bg-surface text-sm focus:border-primary outline-none" />
            </div>
          </div>
          <div className="flex justify-end mt-2">
            <button disabled={isSubmitting} type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50">
              {isSubmitting ? "Uploading..." : "Save Drawing"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        {drawings.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">No drawings uploaded yet.</div>
        ) : (
          <DataTable data={drawings} columns={columns} />
        )}
      </div>
    </div>
  );
}
