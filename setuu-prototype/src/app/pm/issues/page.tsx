"use client";
import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertTriangleIcon } from "lucide-react";

export default function PMCrossProjectIssues() {
	const issues = [
		{
			id: "ISS-001",
			project: "Sector 7 Pipeline",
			title: "Foundation crack detected in Sector B",
			severity: "High",
			status: "Open",
			assignee: "Site Admin",
		},
		{
			id: "ISS-002",
			project: "Alpha Tower Build",
			title: "Delayed steel delivery",
			severity: "Medium",
			status: "Investigating",
			assignee: "Jane Doe",
		},
		{
			id: "ISS-003",
			project: "Refinery Expansion",
			title: "Permit pending approval",
			severity: "Low",
			status: "Resolved",
			assignee: "Tom Carter",
		},
	];

	const columns = [
		{
			key: "id",
			header: "ID",
			cell: (row: any) => (
				<span className="font-jetbrains-mono text-xs text-outline">
					{row.id}
				</span>
			),
		},
		{
			key: "project",
			header: "Project",
			sortable: true,
			cell: (row: any) => <>{row.project}</>,
		},
		{
			key: "title",
			header: "Issue",
			cell: (row: any) => (
				<span className="font-medium text-on-surface">{row.title}</span>
			),
		},
		{
			key: "severity",
			header: "Severity",
			sortable: true,
			cell: (row: any) => (
				<span
					className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${row.severity === "High" ? "bg-semantic-crimson-bg/10 text-semantic-crimson" : row.severity === "Medium" ? "bg-semantic-amber-bg/10 text-semantic-amber" : "bg-semantic-sky-bg/10 text-semantic-sky"}`}
				>
					{row.severity}
				</span>
			),
		},
		{
			key: "status",
			header: "Status",
			cell: (row: any) => (
				<StatusBadge
					tone={
						row.status === "Resolved"
							? "emerald"
							: row.status === "Open"
								? "crimson"
								: "amber"
					}
					label={row.status}
				/>
			),
		},
		{
			key: "assignee",
			header: "Assigned To",
			cell: (row: any) => <>{row.assignee}</>,
		},
	];

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-6">
			<PageHeader
				title="Cross-Project Issues"
				actions={
					<button className="flex items-center gap-2 px-4 py-2 bg-semantic-crimson text-white hover:bg-semantic-crimson/90 rounded-lg text-sm font-medium transition-colors">
						<AlertTriangleIcon className="w-4 h-4" />
						Log New Issue
					</button>
				}
			/>

			<div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
				<DataTable data={issues} columns={columns} />
			</div>
		</div>
	);
}
