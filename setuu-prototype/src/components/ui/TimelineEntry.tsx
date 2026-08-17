import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface TimelineEntryProps {
  actorName: string;
  actorAvatar?: string;
  timestamp: string;
  action: string;
  description?: string;
  mediaUrls?: string[];
  isLast?: boolean;
}

export function TimelineEntry({ actorName, actorAvatar, timestamp, action, description, mediaUrls, isLast }: TimelineEntryProps) {
  return (
    <div className="relative pl-8 pb-8">
      {!isLast && (
        <div className="absolute left-[15px] top-8 bottom-0 w-px bg-outline-variant/50" />
      )}
      <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center overflow-hidden z-10">
        {actorAvatar ? (
          <img src={actorAvatar} alt={actorName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-bold text-on-surface-variant">
            {actorName.charAt(0)}
          </span>
        )}
      </div>
      
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-inter text-on-surface">
              <span className="font-semibold">{actorName}</span> {action}
            </p>
            <p className="text-xs text-on-surface-variant font-jetbrains-mono mt-0.5">
              {timestamp}
            </p>
          </div>
          <button className="text-outline-variant hover:text-on-surface transition-colors p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        {description && (
          <div className="mt-2 text-sm text-on-surface-variant bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30">
            {description}
          </div>
        )}
        
        {mediaUrls && mediaUrls.length > 0 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
            {mediaUrls.map((url, idx) => (
              <div key={idx} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-outline-variant/30">
                <img src={url} alt={`Attachment ${idx+1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
