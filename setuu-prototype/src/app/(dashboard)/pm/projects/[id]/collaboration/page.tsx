import { createClient } from "@/lib/supabase/server";
import { UserCircleIcon, SendIcon, ReplyIcon } from "lucide-react";
import React from "react";

export const metadata = {
  title: "Project Collaboration | Setuu",
};

export default async function CollaborationHubPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  // Fetch comments
  const { data: comments } = await supabase
    .from("comments")
    .select(`
      id,
      body,
      created_at,
      parent_id,
      author:user_actor(identity:user_identity(email))
    `)
    .eq("project_id", params.id)
    .order("created_at", { ascending: true });

  // Simple thread grouping
  const threads = (comments || []).filter(c => !c.parent_id);
  const replies = (comments || []).filter(c => c.parent_id);

  // Helper to parse mentions (e.g. @john.doe) and wrap them in a styled span
  const formatMentions = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(@\w+(?:\.\w+)?)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="bg-semantic-sky/15 text-semantic-sky font-medium px-1 rounded">{part}</span>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full">
      
      <div className="p-6 border-b border-outline-variant/30 shrink-0">
        <h1 className="text-2xl font-bold font-inter text-on-surface tracking-tight">Project Collaboration</h1>
        <p className="text-sm text-on-surface-variant font-inter mt-1">Cross-functional discussion and field reports.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {threads.map((thread: any) => (
          <div key={thread.id} className="bg-surface rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-4 flex gap-4">
              <UserCircleIcon className="w-10 h-10 text-on-surface-variant shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-on-surface text-sm">{thread.author?.identity?.email || "Unknown User"}</span>
                  <span className="text-xs text-on-surface-variant">{new Date(thread.created_at).toLocaleString()}</span>
                </div>
                <p className="text-on-surface text-sm leading-relaxed whitespace-pre-wrap">
                  {formatMentions(thread.body)}
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <button className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                    <ReplyIcon className="w-3 h-3" /> Reply
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Replies */}
            {replies.filter(r => r.parent_id === thread.id).length > 0 && (
              <div className="bg-surface-container/30 border-t border-outline-variant/30 p-4 pl-14 space-y-4">
                {replies.filter(r => r.parent_id === thread.id).map((reply: any) => (
                  <div key={reply.id} className="flex gap-3">
                    <UserCircleIcon className="w-8 h-8 text-on-surface-variant shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-on-surface text-xs">{reply.author?.identity?.email || "Unknown User"}</span>
                        <span className="text-[10px] text-on-surface-variant">{new Date(reply.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-wrap">
                        {formatMentions(reply.body)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {(!threads || threads.length === 0) && (
          <div className="text-center py-12 text-on-surface-variant">
            No discussions started yet.
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface-container border-t border-outline-variant shrink-0 pb-safe">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message... use @ to mention someone" 
            className="flex-1 bg-surface border border-outline-variant rounded-full px-6 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
          />
          <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm shrink-0">
            <SendIcon className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

    </div>
  );
}
