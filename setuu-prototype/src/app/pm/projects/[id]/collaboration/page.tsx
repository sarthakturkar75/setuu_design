import { PageHeader } from "@/components/ui/PageHeader";
import { MessageSquare, Bot } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CollaborationChat } from "@/components/ui/CollaborationChat";
import { AcknowledgmentMatrix } from "@/components/ui/AcknowledgmentMatrix";
import { getProjectCommunications, getAcknowledgmentMatrix } from "@/app/actions/communicationActions";
import { MeetingMinutesWrapper } from "./MeetingMinutesWrapper";

export default async function CollaborationPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data: identity } = await supabase
    .from("user_identity")
    .select("actor_id, full_name, email")
    .eq("actor_id", user.id)
    .single();

  const { data: actorRecord } = await supabase
    .from("user_actor")
    .select("role, display_name")
    .eq("id", user.id)
    .single();

  const actor = {
    id: user.id,
    full_name: identity?.full_name || actorRecord?.display_name || user.user_metadata?.full_name || user.email || 'System User',
    role: actorRecord?.role || user.user_metadata?.role || 'Member',
    email: identity?.email || user.email
  };

  const initialMessages = await getProjectCommunications(params.id);
  const matrixData = await getAcknowledgmentMatrix(params.id);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-8 pt-8 pb-4 flex-shrink-0">
        <PageHeader 
          title="Site Communications"
          subtitle="Real-time chat, transmittals, AI translations, and read-receipts."
        />
      </div>

      <div className="flex-1 overflow-hidden px-8 pb-8">
        <div className="flex flex-col lg:flex-row h-full gap-6">
          <div className="flex-1 bg-surface border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
            <CollaborationChat 
              projectId={params.id} 
              initialMessages={initialMessages} 
              currentUser={actor} 
            />
          </div>

          <div className="w-full lg:w-96 flex flex-col gap-6 overflow-y-auto">
            <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-on-surface mb-2 flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Meeting Minutes AI
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Upload your site meeting recordings to automatically extract action items and assign tasks.
              </p>
              <MeetingMinutesWrapper projectId={params.id} />
            </div>

            <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm flex-1 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-outline-variant">
                <h3 className="text-lg font-semibold text-on-surface mb-1">Read-Receipt Matrix</h3>
                <p className="text-sm text-on-surface-variant">
                  Track who has acknowledged site broadcasts and transmittals.
                </p>
              </div>
              <div className="flex-1 overflow-hidden">
                <AcknowledgmentMatrix projectId={params.id} messages={matrixData.messages} members={matrixData.members} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
