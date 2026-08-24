"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/navigation/LogoutButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { SyncIndicator, SyncStatus } from "@/components/ui/SyncIndicator";
import { Badge } from "@/components/ui/Badge";
import {
	Menu,
	Bell,
	CircleHelp,
	ShieldAlert,
	UserCircle,
	ChevronDownIcon,
	Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useOfflineSync } from "@/contexts/OfflineSyncContext";
import { createClient } from "@/lib/supabase/client";
import {
	getNotifications,
	markAsRead,
} from "@/app/actions/notificationActions";
import { getProjects } from "@/app/actions/projectActions";
import { emergencyLockOrganization } from "@/app/actions/organizationActions";

interface Project {
	id: string;
	name: string;
	[key: string]: any;
}

interface NotificationItem {
	id: string;
	title: string;
	message: string;
	is_read: boolean;
	created_at: string;
}

export interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
	title?: string;
	breadcrumbs?: { label: string; href?: string }[];
	onMenuClick?: () => void;
	onSearch?: (val: string) => void;
	projects?: Project[];
}

export function Topbar({
	title,
	breadcrumbs,
	className,
	onMenuClick,
	onSearch,
	projects: projectsProp,
	...props
}: TopbarProps) {
	const { role, displayName, avatarUrl, user, organizationId } = useAuth();
	const { isOnline, syncQueue } = useOfflineSync();
	const router = useRouter();

	const [projects, setProjects] = React.useState<Project[]>(projectsProp ?? []);
	const [notifications, setNotifications] = React.useState<NotificationItem[]>(
		[],
	);
		const [isLockPending, setIsLockPending] = React.useState(false);
	
	// Use parent-supplied projects if given (avoids double-fetch); self-heal otherwise
	React.useEffect(() => {
		if (projectsProp) {
			setProjects(projectsProp);
			return;
		}
		if (role === "admin" || role === "pm") {
			getProjects()
				.then((data) => setProjects(data || []))
				.catch(console.error);
		}
	}, [projectsProp, role]);

	// Fetch & Subscribe to Notifications
	React.useEffect(() => {
		if (!user?.id) return;
		let cancelled = false;
		const load = () => {
			getNotifications(user.id)
				.then((data) => {
					if (!cancelled) setNotifications(data || []);
				})
				.catch(console.error);
		};
		load();

		const supabase = createClient();
		const channel = supabase
			.channel("realtime:notifications")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${user.id}`,
				},
				(payload) => {
					console.log("Notification change received!", payload);
					load(); // Reload notifications on any change
				},
			)
			.subscribe();

		return () => {
			cancelled = true;
			supabase.removeChannel(channel);
		};
	}, [user?.id]);

	// Close notification dropdown on outside click
	
	const unreadCount = notifications.filter((n) => !n.is_read).length;

	
	const handleSearch = (value: string) => {
		if (onSearch) {
			onSearch(value);
			return;
		}
		if (!value.trim()) return;
		const base =
			role === "admin"
				? "/admin/projects"
				: role === "pm"
					? "/pm/projects"
					: role === "superadmin"
						? "/superadmin/organizations"
						: null;
		if (!base) return;
		router.push(`${base}?q=${encodeURIComponent(value.trim())}`);
	};

	const syncStatus: SyncStatus = !isOnline
		? "offline"
		: syncQueue.some((i) => i.status === "failed")
			? "error"
			: syncQueue.some((i) => i.status === "queued" || i.status === "syncing")
				? "syncing"
				: "synced";

	const handleEmergencyLock = async () => {
		if (!organizationId || !user?.id) return;
		const reason = window.prompt(
			"This will lock write access to your organization. Enter a reason for the audit log:",
		);
		if (!reason) return;
		setIsLockPending(true);
		const result = await emergencyLockOrganization(
			organizationId,
			user.id,
			reason,
		);
		setIsLockPending(false);
		if (!result.success) {
			window.alert(`Failed to lock organization: ${result.error}`);
			return;
		}
		window.alert("Organization locked and recorded in the audit log.");
	};

	const renderActions = () => {
		switch (role) {
			case "superadmin":
				return (
					<Link
						href="/superadmin/security/logs"
						className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error/90 flex items-center gap-2"
					>
						<ShieldAlert className="w-4 h-4" />
						<span className="hidden lg:inline">Emergency Override Log</span>
					</Link>
				);
			case "admin":
				return (
					<>
						<Link
							href="/admin/projects/new"
							className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
						>
							<Plus className="w-4 h-4" />
							New Project
						</Link>
						<button
							onClick={handleEmergencyLock}
							disabled={isLockPending}
							className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-semantic-crimson-bg/10 text-semantic-crimson border border-semantic-crimson-bg/20 hover:bg-semantic-crimson hover:text-white transition-colors text-xs font-bold uppercase tracking-wider disabled:opacity-50"
						>
							<ShieldAlert className="w-4 h-4" />
							<span className="hidden lg:inline">
								{isLockPending ? "Locking..." : "Emergency Lock"}
							</span>
						</button>
					</>
				);
			case "pm":
				return (
					<div className="flex items-center gap-3">
						<div className="relative group">
							<button className="flex items-center gap-2 px-3 py-1.5 bg-surface-variant hover:bg-surface-variant/80 text-on-surface rounded-lg text-sm font-medium transition-colors border border-outline-variant">
								<span>Switch Project</span>
								<ChevronDownIcon className="w-4 h-4 text-on-surface-variant" />
							</button>
							<div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-l2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
								<div className="px-3 py-2 text-xs font-semibold text-outline tracking-wider uppercase">
									Active Projects
								</div>
								{projects.length === 0 && (
									<div className="px-4 py-2 text-sm text-on-surface-variant">
										No active projects
									</div>
								)}
								{projects.map((p) => (
									<Link
										key={p.id}
										href={`/pm/projects/${p.id}`}
										className="block px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors truncate"
									>
										{p.name}
									</Link>
								))}
								<div className="border-t border-outline-variant/30 my-1"></div>
								<Link
									href="/pm/projects"
									className="block px-4 py-2 text-sm text-primary hover:bg-surface-variant transition-colors font-medium"
								>
									View All
								</Link>
							</div>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<header
			className={cn(
				"h-16 border-b border-outline-variant bg-surface-container flex items-center justify-between px-6 sticky top-0 z-10",
				className,
			)}
			{...props}
		>
			<div className="flex items-center space-x-4 flex-1">
				{onMenuClick && (
					<button
						className="p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors"
						onClick={onMenuClick}
					>
						<Menu className="w-5 h-5" />
					</button>
				)}
				{breadcrumbs ? (
					<nav className="flex items-center space-x-2 text-sm font-inter">
						{breadcrumbs.map((crumb, idx) => (
							<React.Fragment key={idx}>
								{idx > 0 && <span className="text-outline">/</span>}
								{crumb.href ? (
									<Link
										href={crumb.href}
										className="text-on-surface-variant hover:text-primary transition-colors"
									>
										{crumb.label}
									</Link>
								) : (
									<span className="text-on-surface font-semibold">
										{crumb.label}
									</span>
								)}
							</React.Fragment>
						))}
					</nav>
				) : (
					<h2 className="font-merriweather text-xl font-bold text-on-surface hidden sm:block">
						{title}
					</h2>
				)}
			</div>

			<div className="flex items-center space-x-4 flex-1 justify-end">
				<div className="hidden md:block w-64">
					<SearchInput
						onSearch={handleSearch}
						placeholder="Search records..."
					/>
				</div>

				<div className="hidden lg:flex items-center pr-4 border-r border-outline-variant/30">
					<SyncIndicator status={syncStatus} />
				</div>

				{role && (
					<Link
						href={`/${role}/support`}
						className="p-2 text-on-surface-variant hover:text-primary transition-colors hidden sm:block"
						title="Help & Support"
					>
						<CircleHelp className="w-5 h-5" />
					</Link>
				)}

				<div className="relative">
					<Link
						href={role ? `/${role}/notifications` : "#"}
						className="p-2 text-on-surface-variant hover:text-primary transition-colors relative block"
					>
						<Bell className="w-5 h-5" />
						{unreadCount > 0 && (
							<Badge
								count={unreadCount}
								className="absolute top-0 right-0 -mt-1 -mr-1"
							/>
						)}
					</Link>
				</div>

				<ThemeToggle />

				<div className="relative group">
					<button className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-variant transition-colors">
						{avatarUrl ? (
							<img
								src={avatarUrl}
								alt={displayName || "User avatar"}
								className="w-8 h-8 rounded-full object-cover"
							/>
						) : (
							<UserCircle className="w-8 h-8 text-outline" />
						)}
					</button>
					<div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-elevation-l2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
						<div className="px-4 py-2 border-b border-outline-variant/30">
							<p className="text-sm font-semibold text-on-surface truncate">
								{displayName || user?.email || "User"}
							</p>
							{role && (
								<p className="text-xs text-on-surface-variant capitalize mt-0.5">
									{role}
								</p>
							)}
						</div>
						{role && (
							<Link
								href={`/${role}/profile`}
								className="block px-4 py-2 text-sm hover:bg-surface-variant"
							>
								Profile
							</Link>
						)}
						<div className="px-2 pb-1">
							<LogoutButton />
						</div>
					</div>
				</div>

				<div className="flex items-center space-x-3 border-l border-outline-variant/30 pl-4 ml-2">
					{renderActions()}
				</div>
			</div>
		</header>
	);
}
