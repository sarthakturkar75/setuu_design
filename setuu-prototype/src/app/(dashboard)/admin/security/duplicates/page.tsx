import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SplitSquareHorizontalIcon, CheckCircle2Icon, Trash2Icon } from "lucide-react";

export const metadata = {
  title: "Duplicate File Resolution | Setuu",
};

export default async function DuplicatesPage() {
  const supabase = await createClient();

  const { data: duplicates } = await supabase
    .from("duplicate_files")
    .select(`
      id,
      original_file_id,
      duplicate_file_id,
      similarity_score,
      status,
      created_at
    `)
    .order("created_at", { ascending: false });

  const rows = (duplicates || []).map((d: any) => ({
    id: d.id,
    original: d.original_file_id,
    duplicate: d.duplicate_file_id,
    similarity: d.similarity_score,
    status: d.status || "Pending",
    date: d.created_at,
  }));

  const columns: Column<any>[] = [
    {
      key: "original",
      header: "Original File",
      cell: (row) => <span className="font-jetbrains-mono text-sm">{row.original}</span>,
    },
    {
      key: "duplicate",
      header: "Duplicate Upload",
      cell: (row) => <span className="font-jetbrains-mono text-sm text-semantic-amber">{row.duplicate}</span>,
    },
    {
      key: "similarity",
      header: "Similarity Score",
      cell: (row) => (
        <span className="font-jetbrains-mono font-medium">
          {(row.similarity * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        let tone: any = "slate";
        if (row.status.toLowerCase() === "resolved") tone = "emerald";
        if (row.status.toLowerCase() === "pending") tone = "amber";
        return <StatusBadge tone={tone} label={row.status} />;
      },
    },
    {
      key: "actions",
      header: "Resolution",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.status.toLowerCase() === "pending" ? (
            <>
              <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Merge & Keep Original">
                <CheckCircle2Icon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-on-surface-variant hover:text-semantic-crimson hover:bg-semantic-crimson/10 rounded transition-colors" title="Delete Duplicate">
                <Trash2Icon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Compare Side-by-Side">
                <SplitSquareHorizontalIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-on-surface-variant">Actioned</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Duplicate File Resolution</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Review and merge visually or hashing-identical uploads to save storage and prevent confusion.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
