"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { KPICard } from "@/components/ui/KPICard";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/BarChart";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FilterBar } from "@/components/ui/FilterBar";
import { SelectMenu } from "@/components/ui/SelectMenu";
import { TextInput } from "@/components/ui/TextInput";
import { DollarSign, FileText, CheckCircle, Search, Download, TrendingDown, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const mockInvoices = [
  { id: "INV-2026-081", project: "Alpha Tower", vendor: "BuildTech Concrete", amount: "₹1,250,000", status: "pending", date: "Oct 12, 2026" },
  { id: "INV-2026-082", project: "Beta Complex", vendor: "Metro MEP Services", amount: "₹450,000", status: "approved", date: "Oct 10, 2026" },
  { id: "INV-2026-083", project: "Gamma Hub", vendor: "Global Steel Co", amount: "₹890,000", status: "rejected", date: "Oct 08, 2026" },
  { id: "INV-2026-084", project: "Alpha Tower", vendor: "Apex Architecture", amount: "₹120,000", status: "approved", date: "Oct 05, 2026" },
];

const cashFlowData = [
  { month: "May", Inflow: 45, Outflow: 38 },
  { month: "Jun", Inflow: 52, Outflow: 41 },
  { month: "Jul", Inflow: 48, Outflow: 49 },
  { month: "Aug", Inflow: 61, Outflow: 55 },
  { month: "Sep", Inflow: 59, Outflow: 52 },
  { month: "Oct", Inflow: 65, Outflow: 48 },
];

export default function FinancialMasterPage() {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const columns = [
    { 
      key: "id", 
      header: "Invoice ID", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains text-primary font-semibold hover:underline cursor-pointer">{row.id}</span>
    },
    { 
      key: "project", 
      header: "Project", 
      sortable: true,
      cell: (row: any) => <span className="font-medium text-on-surface">{row.project}</span>
    },
    { 
      key: "vendor", 
      header: "Vendor", 
      sortable: true,
      cell: (row: any) => <span className="text-on-surface-variant">{row.vendor}</span>
    },
    { 
      key: "amount", 
      header: "Amount", 
      sortable: true,
      cell: (row: any) => <span className="font-jetbrains font-bold text-on-surface">{row.amount}</span>
    },
    { 
      key: "date", 
      header: "Submitted", 
      sortable: true,
      cell: (row: any) => <span className="text-sm font-jetbrains text-on-surface-variant">{row.date}</span>
    },
    { 
      key: "status", 
      header: "Status",
      cell: (row: any) => (
        <StatusBadge 
          tone={row.status === "approved" ? "emerald" : row.status === "pending" ? "amber" : "crimson"} 
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
                <Link href="#" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                  View All <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              
              <FilterBar onClear={() => {}} onApply={() => {}}>
                <div className="w-full sm:w-64 relative">
                  <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <TextInput placeholder="Search invoice or vendor..." className="pl-9" />
                </div>
                <SelectMenu 
                  options={[
                    { label: "All Statuses", value: "" },
                    { label: "Pending", value: "pending" },
                    { label: "Approved", value: "approved" },
                    { label: "Rejected", value: "rejected" },
                  ]}
                  value=""
                  onChange={() => {}}
                />
              </FilterBar>

              <div className="mt-4">
                <DataTable 
                  data={mockInvoices}
                  columns={columns}
                  getRowId={(row: any) => row.id}
                  selectable={true}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                />
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
