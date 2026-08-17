"use client";
import * as React from "react"
import { cn } from "@/lib/utils"
import { WifiOff } from "lucide-react"
import { usePathname } from "next/navigation";

export function OnlineOfflineBanner() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    // Check initial state
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="w-full bg-semantic-amber-bg text-semantic-amber-on px-4 py-2 flex items-center justify-center gap-3 animate-fade-in-up z-50 fixed bottom-0 left-0 right-0 md:relative">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium font-inter">
        You are offline — changes will sync when connection is restored
      </span>
    </div>
  )
}
