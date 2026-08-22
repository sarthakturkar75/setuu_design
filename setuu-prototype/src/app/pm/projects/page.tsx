"use client";
import * as React from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProjects } from "@/app/actions/projectActions";

export default function PMProjectsList() {
	const [data, setData] = React.useState<any[]>([]);
	const searchParams = useSearchParams();
	const q = searchParams.get("q")?.toLowerCase().trim() || "";

	React.useEffect(() => {
		getProjects().then(setData);
	}, []);

	const filteredData = q
		? data.filter(
			(row) =>
				row.name?.toLowerCase().includes(q) ||
				row.pm_name?.toLowerCase().includes(q),
		)
		: data;

	const columns = [
		{
			key: "name",
			header: "Project Name",
			sortable: true,
			cell: (row: any) => (
				<a href={`/pm/projects/${row.id}`} className="font-medium text-primary hover:underline">
					{row.name}
				</a>
			),
		},
		{
			key: "client",
			header: "Client",
			sortable: true,
			cell: (row: any) => <>{row.client_name || "N/A"}</>,
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
		{ key: "pm", header: "Project Manager", cell: (row: any) => <>{row.pm_name || "Unassigned"}</> },
		{
			key: "progress",
			header: "Milestone Completion",
			sortable: true,
			cell: (row: any) => (
				<div className="w-48">
					<ProgressBar
						progress={row.progress || 0}
						showPercentage
						colorClass={row.status === "At Risk" ? "bg-semantic-crimson" : "bg-primary"}
					/>
				</div>
			),
		},
	];

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-6">
			<PageHeader title="Active Projects" />
			{q && (
				<p className="text-sm text-on-surface-variant">
					Showing results for "{q}" — {filteredData.length} match
					{filteredData.length === 1 ? "" : "es"}
				</p>
			)}
			<div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
				<DataTable data={filteredData} columns={columns} />
			</div>
		</div>
	);
}