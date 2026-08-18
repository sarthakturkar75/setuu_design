"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageHeader } from "@/components/ui/PageHeader";

export default function PMProjectsList() {
	const data = [
		{
			id: 1,
			name: "Alpha Tower Build",
			client: "Apex Holdings",
			status: "In Progress",
			pm: "Jane Doe",
			progress: 68,
		},
		{
			id: 2,
			name: "Sector 7 Pipeline",
			client: "City Works",
			status: "At Risk",
			pm: "Alex Mercer",
			progress: 42,
		},
		{
			id: 3,
			name: "Refinery Expansion",
			client: "PetroCorp",
			status: "On Track",
			pm: "Jane Doe",
			progress: 15,
		},
		{
			id: 4,
			name: "Downtown Office Park",
			client: "Metro Dev",
			status: "Completed",
			pm: "Sarah Jenkins",
			progress: 100,
		},
	];

	const columns = [
		{
			key: "name",
			header: "Project Name",
			sortable: true,
			cell: (row: any) => (
				<a
					href={`/pm/projects/${row.id}`}
					className="font-medium text-primary hover:underline"
				>
					{row.name}
				</a>
			),
		},
		{
			key: "client",
			header: "Client Organization",
			sortable: true,
			cell: (row: any) => <>{row.client}</>,
		},
		{
			key: "status",
			header: "Status",
			sortable: true,
			cell: (row: any) => (
				<StatusBadge
					tone={
						row.status === "On Track" || row.status === "Completed"
							? "emerald"
							: row.status === "At Risk"
								? "crimson"
								: "sky"
					}
					label={row.status}
				/>
			),
		},
		{ key: "pm", header: "Project Manager", cell: (row: any) => <>{row.pm}</> },
		{
			key: "progress",
			header: "Milestone Completion",
			sortable: true,
			cell: (row: any) => (
				<div className="w-48">
					<ProgressBar
						progress={row.progress}
						showPercentage
						colorClass={
							row.status === "At Risk" ? "bg-semantic-crimson" : "bg-primary"
						}
					/>
				</div>
			),
		},
	];

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-6">
			<PageHeader title="Active Projects" />
			<div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
				<DataTable data={data} columns={columns} />
			</div>
		</div>
	);
}
