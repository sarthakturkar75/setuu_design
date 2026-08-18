"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MessageSquareIcon, SendIcon, PaperclipIcon } from "lucide-react";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ProjectCollaborationPage() {
    const params = useParams();
    const projectId = params?.id as string;
    const supabase = createClient();

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadMessages() {
            // 1. Get Current User
            const { data: { user } } = await supabase.auth.getUser();
            if (user && isMounted) {
                const { data: actor } = await supabase.from('user_actor').select('*').eq('id', user.id).single();
                setCurrentUser(actor || { display_name: "Unknown", role: "admin" });
            }

            // 2. Fetch all comments for updates linked to this project
            const { data: updates } = await supabase
                .from('updates')
                .select('id')
                .eq('project_id', projectId);

            if (updates && updates.length > 0) {
                const updateIds = updates.map(u => u.id);
                const { data: comments } = await supabase
                    .from('comments')
                    .select('*, author:user_actor(display_name, role)')
                    .in('update_id', updateIds)
                    .order('created_at', { ascending: true });

                if (comments && isMounted) {
                    setMessages(comments.map(c => ({
                        id: c.id,
                        user: c.author?.display_name || 'Unknown',
                        role: c.author?.role || 'User',
                        text: c.content,
                        time: new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isMe: c.author_id === user?.id
                    })));
                }
            }
            if (isMounted) setLoading(false);
        }

        loadMessages();

        // 3. Optional: Set up realtime subscription here
        const channel = supabase.channel('public:comments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments' }, payload => {
                // Simplistic append (in reality, check if it belongs to this project)
                loadMessages();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, [projectId, supabase]);

    const handleSend = async () => {
        if (!input.trim() || !currentUser) return;

        const text = input;
        setInput("");

        // Find or create a master "collaboration" update for this project to attach comments to
        let { data: updates } = await supabase
            .from('updates')
            .select('id')
            .eq('project_id', projectId)
            .limit(1);

        let targetUpdateId = updates?.[0]?.id;

        // If no updates exist for this project, create a dummy one just to hold the thread
        if (!targetUpdateId) {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: newUpdate } = await supabase.from('updates').insert({
                project_id: projectId,
                author_id: user?.id,
                caption: "General Discussion",
                approval_status: "Approved"
            }).select().single();
            targetUpdateId = newUpdate?.id;
        }

        if (targetUpdateId) {
            const { data: { user } } = await supabase.auth.getUser();
            await supabase.from('comments').insert({
                update_id: targetUpdateId,
                author_id: user?.id,
                content: text
            });
            // Realtime subscription will fetch the new message
        }
    };

    return (
        <div className="p-0 md:p-6 h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] flex flex-col max-w-300 mx-auto">
            <div className="p-4 md:p-0 flex justify-between items-center mb-4 shrink-0 bg-surface md:bg-transparent border-b md:border-b-0 border-outline-variant">
                <div>
                    <h2 className="text-xl font-bold font-merriweather text-on-surface">Team Collaboration</h2>
                    <p className="text-sm text-on-surface-variant">General Project Channel</p>
                </div>
                <AvatarGroup
                    users={[
                        { id: "1", name: "Michael" },
                        { id: "2", name: "Jane" },
                        { id: "3", name: "Sarah" }
                    ]}
                />
            </div>

            <div className="flex-1 bg-surface-container md:rounded-xl md:border border-outline-variant overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-on-surface-variant">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-on-surface-variant">No messages yet. Start the conversation!</div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                                <div className="w-10 h-10 shrink-0 rounded-full bg-surface-variant flex items-center justify-center font-bold text-sm text-on-surface-variant">
                                    {msg.user.charAt(0)}
                                </div>
                                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-sm text-on-surface">{msg.user}</span>
                                        <span className="text-xs text-on-surface-variant">{msg.time}</span>
                                    </div>
                                    <div className={`p-3 rounded-2xl max-w-[85%] md:max-w-md ${msg.isMe ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface border border-outline-variant text-on-surface rounded-tl-sm'}`}>
                                        {msg.text.split(' ').map((word: string, i: number) =>
                                            word.startsWith('@') ? <span key={i} className="font-bold text-semantic-emerald">{word} </span> : word + ' '
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 bg-surface border-t border-outline-variant flex items-end gap-3">
                    <button className="p-3 text-on-surface-variant hover:text-primary transition-colors">
                        <PaperclipIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <TextInput
                            placeholder="Type a message... Use @ to tag team members."
                            className="rounded-full"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSend();
                            }}
                        />
                    </div>
                    <Button variant="primary" className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0" onClick={handleSend} disabled={loading || !input.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
