"use client";
import * as React from "react";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects } from "@/app/actions/projectActions";

export default function PMProjectsList() {
	const [data, setData] = React.useState<any[]>([]);

	React.useEffect(() => {
		getProjects().then(setData);
	}, []);

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
			cell: (row: any) => <>{row.client_org_id || 'N/A'}</>,
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
		{ key: "pm", header: "Project Manager", cell: (row: any) => <>{row.pm_name || 'Unassigned'}</> },
		{
			key: "progress",
			header: "Milestone Completion",
			sortable: true,
			cell: (row: any) => (
				<div className="w-48">
					<ProgressBar
						progress={row.progress || 0}
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
