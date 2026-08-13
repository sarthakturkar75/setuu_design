import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { FileCheckIcon, UsersIcon, LightbulbIcon } from "lucide-react";

export const metadata = {
  title: "Handover & Insights | Setuu",
};

export default async function HandoverHubPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const [handoversRes, meetingsRes, lessonsRes] = await Promise.all([
    supabase.from("project_handovers").select("*").eq("project_id", params.id).order("created_at", { ascending: false }),
    supabase.from("client_meetings").select("*").eq("project_id", params.id).order("meeting_date", { ascending: false }),
    supabase.from("lessons_learned").select("*").eq("project_id", params.id).order("created_at", { ascending: false })
  ]);

  const handovers = handoversRes.data || [];
  const meetings = meetingsRes.data || [];
  const lessons = lessonsRes.data || [];

  return (
    <div className="p-6 max-w-[100rem] mx-auto w-full pb-20 space-y-8">
      
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Handovers & Insights</h1>
          <p className="text-sm text-on-surface-variant font-inter mt-1">Formal client meetings, project sign-offs, and post-mortem learnings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Client Meetings */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-on-surface font-merriweather font-bold text-lg mb-2">
            <UsersIcon className="w-5 h-5 text-semantic-royal" />
            Client Meetings
          </div>
          {meetings.map((m: any) => (
            <Card key={m.id} className="border-outline-variant/50 shadow-sm hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3 border-b border-outline-variant/20">
                <CardTitle className="text-base flex justify-between items-start">
                  <span>{m.meeting_type}</span>
                  <span className="text-xs font-jetbrains-mono text-on-surface-variant font-normal bg-surface-container px-2 py-1 rounded">
                    {new Date(m.meeting_date).toLocaleDateString()}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-on-surface-variant line-clamp-3">
                  {m.agenda || "No agenda provided."}
                </p>
                <div className="mt-3 text-xs font-medium text-primary hover:underline cursor-pointer">View Minutes &rarr;</div>
              </CardContent>
            </Card>
          ))}
          {meetings.length === 0 && <p className="text-sm text-on-surface-variant text-center py-8 bg-surface-container rounded-xl border border-dashed border-outline-variant">No meetings recorded.</p>}
        </div>

        {/* Handovers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-on-surface font-merriweather font-bold text-lg mb-2">
            <FileCheckIcon className="w-5 h-5 text-semantic-emerald" />
            Formal Handovers
          </div>
          {handovers.map((h: any) => (
            <Card key={h.id} className="border-outline-variant/50 shadow-sm hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3 border-b border-outline-variant/20 bg-semantic-emerald/5">
                <CardTitle className="text-base flex justify-between items-start">
                  <span>{h.document_type}</span>
                  <span className="text-xs font-medium text-semantic-emerald uppercase bg-semantic-emerald/10 px-2 py-1 rounded">
                    {h.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-on-surface-variant line-clamp-3 mb-2">
                  {h.notes || "No handover notes."}
                </p>
                {h.signoff_date && (
                  <p className="text-xs text-on-surface font-medium flex items-center gap-1">
                    Signed off on: <span className="font-jetbrains-mono">{new Date(h.signoff_date).toLocaleDateString()}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          {handovers.length === 0 && <p className="text-sm text-on-surface-variant text-center py-8 bg-surface-container rounded-xl border border-dashed border-outline-variant">No handovers recorded.</p>}
        </div>

        {/* Lessons Learned */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-on-surface font-merriweather font-bold text-lg mb-2">
            <LightbulbIcon className="w-5 h-5 text-semantic-amber" />
            Lessons Learned
          </div>
          {lessons.map((l: any) => (
            <Card key={l.id} className="border-outline-variant/50 shadow-sm hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3 border-b border-outline-variant/20 bg-semantic-amber/5">
                <CardTitle className="text-base capitalize">{l.category}</CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-sm text-on-surface font-medium mb-1">Observation:</p>
                <p className="text-sm text-on-surface-variant mb-3">{l.description}</p>
                
                <p className="text-sm text-on-surface font-medium mb-1">Actionable Takeaway:</p>
                <p className="text-sm text-on-surface-variant">{l.recommendation}</p>
              </CardContent>
            </Card>
          ))}
          {lessons.length === 0 && <p className="text-sm text-on-surface-variant text-center py-8 bg-surface-container rounded-xl border border-dashed border-outline-variant">No insights logged yet.</p>}
        </div>

      </div>
    </div>
  );
}
