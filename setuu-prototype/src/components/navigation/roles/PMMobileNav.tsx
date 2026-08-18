import * as React from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { LayoutDashboardIcon, FolderTreeIcon, CameraIcon, CheckSquareIcon, MoreHorizontalIcon } from "lucide-react";

export function PMMobileNav({ activePath }: { activePath: string }) {
  return (
    <BottomNav 
      activePath={activePath}
      items={[
        { label: "Dashboard", href: "/pm", icon: <LayoutDashboardIcon className="w-6 h-6" /> },
        { label: "Projects", href: "/pm/projects", icon: <FolderTreeIcon className="w-6 h-6" /> },
        { 
          label: "Update", 
          href: "/pm/projects/1/update", 
          icon: <CameraIcon className="w-6 h-6 text-white" />,
        },
        { label: "Tasks", href: "/pm/milestones", icon: <CheckSquareIcon className="w-6 h-6" /> },
        { label: "More", href: "/pm/more", icon: <MoreHorizontalIcon className="w-6 h-6" /> }
      ]}
    />
  );
}
