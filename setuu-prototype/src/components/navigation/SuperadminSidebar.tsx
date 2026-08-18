"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { 
  LayoutDashboard, 
  Server, 
  Building2, 
  CreditCard, 
  Database, 
  Users, 
  ShieldAlert, 
  FileTerminal, 
  ListTree, 
  LifeBuoy, 
  UserPlus, 
  Settings, 
  Activity 
} from "lucide-react";
import { usePathname } from "next/navigation";
import { getPlatformMetrics } from "@/app/actions/platformActions";

export function SuperadminSidebar() {
  const pathname = usePathname();
  const [healthStatus, setHealthStatus] = useState<"healthy" | "warning" | "critical">("healthy");

  useEffect(() => {
    getPlatformMetrics().then(metrics => {
      if (metrics.errorRate5xx > 0.05) setHealthStatus("critical");
      else if (metrics.errorRate5xx > 0.01 || metrics.apiLatencyMs > 200) setHealthStatus("warning");
      else setHealthStatus("healthy");
    }).catch(() => setHealthStatus("critical"));
  }, []);

  const sections = [
    {
      title: "Platform",
      items: [
        { label: "Control Center", href: "/superadmin", icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "Infrastructure", href: "/superadmin/infrastructure", icon: <Server className="w-5 h-5" /> },
        { label: "Organizations", href: "/superadmin/organizations", icon: <Building2 className="w-5 h-5" /> },
        { label: "Subscriptions", href: "/superadmin/subscriptions", icon: <CreditCard className="w-5 h-5" /> },
        { label: "Storage Monitoring", href: "/superadmin/storage", icon: <Database className="w-5 h-5" /> },
        { label: "User Management", href: "/superadmin/users", icon: <Users className="w-5 h-5" /> },
      ],
    },
    {
      title: "Security & Audit",
      items: [
        { 
          label: "Security", 
          href: "/superadmin/security", 
          icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
          isExpandable: true,
          items: [
            { label: "Break-Glass Console", href: "/superadmin/security" },
            { label: "Break-Glass Logs", href: "/superadmin/security/logs" }
          ]
        },
        { label: "Audit Log Explorer", href: "/superadmin/audit", icon: <ListTree className="w-5 h-5" /> },
      ],
    },
    {
      title: "Operations",
      items: [
        { label: "Global Support", href: "/superadmin/support", icon: <LifeBuoy className="w-5 h-5" /> },
        { label: "Invite Org Admin", href: "/superadmin/invite", icon: <UserPlus className="w-5 h-5" /> },
        { label: "Platform Config", href: "/superadmin/platform", icon: <Settings className="w-5 h-5" /> },
      ],
    },
  ];

  const bottomItems = [
    { 
      label: `System Health: ${healthStatus}`, 
      href: "/superadmin/telemetry", 
      icon: <Activity className={`w-5 h-5 ${healthStatus === 'healthy' ? 'text-semantic-emerald' : healthStatus === 'warning' ? 'text-semantic-amber' : 'text-semantic-crimson'}`} /> 
    },
  ];

  return (
    <Sidebar
      logoText="SETUU"
      logoSubtext="Control Center"
      sections={sections}
      activePath={pathname || "/superadmin"}
      bottomItems={bottomItems}
    />
  );
}
