"use client";
import React from "react";
import { MessageSquareIcon, SendIcon, PaperclipIcon } from "lucide-react";
import { AvatarGroup } from "@/components/ui/AvatarGroup";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";

export default function ProjectCollaborationPage() {
    const messages = [
        { id: "1", user: "Michael Chen", role: "Project Manager", text: "Has anyone verified the rebar delivery for Block B?", time: "10:30 AM", isMe: true },
        { id: "2", user: "Jane Doe", role: "Inventory", text: "@Michael Yes, it arrived this morning. I've logged the receipt in the materials tab.", time: "10:45 AM", isMe: false },
        { id: "3", user: "Sarah Jenkins", role: "Lead Engineer", text: "Great. Let's schedule the pour for tomorrow 8 AM.", time: "11:00 AM", isMe: false }
    ];

    return (
        <div className="p-0 md:p-6 h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] flex flex-col max-w-[1200px] mx-auto">

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

                {/* Chat Log */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                    {messages.map(msg => (
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
                                    {msg.text.split(' ').map((word, i) =>
                                        word.startsWith('@') ? <span key={i} className="font-bold text-semantic-emerald">{word} </span> : word + ' '
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-surface border-t border-outline-variant flex items-end gap-3">
                    <button className="p-3 text-on-surface-variant hover:text-primary transition-colors">
                        <PaperclipIcon className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <TextInput placeholder="Type a message... Use @ to tag team members." className="rounded-full" />
                    </div>
                    <Button variant="primary" className="rounded-full w-12 h-12 p-0 flex items-center justify-center shrink-0">
                        <SendIcon className="w-5 h-5" />
                    </Button>
                </div>

            </div>
        </div>
    );
}
