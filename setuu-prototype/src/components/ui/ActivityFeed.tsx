import React from "react";
import { UserCircleIcon, ClockIcon, MessageSquare, CheckCircle } from "lucide-react";
import { AvatarGroup } from "./AvatarGroup";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "update" | "issue" | "material" | "milestone";
  content: string;
  timestamp: string;
  author_name?: string;
  author_avatar?: string;
  media?: { url: string; type: string }[];
  requiresAction?: boolean;
}

export function ActivityFeed({ items, onAcknowledge, onDiscuss }: { items: ActivityItem[], onAcknowledge?: (id: string) => void, onDiscuss?: (id: string) => void }) {
  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center text-on-surface-variant border border-dashed border-outline-variant rounded-xl bg-surface-container-lowest">
        No activity recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
      {items.map((item, index) => (
        <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Timeline Node */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {item.type === 'update' && <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/></svg>}
            {item.type !== 'update' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          
          {/* Content Card */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {item.author_avatar ? (
                  <AvatarGroup users={[{ id: item.id, name: item.author_name || "System", avatarUrl: item.author_avatar }]} size="sm" max={1} />
                ) : (
                  <UserCircleIcon className="w-5 h-5 text-on-surface-variant" />
                )}
                <span className="font-semibold text-sm text-on-surface">{item.author_name || "System"}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant font-jetbrains-mono tracking-tight">
                <ClockIcon className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleString(undefined, { 
                   month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </div>
            </div>
            
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {item.content}
            </p>

            {item.media && item.media.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {item.media.map((m, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-surface-container border border-outline-variant">
                    {/* Placeholder for media */}
                    <img src={m.url} alt="Attachment" className="object-cover w-full h-full hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            )}

            {item.requiresAction && (
              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-2">
                <button 
                  onClick={() => onDiscuss?.(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-surface-variant text-on-surface-variant hover:bg-outline-variant/30 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Discuss
                </button>
                <button 
                  onClick={() => onAcknowledge?.(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-semantic-royal-bg text-semantic-royal-on hover:bg-semantic-royal-bg/90 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Acknowledge
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
