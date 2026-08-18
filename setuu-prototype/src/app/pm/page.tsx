import * as React from "react";
import { KPICard } from "@/components/ui/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
	FileBoxIcon,
	AlertTriangleIcon,
	CheckSquareIcon,
	ArrowRightIcon,
	CameraIcon,
	MessageSquareIcon,
} from "lucide-react";
import Link from "next/link";

export default function PMCommandCenter() {
	const activeProjects = [
		{
			id: 1,
			name: "Alpha Tower Build",
			client: "Apex Holdings",
			status: "In Progress",
			progress: 68,
			overdue: 2,
		},
		{
			id: 2,
			name: "Sector 7 Pipeline",
			client: "City Works",
			status: "At Risk",
			progress: 42,
			overdue: 8,
		},
		{
			id: 3,
			name: "Refinery Expansion",
			client: "PetroCorp",
			status: "On Track",
			progress: 15,
			overdue: 0,
		},
	];

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-8 animate-fade-in-up">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-merriweather font-bold text-on-surface">
						Command Center
					</h1>
					<p className="text-on-surface-variant font-inter">
						Good morning. Here is your portfolio overview.
					</p>
				</div>
				<div className="flex gap-2">
					<Link
						href="/pm/update/new"
						className="flex items-center gap-2 px-4 py-2 bg-surface-variant hover:bg-surface-variant/80 border border-outline-variant rounded-lg text-sm font-medium transition-colors"
					>
						<CameraIcon className="w-4 h-4" />
						Quick Update
					</Link>
					<Link
						href="/pm/issues/new"
						className="flex items-center gap-2 px-4 py-2 bg-semantic-crimson text-white hover:bg-semantic-crimson/90 rounded-lg text-sm font-medium transition-colors"
					>
						<AlertTriangleIcon className="w-4 h-4" />
						Log Issue
					</Link>
				</div>
			</div>

			{/* KPI Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<KPICard
					title="Pending Tasks"
					value="14"
					icon={<CheckSquareIcon />}
					semanticColor="sky"
					trend={{ value: 2, label: "from yesterday", isPositive: false }}
					href="/pm/milestones"
				/>
				<KPICard
					title="Open Blockers"
					value="3"
					icon={<AlertTriangleIcon />}
					semanticColor="crimson"
					trend={{ value: 1, label: "new today", isPositive: false }}
					href="/pm/issues"
				/>
				<KPICard
					title="Pending Reviews"
					value="7"
					icon={<FileBoxIcon />}
					semanticColor="amber"
					href="/pm/handovers"
				/>
			</div>

			{/* Active Projects */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-merriweather font-semibold text-on-surface">
						Active Projects
					</h2>
					<Link
						href="/pm/projects"
						className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
					>
						View All <ArrowRightIcon className="w-4 h-4" />
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{activeProjects.map((project) => (
						<Card
							key={project.id}
							className="hover:shadow-elevation-l2 transition-all group"
						>
							<CardContent className="p-5 space-y-4">
								<div className="flex items-start justify-between">
									<div>
										<h3 className="font-bold text-lg text-on-surface group-hover:text-primary transition-colors">
											<Link
												href={`/pm/projects/${project.id}`}
												className="before:absolute before:inset-0 relative"
											>
												{project.name}
											</Link>
										</h3>
										<p className="text-sm text-on-surface-variant">
											{project.client}
										</p>
									</div>
									<StatusBadge
										tone={
											project.status === "On Track"
												? "emerald"
												: project.status === "At Risk"
													? "crimson"
													: "sky"
										}
										label={project.status}
									/>
								</div>

								<div>
									<ProgressBar
										progress={project.progress}
										showPercentage
										label="Milestone Completion"
										colorClass={
											project.status === "At Risk"
												? "bg-semantic-crimson"
												: "bg-primary"
										}
									/>
								</div>

								<div className="flex items-center justify-between pt-2 border-t border-outline-variant/50">
									<div className="text-sm flex items-center gap-1">
										{project.overdue > 0 ? (
											<span className="text-semantic-crimson font-medium flex items-center gap-1">
												<AlertTriangleIcon className="w-3 h-3" />{" "}
												{project.overdue} overdue tasks
											</span>
										) : (
											<span className="text-semantic-emerald font-medium flex items-center gap-1">
												<CheckSquareIcon className="w-3 h-3" /> All on track
											</span>
										)}
									</div>
									<div className="flex -space-x-2">
										<div className="w-6 h-6 rounded-full bg-surface-variant border border-surface-container flex items-center justify-center text-[10px] font-bold">
											JD
										</div>
										<div className="w-6 h-6 rounded-full bg-primary/20 border border-surface-container flex items-center justify-center text-[10px] font-bold text-primary">
											AM
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Collaboration Feed */}
			<div className="space-y-4">
				<h2 className="text-xl font-merriweather font-semibold text-on-surface">
					Recent Activity
				</h2>
				<Card>
					<CardContent className="p-0 divide-y divide-outline-variant/30">
						<div className="p-4 flex gap-4 items-start hover:bg-surface-variant/30 transition-colors">
							<div className="w-10 h-10 rounded-full bg-semantic-purple-bg/30 text-semantic-purple flex items-center justify-center shrink-0 font-bold">
								TC
							</div>
							<div>
								<p className="text-sm text-on-surface">
									<span className="font-semibold">Tom Carter</span> uploaded a
									new drawing revision for{" "}
									<Link
										href="/pm/projects/1/drawings"
										className="text-primary hover:underline font-medium"
									>
										Alpha Tower Build
									</Link>
								</p>
								<p className="text-xs text-on-surface-variant mt-1">
									10 mins ago
								</p>
							</div>
						</div>
						<div className="p-4 flex gap-4 items-start hover:bg-surface-variant/30 transition-colors">
							<div className="w-10 h-10 rounded-full bg-semantic-crimson-bg/30 text-semantic-crimson flex items-center justify-center shrink-0 font-bold">
								<AlertTriangleIcon className="w-5 h-5" />
							</div>
							<div>
								<p className="text-sm text-on-surface">
									Critical Issue reported:{" "}
									<span className="font-medium">
										Foundation crack detected in Sector B
									</span>{" "}
									on{" "}
									<Link
										href="/pm/projects/2/issues"
										className="text-primary hover:underline font-medium"
									>
										Sector 7 Pipeline
									</Link>
								</p>
								<p className="text-xs text-on-surface-variant mt-1">
									2 hours ago
								</p>
							</div>
						</div>
					</CardContent>
					<div className="p-3 border-t border-outline-variant/30 text-center">
						<button className="text-sm font-medium text-primary hover:underline">
							View All Activity
						</button>
					</div>
				</Card>
			</div>
		</div>
	);
}
