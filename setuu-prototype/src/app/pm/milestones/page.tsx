"use client";
import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { getMilestones } from "@/app/actions/milestoneActions";

export default function PMMilestones() {
	const [milestones, setMilestones] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		const fetchMilestones = async () => {
			try {
				const data = await getMilestones();
				setMilestones(data || []);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		};
		fetchMilestones();
	}, []);

	const projects = React.useMemo(() => {
		const map: Record<string, any> = {};
		for (const m of milestones) {
			if (!map[m.project_id]) {
				map[m.project_id] = {
					id: m.project_id,
					name: m.projects?.name || `Project ${m.project_id}`,
					milestones: [],
				};
			}
			map[m.project_id].milestones.push(m);
		}
		return Object.values(map);
	}, [milestones]);

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-6">
			<PageHeader title="Cross-Project Milestones" />

			{loading ? (
				<div className="flex justify-center py-12 text-on-surface-variant">Loading milestones...</div>
			) : (
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
								{project.milestones.map((milestone: any) => (
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
														milestone.completion_status === "Overdue"
															? "crimson"
															: milestone.completion_status === "In Progress"
																? "sky"
																: "slate"
													}
													label={milestone.completion_status || "Pending"}
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
															milestone.completion_status === "Overdue"
																? "text-semantic-crimson font-medium"
																: ""
														}
													>
														{milestone.target_date}
													</span>
												</div>
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
