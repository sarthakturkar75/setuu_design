"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getDrawings, deleteDrawing } from "@/app/actions/drawingActions";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EyeIcon } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export default function DrawingAnnotationPage() {
  const [drawings, setDrawings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const params = useParams();
  const id = params?.id as string;
  const toast = useToast();

  React.useEffect(() => {
    async function fetchDrawings() {
      if (!id) return;
      try {
        const data = await getDrawings(id);
        setDrawings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDrawings();
  }, [id]);

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
      <h2 className="text-xl font-bold font-merriweather text-on-surface mb-6">Project Drawings</h2>
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
