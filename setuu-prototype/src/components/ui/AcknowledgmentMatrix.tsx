"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type MatrixProps = {
  projectId: string;
  messages: any[];
  members: any[];
};

export function AcknowledgmentMatrix({ projectId, messages: initialMessages, members }: MatrixProps) {
  const [messages, setMessages] = useState(initialMessages);
  const router = useRouter();
  const supabase = createClient();

  // Sync state with props when Server Component re-renders
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const channel = supabase.channel(`matrix:${projectId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "project_communications",
        filter: `project_id=eq.${projectId}`
      }, () => {
        router.refresh();
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "communication_reads"
      }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, router, supabase]);

  if (messages.length === 0) {
    return <div className="p-4 text-sm text-on-surface-variant text-center">No broadcasts or transmittals found.</div>;
  }

  return (
    <div className="overflow-auto h-full pb-4">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-on-surface-variant bg-surface z-10 sticky top-0 shadow-sm">
          <tr>
            <th className="px-4 py-3 font-medium rounded-tl-lg">Broadcast / Transmittal</th>
            {members.map(m => (
              <th key={m.id} className="px-4 py-3 font-medium text-center truncate max-w-[100px]" title={m.full_name}>
                {m.full_name.split(' ')[0]}
                <div className="text-[10px] opacity-70 font-normal">{m.role}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/30">
          {messages.map(msg => (
            <tr key={msg.id} className="hover:bg-surface-variant/10 transition-colors">
              <td className="px-4 py-3 max-w-[200px]">
                <p className="truncate text-on-surface font-medium">{msg.message}</p>
                <div className="flex gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${msg.is_transmittal ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                    {msg.is_transmittal ? 'Transmittal' : 'Broadcast'}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </td>
              {members.map(m => {
                const hasRead = msg.reads?.some((r: any) => r.user_id === m.id);
                return (
                  <td key={m.id} className="px-4 py-3 text-center">
                    {hasRead ? (
                      <CheckCircle2 className="w-5 h-5 text-semantic-emerald mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-error/50 mx-auto" />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
