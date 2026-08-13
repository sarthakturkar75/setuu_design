"use client";
import * as React from "react";
import { usePathname } from "next/navigation";

export function DashboardShell({
  sidebar,
  topbar,
  children,
}: {
  sidebar: (props: { activePath: string; onClick?: () => void }) => React.ReactNode;
  topbar: (props: { onMenuClick: () => void }) => React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-surface relative">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {sidebar({ activePath: pathname, onClick: () => setIsMobileMenuOpen(false) })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
        {topbar({ onMenuClick: () => setIsMobileMenuOpen(true) })}
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest relative">
          {children}
        </main>
      </div>
    </div>
  );
}
