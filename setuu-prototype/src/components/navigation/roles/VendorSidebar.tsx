import * as React from "react";
import { Sidebar } from "@/components/navigation/Sidebar";
import {
  LayoutDashboardIcon, FolderTreeIcon, UsersIcon, FileBoxIcon,
  PackageIcon, BuildingIcon, SettingsIcon, TicketIcon, ActivityIcon,
  CheckSquareIcon, AlertTriangleIcon, ShieldCheckIcon, CircleHelpIcon,
  ClockIcon, CalendarIcon, DollarSignIcon, TruckIcon, LockIcon
} from "lucide-react";

export function VendorSidebar({ activePath }: { activePath: string }) {
  return (
    <Sidebar
      activePath={activePath}
      logoText="Vendor Portal"
      logoSubtext="Supply Chain"
      sections={[
        {
          items: [
            { label: "Dispatch Dashboard", href: "/vendor", icon: <TruckIcon className="w-5 h-5" /> },
            { label: "Deliveries", href: "/vendor/deliveries", icon: <PackageIcon className="w-5 h-5" /> },
            { label: "Defects & Rework", href: "/vendor/defects", icon: <AlertTriangleIcon className="w-5 h-5" /> },
            { label: "Invoicing", href: "/vendor/invoices", icon: <DollarSignIcon className="w-5 h-5" /> }
          ]
        }
      ]}
      bottomItems={[]}
    />
  );
}
