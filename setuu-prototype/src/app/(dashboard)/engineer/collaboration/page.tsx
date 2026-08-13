"use client";

import * as React from "react";
import { useState } from "react";
import { MessageSquare, Paperclip, Send, Terminal, Image as ImageIcon, PlusCircle } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

const activeThreads = [
  { id: "THR-102", title: "Thermal Limit Adjustments", participants: ["RS", "JS"], unread: 3 },
  { id: "THR-098", title: "CAN Bus EMI Shielding", participants: ["AR", "RS"], unread: 0 },
  { id: "THR-105", title: "Firmware Flash Procedure", participants: ["JS"], unread: 1 }
];

const mockMessages = [
  { 
    id: 1, 
    author: "Robert Chen", 
    initials: "RC", 
    time: "Today, 09:15 AM", 
    text: "I ran the thermal simulation on the updated enclosure. We are hitting 65°C under sustained load, which violates the spec. ",
    mentions: ["@Jane Smith"],
    attachment: null
  },
  { 
    id: 2, 
    author: "Jane Smith", 
    initials: "JS", 
    time: "Today, 10:02 AM", 
    text: "Can we increase the fan duty cycle in the firmware?",
    mentions: [],
    attachment: { type: "code", name: "pwm_config.c", size: "2 KB" }
  },
  { 
    id: 3, 
    author: "Ali Rahman", 
    initials: "AR", 
    time: "Today, 10:45 AM", 
    text: "I looked at the schematic. If we increase the fan speed, we might introduce EMI on the analog sensor lines.",
    mentions: ["@Robert Chen"],
    attachment: { type: "image", name: "emi_trace.png", size: "1.4 MB" }
  }
];

export default function CollaborationPage() {
  const [activeThread, setActiveThread] = useState(activeThreads[0].id);

  const renderTextWithMentions = (text: string, mentions: string[]) => {
    let result: React.ReactNode[] = [text];
    
    mentions.forEach(mention => {
      const newResult: React.ReactNode[] = [];
      result.forEach(segment => {
        if (typeof segment === "string") {
          const parts = segment.split(mention);
          parts.forEach((part, idx) => {
            newResult.push(part);
            if (idx < parts.length - 1) {
              newResult.push(
                <span key={`${mention}-${idx}`} className="bg-semantic-sky/15 text-semantic-sky font-semibold px-1 rounded mx-0.5">
                  {mention}
                </span>
              );
            }
          });
        } else {
          newResult.push(segment);
        }
      });
      result = newResult;
    });
    
    return result;
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-surface overflow-hidden">
      
      {/* Left: Thread List */}
      <div className="w-80 border-r border-outline-variant bg-surface-container-lowest flex flex-col">
        <div className="p-4 border-b border-outline-variant/50 flex justify-between items-center bg-surface">
          <h2 className="font-merriweather font-bold text-lg text-on-surface flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Discussions
          </h2>
          <button className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeThreads.map(thread => (
            <div 
              key={thread.id} 
              onClick={() => setActiveThread(thread.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                activeThread === thread.id 
                  ? 'bg-primary/5 border-primary/30 shadow-sm' 
                  : 'bg-surface border-outline-variant hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-jetbrains-mono text-xs font-semibold text-on-surface-variant">
                  {thread.id}
                </span>
                {thread.unread > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {thread.unread}
                  </span>
                )}
              </div>
              <h3 className="font-inter font-bold text-sm text-on-surface truncate">
                {thread.title}
              </h3>
              <div className="flex mt-2 -space-x-1">
                {thread.participants.map((p, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[8px] font-bold text-on-surface">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Slide-Out Thread Panel (Level 3 emulation) */}
      <div className="flex-1 bg-surface-container relative shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] flex flex-col z-10">
        {/* Thread Header */}
        <div className="p-6 bg-surface border-b border-outline-variant shadow-sm z-20">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-jetbrains-mono text-sm font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
              {activeThreads.find(t => t.id === activeThread)?.id}
            </span>
          </div>
          <h1 className="font-merriweather text-2xl font-bold text-on-surface">
            {activeThreads.find(t => t.id === activeThread)?.title}
          </h1>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mockMessages.map(msg => (
            <div key={msg.id} className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                {msg.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-bold text-sm text-on-surface">{msg.author}</span>
                  <span className="text-xs font-inter text-on-surface-variant">{msg.time}</span>
                </div>
                <div className="bg-surface border border-outline-variant p-4 rounded-b-xl rounded-tr-xl shadow-sm text-sm text-on-surface font-inter leading-relaxed max-w-2xl">
                  {renderTextWithMentions(msg.text, msg.mentions)}
                  {msg.mentions.map(m => m.replace("@", "")).includes("Jane Smith") && msg.id === 1 && (
                    <span className="bg-semantic-sky/15 text-semantic-sky font-semibold px-1 rounded mx-0.5">@Jane Smith</span>
                  )}
                  
                  {/* Attachment Block */}
                  {msg.attachment && (
                    <div className="mt-4 flex items-center bg-surface-container rounded-lg p-2 border border-outline-variant">
                      <div className="p-2 bg-surface rounded">
                        {msg.attachment.type === 'code' ? <Terminal className="w-4 h-4 text-primary" /> : <ImageIcon className="w-4 h-4 text-semantic-emerald" />}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-xs font-bold font-jetbrains-mono text-on-surface">{msg.attachment.name}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase">{msg.attachment.size}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Composer */}
        <div className="p-4 bg-surface border-t border-outline-variant">
          <div className="flex items-end bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
            <div className="p-2 flex space-x-1 border-r border-outline-variant bg-surface-container">
              <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface rounded transition-colors tooltip-trigger" title="Attach Terminal Log">
                <Terminal className="w-5 h-5" />
              </button>
              <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface rounded transition-colors" title="Attach Oscilloscope/CAD Image">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <textarea 
              className="flex-1 max-h-32 min-h-[56px] p-3 text-sm font-inter text-on-surface bg-transparent focus:outline-none resize-none"
              placeholder="Type a message... Use @ to mention peers."
              rows={1}
            />
            <div className="p-2">
              <button className="p-2 bg-primary text-white hover:bg-primary/90 rounded-lg shadow-sm transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
