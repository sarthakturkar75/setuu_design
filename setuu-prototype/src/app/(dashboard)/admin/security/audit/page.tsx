import { createClient } from "@/lib/supabase/server";
import { DataTable, type Column } from "@/components/ui/DataTable";

export const metadata = {
  title: "Audit Log Viewer | Setuu",
};

export default async function AuditLogPage() {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("audit_log")
    .select(`
      id,
      action,
      table_name,
      record_id,
      ip_address,
      user_agent,
      created_at,
      actor:user_actor(display_name)
    `)
    .order("created_at", { ascending: false });

  const rows = (logs || []).map((l: any) => ({
    id: l.id,
    user: l.actor?.display_name || "System",
    action: l.action,
    table: l.table_name || "N/A",
    record: l.record_id || "N/A",
    ip: l.ip_address || "Unknown",
    timestamp: l.created_at,
  }));

  const columns: Column<any>[] = [
    {
      key: "timestamp",
      header: "Timestamp (UTC)",
      cell: (row) => (
        <span className="font-jetbrains-mono text-sm text-on-surface-variant">
          {new Date(row.timestamp).toISOString().replace("T", " ").substring(0, 19)}
        </span>
      ),
    },
    {
      key: "user",
      header: "Actor",
      cell: (row) => <span className="font-medium text-on-surface">{row.user}</span>,
    },
    {
      key: "action",
      header: "Action",
      cell: (row) => {
        let color = "text-on-surface-variant";
        if (row.action.includes("INSERT") || row.action.includes("CREATE")) color = "text-semantic-emerald";
        if (row.action.includes("UPDATE") || row.action.includes("MODIFY")) color = "text-semantic-amber";
        if (row.action.includes("DELETE") || row.action.includes("REMOVE")) color = "text-semantic-crimson";
        
        return <span className={`font-semibold ${color}`}>{row.action}</span>;
      },
    },
    {
      key: "table",
      header: "Target Entity",
      cell: (row) => row.table,
    },
    {
      key: "record",
      header: "Record ID",
      cell: (row) => <span className="font-jetbrains-mono text-xs text-on-surface-variant">{row.record}</span>,
    },
    {
      key: "ip",
      header: "IP Address",
      cell: (row) => <span className="font-jetbrains-mono text-xs bg-surface-container px-2 py-1 rounded">{row.ip}</span>,
    },
  ];

  return (
    <div className="p-6 max-w-[100rem] mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Organizational Audit Log</h1>
        <p className="text-on-surface-variant font-inter mt-1">
          Immutable, read-only ledger of all administrative actions and security events.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <DataTable columns={columns} data={rows} />
      </div>
    </div>
  );
}
