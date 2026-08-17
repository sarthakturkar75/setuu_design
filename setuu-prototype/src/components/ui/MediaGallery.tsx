"use client";
import * as React from "react"
import { cn } from "@/lib/utils"
import { Play, Maximize2 } from "lucide-react"

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  caption?: string;
}

export interface MediaGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: MediaItem[];
}

export function MediaGallery({ items, className, ...props }: MediaGalleryProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2", className)} {...props}>
      {items.map((item) => (
        <div 
          key={item.id} 
          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer bg-surface-container-high border border-outline-variant/30"
        >
          <img 
            src={item.type === "video" ? (item.thumbnail || item.url) : item.url} 
            alt={item.caption || "Media item"} 
            className="w-full h-full object-cover transition-transform duration-slow group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Maximize2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {item.type === "video" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Play className="w-4 h-4 text-white fill-white ml-1" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
