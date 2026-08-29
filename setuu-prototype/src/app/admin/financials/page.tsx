"use client";
import { useCurrency } from "@/contexts/CurrencyContext";

import { PageHeader } from "@/components/ui/PageHeader";
import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/BarChart";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FilterBar } from "@/components/ui/FilterBar";
import { Select } from "@/components/ui/Select";
import { TextInput } from "@/components/ui/TextInput";
import { DollarSign, FileText, CheckCircle, Search, Download, TrendingDown, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProjects } from "@/app/actions/projectActions";
import { getCashFlowData } from "@/app/actions/financialActions";

export default function FinancialMasterPage() {
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [projects, setProjects] = useState<any[]>([]);
  const [cashFlowData, setCashFlowData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, cashFlow] = await Promise.all([
          getProjects(),
          getCashFlowData()
        ]);
        setProjects(projectsData);
        setCashFlowData(cashFlow);
      } catch (e) {
        console.error("Failed to load financials data", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const columns = [

    {
      key: "name",
      header: "Project",
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface">{row.name}</span>
    },
    {
      key: "client_org_id",
      header: "Client",
      sortable: true,
      cell: (row: any) => <span className="text-on-surface-variant">{row.client_org_id || "Unknown"}</span>
    },
    {
      key: "contract_value",
      header: "Contract Value",
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains font-bold text-on-surface">{row.contract_value ? formatCurrency(row.contract_value) : "N/A"}</span>
    },
    {
      key: "start_date",
      header: "Start Date",
      sortable: true,
      cell: (row: any) => <span className="text-sm font-jetbrains text-on-surface-variant">{row.start_date ? new Date(row.start_date).toLocaleDateString() : "Unknown"}</span>
    },
    {
      key: "status",
      header: "Status",
      cell: (row: any) => (
        <StatusBadge
          tone={row.status === "Completed" || row.status === "Delivered" ? "emerald" : row.status === "In Progress" ? "amber" : "crimson"}
          label={row.status}
        />
      )
    },
    {
      key: "actions",
      header: "",
      cell: () => (
        <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          Review
        </button>
      )
    }
  ];

  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader
        title="Financial Master"
        subtitle="Track portfolio-wide budgets, expenditures, and invoice approvals"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Financials</span>
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
              <Download className="w-4 h-4" />
              Export Financials
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Portfolio Budget"
            value="₹14.2B"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <KPICard
            title="Total Expenditure"
            value="₹8.4B"
            trend={{ value: 59, label: "% of budget", isPositive: true }}
            icon={<TrendingDown className="w-5 h-5" />}
            semanticColor="amber"
          />
          <KPICard
            title="Pending Approvals"
            value="₹45.2M"
            trend={{ value: 12, label: "invoices", isPositive: false }}
            icon={<FileText className="w-5 h-5" />}
            semanticColor="sky"
          />
          <KPICard
            title="Approved YTD"
            value="₹6.1B"
            icon={<CheckCircle className="w-5 h-5" />}
            semanticColor="emerald"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-6">

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col gap-6">

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-merriweather font-bold text-lg text-on-surface">Invoice Approval Queue</h3>
              </div>

              <FilterBar onClear={() => { }} onApply={() => { }}>
                <div className="w-full sm:w-64 relative">
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <TextInput placeholder="Search project or client..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Select
                  options={[
                    { label: "All Statuses", value: "" },
                    { label: "Not Started", value: "Not Started" },
                    { label: "In Progress", value: "In Progress" },
                    { label: "Completed", value: "Completed" },
                    { label: "At Risk", value: "At Risk" },
                  ]}
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                />
              </FilterBar>

              <div className="mt-4">
                {loading ? (
                  <div className="p-8 text-center text-on-surface-variant">Loading invoices...</div>
                ) : (
                  <DataTable
                    data={projects}
                    columns={columns}
                    getRowId={(row: any) => row.id}
                    selectable={true}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                  />
                )}
              </div>
            </Card>

          </div>

          {/* Context Sidebar */}
          <div className="w-full xl:w-96 flex-shrink-0 flex flex-col gap-6">
            <Card className="p-6">
              <h3 className="font-merriweather font-bold text-lg text-on-surface mb-6">Cash Flow (In Millions)</h3>
              <div className="h-64">
                <BarChart
                  data={cashFlowData}
                  keys={["Inflow", "Outflow"]}
                  colors={["var(--semantic-emerald)", "var(--semantic-crimson)"]}
                  xAxisKey="month"
                />
              </div>
            </Card>

            <Card className="p-6 bg-surface-variant/30 border-outline-variant">
              <h3 className="font-merriweather font-bold text-on-surface mb-4">Budget Alerts</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-semantic-amber/30">
                  <div className="p-2 rounded-full bg-semantic-amber/10 text-semantic-amber shrink-0 mt-0.5">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">Alpha Tower Structural</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Approaching 90% of allocated budget limit.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-semantic-crimson/30">
                  <div className="p-2 rounded-full bg-semantic-crimson/10 text-semantic-crimson shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-on-surface text-sm">Beta Complex MEP</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Overdrawn by ₹1.2M. Requires immediate review.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
