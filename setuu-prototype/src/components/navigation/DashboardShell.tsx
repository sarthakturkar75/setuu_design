"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getNavigationForRole } from "@/lib/config/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { getProjects, getProjectFlags } from "@/app/actions/projectActions";
import { getPlatformMetrics } from "@/app/actions/platformActions";
import Link from "next/link";
import { Menu } from "lucide-react"; // Fallback for mobile menu

export function DashboardShell({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const { role, isLoading } = useAuth();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
	const [isDesktopCollapsed, setIsDesktopCollapsed] = React.useState(false);

	const [projects, setProjects] = React.useState<any[]>([]);
	const [projectFlags, setProjectFlags] = React.useState<any>(null);
	const [healthStatus, setHealthStatus] = React.useState<
		"healthy" | "warning" | "critical"
	>("healthy");

	React.useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	React.useEffect(() => {
		if (!role) return;
		if (role === "admin" || role === "pm") {
			getProjects()
				.then((data) => setProjects(data || []))
				.catch(console.error);
		}
		if (role === "superadmin") {
			getPlatformMetrics()
				.then((metrics) => {
					if (metrics.errorRate5xx > 0.05) setHealthStatus("critical");
					else if (metrics.errorRate5xx > 0.01 || metrics.apiLatencyMs > 200)
						setHealthStatus("warning");
					else setHealthStatus("healthy");
				})
				.catch(() => setHealthStatus("critical"));
		}
	}, [role]);

	const uuidRegex = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
	const match = pathname.match(uuidRegex);
	const currentProjectId = match ? match[0] : null;

	React.useEffect(() => {
		if (currentProjectId) {
			getProjectFlags(currentProjectId).then(flags => setProjectFlags(flags));
		} else {
			setProjectFlags(null);
		}
	}, [currentProjectId]);

	const { sections } = React.useMemo(() => {
		return getNavigationForRole(role, currentProjectId, {
			projects,
			healthStatus,
            flags: projectFlags
		});
	}, [role, currentProjectId, projects, healthStatus, projectFlags]);

	// Extract exactly 4 items for the mobile bottom nav
	const mobileNavItems = sections
		.flatMap((s) => s.items)
		.filter((i) => !i.items)
		.slice(0, 4);

	if (isLoading) return null;

	return (
		<div className="flex h-screen overflow-hidden bg-surface relative">
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-45 md:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Dynamic Sidebar */}
			<div
				className={`
                fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out md:relative overflow-hidden
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                ${isDesktopCollapsed ? "md:w-0 md:opacity-0" : "md:w-rail lg:w-sidebar md:translate-x-0 md:opacity-100"}
                `}
			>
				<Sidebar sections={sections} activePath={pathname} />
			</div>

			<div className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden pb-16 md:pb-0">
				{/* Dynamic Topbar */}
				<Topbar
					title="Setuu Workspace"
					onMenuClick={() => {
						if (window.innerWidth >= 768) {
							setIsDesktopCollapsed(!isDesktopCollapsed);
						} else {
							setIsMobileMenuOpen(true);
						}
					}}
					projects={projects}
				/>

				<main className="flex-1 overflow-y-auto bg-surface-container-lowest relative p-margin-mobile md:p-margin-tablet lg:p-margin-desktop">
					<div className="max-w-content mx-auto h-full">{children}</div>
				</main>
			</div>

			{/* Dynamic Mobile Bottom Nav */}
			{mobileNavItems.length > 0 && (
				<div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/30 flex justify-around items-center px-2 py-2 pb-safe z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] glass">
					{mobileNavItems.map((item) => {
						const isActive =
							pathname === item.href || pathname.startsWith(`${item.href}/`);
						return (
							<Link
								key={item.href}
								href={item.href || "#"}
								className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-16 transition-colors ${isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
							>
								{item.icon}
								<span className="text-[10px] font-medium mt-1">
									{item.label}
								</span>
							</Link>
						);
					})}
					<button
						onClick={() => setIsMobileMenuOpen(true)}
						className="flex flex-col items-center justify-center p-2 rounded-lg min-w-16 text-on-surface-variant hover:text-on-surface transition-colors"
					>
						<Menu className="w-5 h-5" />
						<span className="text-[10px] font-medium mt-1">Menu</span>
					</button>
				</div>
			)}
		</div>
	);
}
