import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ShieldCheckIcon, AlertOctagonIcon } from "lucide-react";

export const metadata = {
  title: "Org Threat & Virus Scan Dashboard | Setuu",
};

export default async function ThreatsPage() {
  const supabase = await createClient();

  // For demonstration we'll just query audit_log or similar if virus_scan_results is empty
  const { data: scans } = await supabase
    .from("virus_scan_results")
    .select(`
      id,
      file_id,
      status,
      threat_name,
      scanned_at
    `)
    .order("scanned_at", { ascending: false });

  const rows = (scans || []).map((s: any) => ({
    id: s.id,
    fileId: s.file_id,
    status: s.status || "clean",
    threat: s.threat_name || "None",
    date: s.scanned_at,
  }));

  const columns: Column<any>[] = [
    {
      key: "status",
      header: "Status",
      cell: (row) => {
        const isClean = row.status.toLowerCase() === "clean";
        return (
          <div className="flex items-center gap-2">
            {isClean ? (
              <ShieldCheckIcon className="w-5 h-5 text-semantic-emerald" />
            ) : (
              <AlertOctagonIcon className="w-5 h-5 text-semantic-crimson" />
            )}
            <StatusBadge 
              tone={isClean ? "emerald" : "crimson"} 
              label={isClean ? "Clean" : "Infected"} 
            />
          </div>
        );
      },
    },
    {
      key: "fileId",
      header: "File Reference ID",
      cell: (row) => <span className="font-jetbrains-mono text-sm text-on-surface-variant">{row.fileId}</span>,
    },
    {
      key: "threat",
      header: "Threat Signature",
      cell: (row) => (
        <span className={row.threat !== "None" ? "text-semantic-crimson font-medium" : "text-on-surface-variant"}>
          {row.threat}
        </span>
      ),
    },
    {
      key: "date",
      header: "Scanned At (UTC)",
      cell: (row) => (
        <span className="font-jetbrains-mono text-sm">
          {new Date(row.date).toISOString().replace("T", " ").substring(0, 19)}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Threat & Virus Scan Dashboard</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Real-time telemetry of all file uploads scanned via ClamAV engine.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
