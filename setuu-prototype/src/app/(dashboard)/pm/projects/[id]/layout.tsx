"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  CheckSquareIcon, 
  PackageIcon, 
  ClockIcon, 
  AlertOctagonIcon, 
  PenToolIcon,
  MessageSquareIcon,
  FileCheckIcon
} from "lucide-react";

import { use } from "react";

export default function ProjectContextLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const pathname = usePathname();
  const resolvedParams = use(params);
  const baseUrl = `/pm/projects/${resolvedParams.id}`;

  const tabs = [
    { name: "Milestones", href: `${baseUrl}/milestones`, icon: <CheckSquareIcon className="w-4 h-4" /> },
    { name: "Timeline", href: `${baseUrl}/timeline`, icon: <ClockIcon className="w-4 h-4" /> },
    { name: "Materials", href: `${baseUrl}/materials`, icon: <PackageIcon className="w-4 h-4" /> },
    { name: "Issues", href: `${baseUrl}/issues`, icon: <AlertOctagonIcon className="w-4 h-4" /> },
    { name: "Drawings", href: `${baseUrl}/drawings`, icon: <PenToolIcon className="w-4 h-4" /> },
    { name: "Collab", href: `${baseUrl}/collaboration`, icon: <MessageSquareIcon className="w-4 h-4" /> },
    { name: "Handover", href: `${baseUrl}/handover`, icon: <FileCheckIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Contextual Tab Bar */}
      <div className="bg-surface-container border-b border-outline-variant px-6 overflow-x-auto shrink-0 z-10 sticky top-0">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link 
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                  isActive 
                    ? "border-primary text-primary" 
                    : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline-variant/50"
                }`}
              >
                {tab.icon}
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Sub-view Content */}
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </div>
  );
}
