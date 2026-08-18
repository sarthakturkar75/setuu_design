"use client";
import * as React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { SearchInput } from "@/components/ui/SearchInput";
import { LayoutGridIcon, ListIcon, FileBoxIcon } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import Link from "next/link";

export default function PMDrawings() {
	const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

	const drawings = [
		{
			id: 1,
			title: "Level 1 Floor Plan",
			project: "Alpha Tower Build",
			projectId: 1,
			version: "v3",
			date: "2026-08-15",
			author: "Jane Doe",
		},
		{
			id: 2,
			title: "HVAC Schematic B",
			project: "Alpha Tower Build",
			projectId: 1,
			version: "v1",
			date: "2026-08-16",
			author: "Tom Carter",
		},
		{
			id: 3,
			title: "Trench Profile 1-A",
			project: "Sector 7 Pipeline",
			projectId: 2,
			version: "v2",
			date: "2026-08-10",
			author: "Alex Mercer",
		},
	];

	const columns = [
		{
			key: "title",
			header: "Drawing Title",
			cell: (row: any) => (
				<Link
					href={`/pm/projects/${row.projectId}/drawings`}
					className="font-medium text-primary hover:underline flex items-center gap-2"
				>
					<FileBoxIcon className="w-4 h-4 text-outline" />
					{row.title}
				</Link>
			),
		},
		{
			key: "project",
			header: "Project",
			cell: (row: any) => <>{row.project}</>,
		},
		{
			key: "version",
			header: "Version",
			cell: (row: any) => <>{row.version}</>,
		},
		{ key: "date", header: "Upload Date", cell: (row: any) => <>{row.date}</> },
		{
			key: "author",
			header: "Uploaded By",
			cell: (row: any) => <>{row.author}</>,
		},
	];

	return (
		<div className="p-6 max-w-[1600px] mx-auto space-y-6">
			<PageHeader
				title="Cross-Project Drawings"
				actions={
					<div className="flex items-center gap-2 bg-surface-variant p-1 rounded-lg border border-outline-variant/30">
						<button
							onClick={() => setViewMode("grid")}
							className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
						>
							<LayoutGridIcon className="w-4 h-4" />
						</button>
						<button
							onClick={() => setViewMode("list")}
							className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-surface-container-lowest shadow-sm text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
						>
							<ListIcon className="w-4 h-4" />
						</button>
					</div>
				}
			/>

			<div className="w-full md:w-72">
				<SearchInput
					placeholder="Search drawings across projects..."
					onSearch={() => { }}
				/>
			</div>

			{viewMode === "list" ? (
				<div className="bg-surface-container rounded-xl border border-outline-variant/50 overflow-hidden">
					<DataTable data={drawings} columns={columns} />
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{drawings.map((drawing) => (
						<Card
							key={drawing.id}
							className="hover:shadow-elevation-l1 transition-all overflow-hidden group"
						>
							<div className="aspect-4/3 bg-surface-variant flex items-center justify-center border-b border-outline-variant/30 relative">
								<FileBoxIcon className="w-12 h-12 text-outline/50 group-hover:text-primary/50 transition-colors" />
								<div className="absolute top-2 right-2 px-2 py-0.5 bg-surface-container-lowest/80 backdrop-blur-md text-xs font-bold rounded-md border border-outline-variant/50">
									{drawing.version}
								</div>
							</div>
							<CardContent className="p-4">
								<h3 className="font-semibold text-on-surface truncate">
									<Link
										href={`/pm/projects/${drawing.projectId}/drawings`}
										className="hover:underline hover:text-primary before:absolute before:inset-0"
									>
										{drawing.title}
									</Link>
								</h3>
								<p className="text-xs text-on-surface-variant mt-1">
									{drawing.project}
								</p>
								<div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/30 text-xs text-on-surface-variant">
									<span>{drawing.date}</span>
									<span>{drawing.author}</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
