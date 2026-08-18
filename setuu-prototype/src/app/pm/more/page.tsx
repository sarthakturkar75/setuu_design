"use client";
import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ShieldCheckIcon, BookOpenIcon, FileTextIcon, HelpCircleIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";

export default function PMMoreMenu() {
  const links = [
    { label: "Handovers & Meetings", href: "/pm/handovers", icon: ShieldCheckIcon },
    { label: "Lessons Learned", href: "/pm/lessons", icon: BookOpenIcon },
    { label: "Reporting", href: "/pm/reports", icon: FileTextIcon },
    { label: "Support Tickets", href: "/pm/support", icon: HelpCircleIcon },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto pb-24">
      <PageHeader title="More Options" />
      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <Link key={i} href={link.href} className="flex items-center gap-4 p-4 border-b border-outline-variant/50 hover:bg-surface-variant transition-colors">
              <Icon className="w-5 h-5 text-on-surface-variant" />
              <span className="font-medium text-on-surface flex-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
         <button className="w-full flex items-center gap-4 p-4 border-b border-outline-variant/50 hover:bg-surface-variant transition-colors">
            <SettingsIcon className="w-5 h-5 text-on-surface-variant" />
            <span className="font-medium text-on-surface flex-1 text-left">Settings</span>
         </button>
         <button className="w-full flex items-center gap-4 p-4 hover:bg-surface-variant transition-colors">
            <LogOutIcon className="w-5 h-5 text-semantic-crimson" />
            <span className="font-medium text-semantic-crimson flex-1 text-left">Log Out</span>
         </button>
      </div>
    </div>
  );
}
