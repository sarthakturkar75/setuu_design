"use client";

import { useState, useEffect, useRef } from "react";
import { Send, FileText, CheckCircle2, Languages, Globe } from "lucide-react";
import { AudioRecorder } from "./AudioRecorder";
import { sendChatMessage, markMessageRead, resolveSenderMetadata } from "@/app/actions/communicationActions";
import { createClient } from "@/lib/supabase/client";

export function CollaborationChat({ projectId, initialMessages, currentUser }: { projectId: string, initialMessages: any[], currentUser: any }) {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTransmittal, setIsTransmittal] = useState(false);
  const [isBroadcastCheckbox, setIsBroadcastCheckbox] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [mentionFilter, setMentionFilter] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    // Fetch project users for mentions
    const fetchUsers = async () => {
      const { data: actors } = await supabase.from('user_actor').select('id, display_name, role').eq('is_active', true);
      const { data: identities } = await supabase.from('user_identity').select('actor_id, full_name');
      if (actors) {
        setProjectUsers(actors.map(a => {
          const ident = identities?.find(i => i.actor_id === a.id);
          return { id: a.id, full_name: ident?.full_name || a.display_name || 'Unknown', role: a.role || 'Member' };
        }));
      }
    };
    fetchUsers();

    // Scroll to bottom on load
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);

    // Setup Realtime
    const channel = supabase.channel(`public:project_communications:project_id=eq.${projectId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "project_communications",
        filter: `project_id=eq.${projectId}`
      }, (payload) => {
        // Optimistic append, usually requires fetching relations (sender_id)
        // For prototype, we trigger a page refresh or append a skeleton
        // Best approach: fetch the single message with relations
        fetchMessageRelations(payload.new.id);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  const fetchMessageRelations = async (id: string) => {
    const { data } = await supabase
      .from("project_communications")
      .select(`
        *,
        mentions:communication_mentions (mentioned_user_id),
        reads:communication_reads (user_id)
      `)
      .eq("id", id)
      .single();
      
    if (data) {
      // Safely fetch sender via Server Action to bypass RLS restrictions
      const senderMeta = await resolveSenderMetadata(data.sender_id);
      
      const fullData = {
        ...data,
        sender: {
          id: data.sender_id,
          full_name: senderMeta?.full_name || 'System User',
          role: senderMeta?.role || 'Member'
        }
      };

      setMessages((prev: any) => [...prev.filter((m: any) => m.id !== fullData.id), fullData].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()));
      setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
      
      if (fullData.sender_id !== currentUser.id && !fullData.is_broadcast && !fullData.is_transmittal) {
        markMessageRead(fullData.id);
      }
    }
  };

  
  const handleTextChange = (e: any) => {
    const val = e.target.value;
    setInputText(val);
    
    // Simple @mention detection
    const lastWord = val.split(" ").pop();
    if (lastWord.startsWith("@")) {
      setShowMentions(true);
      setMentionFilter(lastWord.slice(1).toLowerCase());
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (user: any) => {
    const words = inputText.split(" ");
    words.pop(); // remove the @typed
    setInputText([...words, `@${user.full_name}`].join(" ") + " ");
    setShowMentions(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    setIsSending(true);
    const text = inputText;
    setInputText("");
    
    const isBroadcast = isBroadcastCheckbox || text.startsWith("/broadcast ");
    const cleanText = isBroadcast ? text.replace("/broadcast ", "") : text;
    
    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      id: tempId,
      project_id: projectId,
      sender_id: currentUser.id,
      message: cleanText,
      is_broadcast: isBroadcast,
      is_transmittal: isTransmittal,
      created_at: new Date().toISOString(),
      sender: currentUser,
      reads: []
    };
    
    setMessages((prev: any) => [...prev, tempMsg]);
    setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);

    const res = await sendChatMessage(projectId, cleanText, undefined, [], isBroadcast, isTransmittal);
    
    // Swap temp ID for real ID so Realtime deduplicates it correctly if needed
    if (res?.success && res?.data) {
      setMessages((prev: any) => prev.map((m: any) => m.id === tempId ? { ...m, id: res.data.id } : m));
      // Manually trigger the fetch just in case realtime drops the packet locally
      fetchMessageRelations(res.data.id);
    }
    
    setIsTransmittal(false);
    setIsBroadcastCheckbox(false);
    setIsSending(false);
  };

  const handleAudioComplete = async (blob: Blob, transcript: string) => {
    setIsSending(true);
    try {
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        id: tempId,
        project_id: projectId,
        sender_id: currentUser.id,
        message: transcript,
        is_broadcast: false,
        is_transmittal: false,
        created_at: new Date().toISOString(),
        sender: currentUser,
        reads: [],
        audio_url: "pending"
      };
      
      setMessages((prev: any) => [...prev, tempMsg]);
      setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 50);

      const fileName = `audio_${Date.now()}.webm`;
      const { data, error } = await supabase.storage.from('project-assets').upload(`${projectId}/communications/${fileName}`, blob);
      
      let audioUrl = "";
      if (data) {
        const { data: publicUrlData } = supabase.storage.from('project-assets').getPublicUrl(data.path);
        audioUrl = publicUrlData.publicUrl;
      }
      
      const res = await sendChatMessage(projectId, transcript, audioUrl, [], false, false);
      if (res?.success && res?.data) {
        setMessages((prev: any) => prev.map((m: any) => m.id === tempId ? { ...m, id: res.data.id, audio_url: audioUrl } : m));
        fetchMessageRelations(res.data.id);
      }
    } catch (e) {
      console.error("Audio upload failed", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUser.id;
          const showTranslation = msg.translated_message_es && msg.translated_message_es !== msg.message;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-medium text-on-surface">{isMe ? 'You' : msg.sender?.full_name}</span>
                <span className="text-[10px] text-on-surface-variant uppercase">{msg.sender?.role}</span>
                <span className="text-[10px] text-on-surface-variant opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className={`max-w-[85%] rounded-2xl p-3 ${
                msg.is_broadcast 
                  ? 'bg-error/10 border border-error/20 text-on-surface' 
                  : msg.is_transmittal 
                    ? 'bg-secondary/10 border border-secondary/20 text-on-surface'
                    : isMe 
                      ? 'bg-primary text-on-primary rounded-tr-sm' 
                      : 'bg-surface-variant text-on-surface-variant rounded-tl-sm'
              }`}>
                {msg.is_broadcast && <div className="text-[10px] font-bold text-error uppercase mb-1 tracking-wider">Site Broadcast</div>}
                {msg.is_transmittal && <div className="text-[10px] font-bold text-secondary uppercase mb-1 tracking-wider flex items-center gap-1"><FileText className="w-3 h-3"/> Formal Transmittal</div>}
                
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                
                {showTranslation && !msg.is_broadcast && !msg.is_transmittal && (
                  <div className="mt-2 pt-2 border-t border-current/10">
                    <div className="flex items-center gap-1 mb-0.5 opacity-70">
                      <Globe className="w-3 h-3" />
                      <span className="text-[9px] font-medium uppercase tracking-wider">AI Translation (ES)</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed opacity-90">{msg.translated_message_es}</p>
                  </div>
                )}
                
                {msg.audio_url && (
                  <div className="mt-2 pt-2 border-t border-current/10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-current/20 flex items-center justify-center">▶</div>
                    <div className="h-1 w-24 bg-current/30 rounded-full overflow-hidden">
                      <div className="h-full w-1/3 bg-current"></div>
                    </div>
                    <span className="text-[10px] opacity-80">0:04</span>
                  </div>
                )}
                
                {/* Active Acknowledgment Button for Broadcasts/Transmittals */}
                {!isMe && (msg.is_broadcast || msg.is_transmittal) && !msg.reads?.some((r: any) => r.user_id === currentUser.id) && (
                  <div className="mt-3">
                    <button
                      onClick={async () => {
                        // Optimistic UI update
                        setMessages((prev: any) => prev.map((m: any) => 
                          m.id === msg.id 
                            ? { ...m, reads: [...(m.reads || []), { user_id: currentUser.id }] } 
                            : m
                        ));
                        await markMessageRead(msg.id);
                      }}
                      className="w-full py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-surface text-on-surface hover:bg-semantic-emerald hover:text-semantic-emerald-on transition-colors shadow-sm border border-outline-variant/30"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Click to Acknowledge
                    </button>
                  </div>
                )}
              </div>
              
              {isMe && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-on-surface-variant">
                  {msg.reads?.length > 0 ? (
                    <><CheckCircle2 className="w-3 h-3 text-primary" /> Read by {msg.reads.length}</>
                  ) : (
                    <><CheckCircle2 className="w-3 h-3 opacity-50" /> Sent</>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-outline-variant bg-surface">
        <div className="flex items-end gap-2 bg-surface-variant/30 border border-outline-variant rounded-2xl p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all relative">
          {showMentions && projectUsers.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-surface border border-outline-variant rounded-xl shadow-lg overflow-hidden z-10 max-h-48 overflow-y-auto">
              {projectUsers.filter(u => u.full_name.toLowerCase().includes(mentionFilter)).map(u => (
                <div 
                  key={u.id} 
                  className="p-2 hover:bg-surface-variant/50 cursor-pointer flex items-center justify-between"
                  onClick={() => insertMention(u)}
                >
                  <span className="text-sm font-medium text-on-surface">{u.full_name}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase">{u.role}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2 shrink-0 self-end mb-1">
            <button
              onClick={() => { setIsTransmittal(!isTransmittal); if(!isTransmittal) setIsBroadcastCheckbox(false); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center justify-center gap-1 ${isTransmittal ? 'bg-secondary text-on-secondary' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant'}`}
              title="Toggle Formal Transmittal"
            >
              <FileText className="w-4 h-4" /> Transmittal
            </button>
            <button
              onClick={() => { setIsBroadcastCheckbox(!isBroadcastCheckbox); if(!isBroadcastCheckbox) setIsTransmittal(false); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center justify-center gap-1 ${isBroadcastCheckbox ? 'bg-error text-onError' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant'}`}
              title="Toggle Site Broadcast"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> Broadcast
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isTransmittal ? "Write formal transmittal..." : "Type a message or use /broadcast..."}
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 min-h-[44px] p-2 text-sm text-on-surface placeholder:text-on-surface-variant/50"
            rows={1}
          />
          
          <div className="flex items-center gap-1 pb-1">
            <AudioRecorder onRecordingComplete={handleAudioComplete} />
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isSending}
              className="p-2 bg-primary text-on-primary rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
