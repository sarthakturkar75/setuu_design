"use client";
import { DashboardShell } from "@/components/navigation/DashboardShell";
import { PMSidebar } from "@/components/navigation/roles/PMSidebar";
import { PMTopbar } from "@/components/navigation/roles/PMTopbar";
import { PMMobileNav } from "@/components/navigation/roles/PMMobileNav";
import { PMProvider } from "@/contexts/PMContext";
import { OfflineSyncProvider } from "@/contexts/OfflineSyncContext";
import { usePathname } from "next/navigation";

export default function PMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <OfflineSyncProvider>
      <PMProvider>
        <DashboardShell
          sidebar={() => <PMSidebar activePath={pathname} />}
          topbar={() => <PMTopbar />}
          bottomNav={() => <PMMobileNav activePath={pathname} />}
        >
          {children}
        </DashboardShell>
      </PMProvider>
    </OfflineSyncProvider>
  );
}
