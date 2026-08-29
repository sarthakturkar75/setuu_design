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
CheckCircle2, Clock, TrendingUp, Bell } from "lucide-react";
import React from "react";
import { NavSection, NavItem } from "@/components/navigation/Sidebar";

export const getNavigationForRole = (
    role: string | null,
    projectId: string | null,
    dynamicData?: {
        projects?: any[];
        flags?: any;
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
    const flags = dynamicData?.flags || { project_resources: true, change_requests: true, project_materials: true, project_issues: true, drawing_versions: true, timeline: true, milestones: true, collaboration: true, handover: true };
    const cn = flags.custom_names || {};
    const projectOpsSection: NavSection = {
        title: "Project Operations",
        items: projectId
            ? [
                {
                    label: "Dashboard",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}`,
                    icon: <LayoutDashboardIcon className="w-5 h-5" />,
                },
                ...(flags.milestones !== false ? [{
                    label: cn.milestones || "Milestones",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/milestones`,
                    icon: <CheckSquareIcon className="w-5 h-5" />,
                }] : []),
                ...(flags.project_materials !== false ? [{
                    label: cn.project_materials || "Materials",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/materials`,
                    icon: <PackageIcon className="w-5 h-5" />,
                }] : []),
                ...(flags.drawing_versions !== false ? [{
                    label: cn.drawing_versions || "Drawings",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/drawings`,
                    icon: <FileBoxIcon className="w-5 h-5" />,
                }] : []),
                ...(flags.project_issues !== false ? [{
                    label: cn.project_issues || "Issues",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/issues`,
                    icon: <AlertTriangleIcon className="w-5 h-5" />,
                }] : []),
                ...(flags.project_resources !== false ? [{
                    label: cn.project_resources || "Resources",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/resources`,
                    icon: <UsersIcon className="w-5 h-5" />,
                }] : []),
                ...(flags.collaboration !== false ? [{
                    label: cn.collaboration || "Collaboration",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/collaboration`,
                    icon: <MessageSquareIcon className="w-5 h-5" />,
                }] : []),
                ...(flags.timeline !== false ? [{
                    label: cn.timeline || "Timeline",
                    href: `/${role === "admin" ? "admin" : "pm"}/projects/${projectId}/timeline`,
                    icon: <CalendarIcon className="w-5 h-5" />,
                }] : []),
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
                                label: "Global Resources",
                                href: `/${role}/resources`,
                                icon: <UsersIcon className="w-5 h-5" />,
                            },
                            {
                                label: "Global Personnel",
                                href: `/${role}/personnel`,
                                icon: <UsersIcon className="w-5 h-5" />,
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


        
                case "engineer":
            return {
                sections: [
                    {
                        title: "Primary",
                        items: [
                            { label: "My Workbench", href: "/engineer", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
                            { label: "Assigned Tasks", href: "/engineer/tasks", icon: <CheckSquareIcon className="w-5 h-5" /> },
                            { label: "Peer Reviews", href: "/engineer/reviews", icon: <FileTextIcon className="w-5 h-5" /> },
                            { label: "Issue Tracker", href: "/engineer/issues", icon: <AlertTriangleIcon className="w-5 h-5" /> },
                            { label: "Timesheets", href: "/engineer/timesheet", icon: <CalendarIcon className="w-5 h-5" /> },
                            { label: "Collaboration", href: "/engineer/collaboration", icon: <MessageSquareIcon className="w-5 h-5" /> },
                            { label: "Team Docs & Wiki", href: "/engineer/docs", icon: <BookOpenIcon className="w-5 h-5" /> },
                            { label: "Assets & Inventory", href: "/engineer/assets", icon: <PackageIcon className="w-5 h-5" /> },
                            { label: "System Logs", href: "/engineer/logs", icon: <FileTextIcon className="w-5 h-5" /> },
                            { label: "Offline Sync", href: "/engineer/sync", icon: <WifiOffIcon className="w-5 h-5" /> },
                        ],
                    },
                    ...(projectId ? [{
                        title: "Project Operations",
                        items: [
                            { label: "Project Dashboard", href: `/engineer/projects/${projectId}`, icon: <LayoutDashboardIcon className="w-5 h-5" /> },
                            { label: "Timeline", href: `/engineer/projects/${projectId}/timeline`, icon: <CalendarIcon className="w-5 h-5" /> },
                            { label: "Requirements", href: `/engineer/projects/${projectId}/requirements`, icon: <FileTextIcon className="w-5 h-5" /> },
                            ...(dynamicData?.flags?.drawing_versions !== false ? [{ label: "Drawings", href: `/engineer/projects/${projectId}/drawings`, icon: <FileBoxIcon className="w-5 h-5" /> }] : []),
                            { label: "Materials", href: `/engineer/projects/${projectId}/materials`, icon: <PackageIcon className="w-5 h-5" /> },
                            { label: "Issues", href: `/engineer/projects/${projectId}/issues`, icon: <AlertTriangleIcon className="w-5 h-5" /> },
                            { label: "Team", href: `/engineer/projects/${projectId}/team`, icon: <UsersIcon className="w-5 h-5" /> },
                        ]
                    }] : [])
                ],
                bottomItems: [
                    { label: "Productivity", href: "/engineer/productivity", icon: <Activity className="w-5 h-5" /> },
                    { label: "Settings", href: "/engineer/settings", icon: <SettingsIcon className="w-5 h-5" /> },
                    { label: "Notifications", href: "/engineer/notifications", icon: <Bell className="w-5 h-5" /> }
                ]
            };

                case "vendor":
            return {
                sections: [
                    {
                        title: "Dispatch & Ops",
                        items: [
                            { label: "Dispatch Dashboard", href: "/vendor", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
                            { label: "Material Deliveries", href: "/vendor/deliveries", icon: <PackageIcon className="w-5 h-5" /> },
                            { label: "Purchase Orders", href: "/vendor/orders", icon: <FileTextIcon className="w-5 h-5" /> },
                            { label: "Assigned Tasks", href: "/vendor/tasks", icon: <CheckSquareIcon className="w-5 h-5" /> },
                            { label: "Active Projects", href: "/vendor/projects", icon: <FolderTreeIcon className="w-5 h-5" /> },
                        ],
                    },
                    {
                        title: "Quality & Billing",
                        items: [
                            { label: "Defects & Rework", href: "/vendor/defects", icon: <AlertTriangleIcon className="w-5 h-5" /> },
                            { label: "QA Checklists", href: "/vendor/qa", icon: <ShieldCheckIcon className="w-5 h-5" /> },
                            { label: "Invoicing", href: "/vendor/invoices", icon: <CreditCard className="w-5 h-5" /> },
                            { label: "Timesheets", href: "/vendor/timesheet", icon: <CalendarIcon className="w-5 h-5" /> },
                            { label: "Collaboration", href: "/vendor/collaboration", icon: <MessageSquareIcon className="w-5 h-5" /> },
                        ],
                    }
                ],
                bottomItems: [
                    { label: "Vendor Scorecard", href: "/vendor/scorecard", icon: <Activity className="w-5 h-5" /> },
                    { label: "Support", href: "/vendor/support", icon: <CircleHelpIcon className="w-5 h-5" /> },
                    { label: "Notifications", href: "/vendor/notifications", icon: <Bell className="w-5 h-5" /> }
                ]
            };

                case "client":
            return {
                sections: [
                    {
                        title: "Portfolio",
                        items: [
                            { label: "Executive Summary", href: "/client", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
                            { label: "Project Portfolio", href: "/client/projects", icon: <FolderTreeIcon className="w-5 h-5" /> },
                        ],
                    },
                    {
                        title: "Tracking & Control",
                        items: [
                            { label: "Progress Feed", href: "/client/progress", icon: <Activity className="w-5 h-5" /> },
                            { label: "Deliverables", href: "/client/deliverables", icon: <PackageIcon className="w-5 h-5" /> },
                            { label: "Drawings", href: "/client/drawings", icon: <FileBoxIcon className="w-5 h-5" /> },
                            { label: "Financials & CRs", href: "/client/financials", icon: <CreditCard className="w-5 h-5" /> },
                            { label: "Approvals", href: "/client/approvals", icon: <CheckSquareIcon className="w-5 h-5" /> },
                            { label: "Issues", href: "/client/issues", icon: <AlertTriangleIcon className="w-5 h-5" /> },
                        ],
                    },
                    {
                        title: "Engagement",
                        items: [
                            { label: "Meetings", href: "/client/meetings", icon: <CalendarIcon className="w-5 h-5" /> },
                            { label: "Handovers", href: "/client/handovers", icon: <ShieldCheckIcon className="w-5 h-5" /> },
                            { label: "Reports", href: "/client/reports", icon: <FileTextIcon className="w-5 h-5" /> },
                        ]
                    }
                ],
                bottomItems: [
                    { label: "Support", href: "/client/support", icon: <CircleHelpIcon className="w-5 h-5" /> },
                    { label: "Notifications", href: "/client/notifications", icon: <Bell className="w-5 h-5" /> }
                ]
            };
default:
            return { sections: [], bottomItems: [] };
    }
};
