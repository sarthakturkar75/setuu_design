"use client";

import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Save, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const projectList = [
  { id: "PRJ-1042", name: "Alpha Tower", status: "in_progress" },
  { id: "PRJ-1045", name: "Beta Site", status: "on_hold" },
  { id: "PRJ-1048", name: "Gamma Facility", status: "completed" },
];

export default function ProjectConfigPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="flex flex-col lg:flex-row h-full max-w-[1600px] mx-auto p-6 gap-6">

      {/* Sidebar Selector */}
      <div className="w-full lg:w-72 shrink-0 flex flex-col gap-4">
        <h3 className="font-merriweather font-bold text-on-surface">Active Projects</h3>
        <div className="space-y-2">
          {projectList.map(p => (
            <Link
              key={p.id}
              href={`/admin/projects/${p.id}/config`}
              className={`block p-3 rounded-lg border transition-colors ${p.id === id
                ? "bg-primary/5 border-primary"
                : "bg-surface border-outline-variant hover:bg-surface-variant"
                }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-semibold text-sm ${p.id === id ? "text-primary" : "text-on-surface"}`}>
                  {p.name}
                </span>
                <StatusBadge tone={p.status as any} label={p.status} />
              </div>
              <span className="text-xs font-jetbrains text-on-surface-variant">{p.id}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <div className="flex-1 flex flex-col gap-6">
        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Project Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Project Name *">
              <TextInput value="Alpha Tower" />
            </FormField>
            <FormField label="Project Type">
              <SelectMenu
                options={[
                  { label: "Commercial", value: "commercial" },
                  { label: "Residential", value: "residential" },
                ]}
                value="commercial"
                onChange={() => { }}
              />
            </FormField>
            <FormField label="PO Reference">
              <TextInput value="PO-2026-0042" />
            </FormField>
            <FormField label="Contract Value">
              <TextInput value="14500000" type="number" />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Description">
                <textarea
                  className="w-full px-3 py-2 bg-surface text-on-surface border border-outline rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-25"
                  value="Phase 1 of the new commercial district hub."
                />
              </FormField>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-merriweather text-lg font-bold text-on-surface mb-6">Management & Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Assigned Project Manager *">
              <SelectMenu
                options={[
                  { label: "Alice Chen", value: "alice" },
                  { label: "Bob Smith", value: "bob" },
                ]}
                value="alice"
                onChange={() => { }}
              />
            </FormField>
            <FormField label="Client Organization *">
              <SelectMenu
                options={[
                  { label: "Acme Corp", value: "acme" },
                ]}
                value="acme"
                onChange={() => { }}
              />
            </FormField>
            <FormField label="Start Date">
              <TextInput type="date" value="2026-01-15" />
            </FormField>
            <FormField label="Target Completion">
              <TextInput type="date" value="2027-12-01" />
            </FormField>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg font-semibold hover:bg-surface-variant transition-colors">
            <LifeBuoy className="w-4 h-4" />
            Raise Ticket
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors">
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
