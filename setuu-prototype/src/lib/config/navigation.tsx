import {
    LayoutDashboardIcon,
    FolderTreeIcon,
    FileBoxIcon,
    PackageIcon,
    AlertTriangleIcon,
    CheckSquareIcon,
    UsersIcon,
    ShieldCheckIcon,
    SettingsIcon,
    FileTextIcon,
    CircleHelpIcon,
    Server,
    Building2,
    CreditCard,
    Database,
    ShieldAlert,
    ListTree,
    LifeBuoy,
    UserPlus,
    Activity,
    MessageSquareIcon,
    WifiOffIcon,
    BookOpenIcon,
    CalendarIcon,
} from "lucide-react";
import React from "react";
import { NavSection, NavItem } from "@/components/navigation/Sidebar";

export const getNavigationForRole = (
    role: string | null,
    projectId: string | null,
    dynamicData?: {
        projects?: any[];
        healthStatus?: "healthy" | "warning" | "critical";
    },
): { sections: NavSection[]; bottomItems: NavItem[] } => {
    if (!role) return { sections: [], bottomItems: [] };

    // Generate dynamic project list for the PM/Admin nested dropdown
    const projectItems = [
        {
            label: "Tracking Hub",
            href: `/${role === "admin" ? "admin" : "pm"}/projects`,
        },
        ...(dynamicData?.projects?.map((p) => ({
            label: p.name,
            href: `/${role === "admin" ? "admin" : "pm"}/projects/${p.id}`,
        })) || [{ label: "Loading projects...", href: "#" }])
    ];

    // Shared Project Operations
    const projectOpsSection: NavSection = {
        title: "Project Operations",
        items: projectId
            ? [
                {
                    label: "Dashboard",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}`,
                    icon: <LayoutDashboardIcon className="w-5 h-5" />,
                },
                {
                    label: "Milestones",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/milestones`,
                    icon: <CheckSquareIcon className="w-5 h-5" />,
                },
                {
                    label: "Materials",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/materials`,
                    icon: <PackageIcon className="w-5 h-5" />,
                },
                {
                    label: "Drawings",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/drawings`,
                    icon: <FileBoxIcon className="w-5 h-5" />,
                },
                {
                    label: "Issues",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/issues`,
                    icon: <AlertTriangleIcon className="w-5 h-5" />,
                },
                {
                    label: "Collaboration",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/collaboration`,
                    icon: <MessageSquareIcon className="w-5 h-5" />,
                },
            ]
            : [],
    };

    switch (role) {
        case "superadmin":
            return {
                sections: [
                    {
                        title: "Platform",
                        items: [
                            {
                                label: "Control Center",
                                href: "/superadmin",
                                icon: <LayoutDashboardIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Infrastructure",
                                href: "/superadmin/infrastructure",
                                icon: <Server className="w-5 h-5" />,
                            },
                            {
                                label: "Organizations",
                                href: "/superadmin/organizations",
                                icon: <Building2 className="w-5 h-5" />,
                            },
                            {
                                label: "Subscriptions",
                                href: "/superadmin/subscriptions",
                                icon: <CreditCard className="w-5 h-5" />,
                            },
                            {
                                label: "Storage Monitoring",
                                href: "/superadmin/storage",
                                icon: <Database className="w-5 h-5" />,
                            },
                            {
                                label: "User Management",
                                href: "/superadmin/users",
                                icon: <UsersIcon className="w-5 h-5" />,
                            },
                        ],
                    },
                    {
                        title: "Security & Audit",
                        items: [
                            {
                                label: "Security",
                                href: "/superadmin/security",
                                icon: <ShieldAlert className="w-5 h-5 text-red-400" />,
                                items: [
                                    {
                                        label: "Break-Glass Console",
                                        href: "/superadmin/security",
                                    },
                                    {
                                        label: "Break-Glass Logs",
                                        href: "/superadmin/security/logs",
                                    },
                                ],
                            },
                            {
                                label: "Audit Log Explorer",
                                href: "/superadmin/audit",
                                icon: <ListTree className="w-5 h-5" />,
                            },
                        ],
                    },
                    {
                        title: "Operations",
                        items: [
                            {
                                label: "Global Support",
                                href: "/superadmin/support",
                                icon: <LifeBuoy className="w-5 h-5" />,
                            },
                            {
                                label: "Invite Org Admin",
                                href: "/superadmin/invite",
                                icon: <UserPlus className="w-5 h-5" />,
                            },
                            {
                                label: "Platform Config",
                                href: "/superadmin/platform",
                                icon: <SettingsIcon className="w-5 h-5" />,
                            },
                        ],
                    },
                ],
                bottomItems: [
                    {
                        label: `System Health: ${dynamicData?.healthStatus || "healthy"}`,
                        href: "/superadmin/telemetry",
                        icon: (
                            <Activity
                                className={`w-5 h-5 ${dynamicData?.healthStatus === "healthy" ? "text-semantic-emerald" : dynamicData?.healthStatus === "warning" ? "text-semantic-amber" : "text-semantic-crimson"}`}
                            />
                        ),
                    },
                ],
            };

        case "pm":
        case "admin":
            return {
                sections: [
                    {
                        title: role === "admin" ? "Portfolio" : "Overview",
                        items: [
                            {
                                label: "Command Center",
                                href: `/${role}`,
                                icon: <LayoutDashboardIcon className="w-5 h-5" />,
                            },
                        ],
                    },
                    {
                        title: "Operations",
                        items: [
                            {
                                label: "Active Projects",
                                href: `/${role}/projects`,
                                icon: <FolderTreeIcon className="w-5 h-5" />,
                                items: projectItems, // Dynamic Dropdown!
                            },
                            {
                                label: "Global Materials",
                                href: `/${role}/materials`,
                                icon: <PackageIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Change Requests",
                                href: `/${role}/changes`,
                                icon: <FileTextIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Offline Sync Queue",
                                href: `/${role}/sync`,
                                icon: <WifiOffIcon className="w-5 h-5" />,
                                badge: (
                                    <span className="bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                                        2
                                    </span>
                                ),
                            },
                        ],
                    },
                    ...(projectId ? [projectOpsSection] : []),
                    {
                        title: "Client & Admin",
                        items: [
                            {
                                label: "Handovers & Meetings",
                                href: `/${role}/handovers`,
                                icon: <ShieldCheckIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Lessons Learned",
                                href: `/${role}/lessons`,
                                icon: <BookOpenIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Reporting",
                                href: `/${role}/reports`,
                                icon: <FileTextIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Financials",
                                href: `/${role}/financials`,
                                icon: <CreditCard className="w-5 h-5" />,
                            },
                            {
                                label: "Support Tickets",
                                href: `/${role}/support`,
                                icon: <CircleHelpIcon className="w-5 h-5" />,
                            },
                            ...(role === "admin" ? [{
                                label: "Settings",
                                href: "/admin/settings",
                                icon: <SettingsIcon className="w-5 h-5" />,
                            }] : [])
                        ],
                    },
                ],
                bottomItems: [
                    {
                        label: "View Calendar",
                        href: `/${role}/calendar`,
                        icon: <CalendarIcon className="w-5 h-5" />,
                    },
                ],
            };

        default:
            return { sections: [], bottomItems: [] };
    }
};
