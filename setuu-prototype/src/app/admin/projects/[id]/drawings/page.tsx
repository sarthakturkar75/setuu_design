"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { getDrawings } from "@/app/actions/drawingActions";
import { useParams } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EyeIcon } from "lucide-react";

export default function DrawingAnnotationPage() {
  const [drawings, setDrawings] = React.useState<any[]>([]);
  const params = useParams();
  const id = params?.id as string;

  React.useEffect(() => {
    async function fetchDrawings() {
      if (!id) return;
      const data = await getDrawings(id);
      setDrawings(data);
    }
    fetchDrawings();
  }, [id]);

  const columns = [
    { key: "drawing_name", header: "Drawing Name", cell: (row: any) => <span className="font-medium text-on-surface">{row.drawing_name || `Drawing ${row.id.substring(0,6)}`}</span> },
    { key: "version_number", header: "Version", cell: (row: any) => <>v{row.version_number}</> },
    { key: "status", header: "Status", cell: (row: any) => <StatusBadge label={row.status} tone={row.status === "Active" ? "emerald" : "slate"} /> },
    { key: "actions", header: "", cell: (row: any) => (
      <div className="flex items-center gap-3">
        <a href={row.file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1 text-sm"><EyeIcon className="w-4 h-4"/> View</a>
        <button 
          onClick={async () => {
            if (confirm("Delete this drawing?")) {
              const { deleteDrawing } = await import('@/app/actions/drawingActions');
              await deleteDrawing(row.id);
              setDrawings(d => d.filter(x => x.id !== row.id));
            }
          }}
          className="text-semantic-crimson hover:underline text-sm"
        >
          Delete
        </button>
      </div>
    ) }
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <h2 className="text-xl font-bold font-merriweather text-on-surface mb-6">Project Drawings</h2>
      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
        <DataTable data={drawings} columns={columns} />
      </div>
    </div>
  );
}
