"use client";
import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CalendarIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import Link from "next/link";

export default function PMMilestones() {
	const projects = [
		{
			id: 1,
			name: "Alpha Tower Build",
			milestones: [
				{
					id: 101,
					title: "Foundation Pour",
					targetDate: "2026-08-25",
					status: "In Progress",
					tasks: 12,
					completedTasks: 8,
				},
				{
					id: 102,
					title: "Steel Framing Level 1",
					targetDate: "2026-09-10",
					status: "Not Started",
					tasks: 20,
					completedTasks: 0,
				},
			],
		},
		{
			id: 2,
			name: "Sector 7 Pipeline",
			milestones: [
				{
					id: 201,
					title: "Environmental Clearance",
					targetDate: "2026-08-10",
					status: "Overdue",
					tasks: 5,
					completedTasks: 4,
				},
				{
					id: 202,
					title: "Trenching Phase 1",
					targetDate: "2026-08-30",
					status: "Not Started",
					tasks: 15,
					completedTasks: 0,
				},
			],
		},
	];

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-6">
			<PageHeader title="Cross-Project Milestones" />

			<div className="space-y-8">
				{projects.map((project) => (
					<div key={project.id} className="space-y-4">
						<h2 className="text-xl font-merriweather font-semibold text-on-surface border-b border-outline-variant/30 pb-2">
							<Link
								href={`/pm/projects/${project.id}`}
								className="hover:text-primary transition-colors"
							>
								{project.name}
							</Link>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{project.milestones.map((milestone) => (
								<Card
									key={milestone.id}
									className="hover:shadow-elevation-l1 transition-shadow"
								>
									<CardContent className="p-4 space-y-4">
										<div className="flex justify-between items-start">
											<h3 className="font-semibold text-on-surface">
												<Link
													href={`/pm/projects/${project.id}/milestones`}
													className="hover:underline hover:text-primary"
												>
													{milestone.title}
												</Link>
											</h3>
											<StatusBadge
												tone={
													milestone.status === "Overdue"
														? "crimson"
														: milestone.status === "In Progress"
															? "sky"
															: "slate"
												}
												label={milestone.status}
											/>
										</div>
										<div className="flex items-center text-sm text-on-surface-variant gap-4">
											<div
												className="flex items-center gap-1.5"
												title="Target Date"
											>
												<CalendarIcon className="w-4 h-4 text-outline" />
												<span
													className={
														milestone.status === "Overdue"
															? "text-semantic-crimson font-medium"
															: ""
													}
												>
													{milestone.targetDate}
												</span>
											</div>
											<div
												className="flex items-center gap-1.5"
												title="Task Progress"
											>
												<CheckCircle2Icon className="w-4 h-4 text-outline" />
												<span>
													{milestone.completedTasks}/{milestone.tasks} tasks
												</span>
											</div>
										</div>
										{/* Tiny progress bar */}
										<div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
											<div
												className={`h-full ${milestone.status === "Overdue" ? "bg-semantic-crimson" : "bg-primary"}`}
												style={{
													width: `${(milestone.completedTasks / milestone.tasks) * 100}%`,
												}}
											></div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
