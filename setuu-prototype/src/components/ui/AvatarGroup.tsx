import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  users: { id: string; name: string; avatarUrl?: string | null }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function AvatarGroup({ users, max = 3, size = "md", className, ...props }: AvatarGroupProps) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = Math.max(0, users.length - max);

  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  }

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visibleUsers.map((user, idx) => (
        <div 
          key={user.id || idx}
          className={cn(
            "relative rounded-full border-2 border-surface-container-lowest bg-primary-container text-on-primary-container flex items-center justify-center font-bold overflow-hidden shadow-sm",
            sizeClasses[size]
          )}
          title={user.name}
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span>{user.name.substring(0, 1).toUpperCase()}</span>
          )}
        </div>
      ))}
      {remainingCount > 0 && (
        <div 
          className={cn(
            "relative rounded-full border-2 border-surface-container-lowest bg-surface-variant text-on-surface-variant flex items-center justify-center font-medium shadow-sm z-10",
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
