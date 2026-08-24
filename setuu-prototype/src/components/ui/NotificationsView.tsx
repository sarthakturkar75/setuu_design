"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getNotifications, markAsRead } from "@/app/actions/notificationActions";
import { createClient } from "@/lib/supabase/client";
import { Bell, Check, CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export function NotificationsView() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    let cancelled = false;
    const load = () => {
      getNotifications(user.id).then((data) => {
        if (!cancelled) {
          setNotifications(data || []);
          setIsLoading(false);
        }
      }).catch(console.error);
    };
    
    load();

    const supabase = createClient();
    const channel = supabase
      .channel("realtime:notifications_page")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => {
        load(); // Reload everything on change for simplicity, or we could patch state
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleMarkAsRead = async (id: string) => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    const res = await markAsRead(id);
    if (!res.success) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: false } : n)));
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    unread.forEach(n => handleMarkAsRead(n.id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Inbox & Notifications" subtitle={`You have ${unreadCount} unread messages.`} />
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead} 
            className="flex items-center gap-2 bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden shadow-sm">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant">
            <Bell className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-semibold">You're all caught up!</p>
            <p className="text-xs mt-1">No new notifications to show.</p>
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/30">
            {notifications.map((n) => (
              <li 
                key={n.id} 
                className={`p-4 flex items-start gap-4 transition-colors ${n.is_read ? 'bg-surface-container-lowest opacity-75' : 'bg-primary/5 hover:bg-primary/10'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {n.is_read ? (
                    <Circle className="w-5 h-5 text-on-surface-variant/50" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-on-primary"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className={`text-sm truncate ${n.is_read ? 'font-medium text-on-surface' : 'font-bold text-on-surface'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0 text-[10px] text-on-surface-variant">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <p className={`mt-1 text-xs line-clamp-2 ${n.is_read ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                    {n.body}
                  </p>
                </div>
                
                {!n.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="flex-shrink-0 p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
