"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { BarChart } from "@/components/ui/BarChart";
import { KPICard } from "@/components/ui/KPICard";
import { TrendingUp, AlertTriangle, ShieldCheck, Download } from "lucide-react";
import Link from "next/link";

const slaData = [
  { name: "BuildTech", score: 98 },
  { name: "Apex Arch", score: 95 },
  { name: "Metro MEP", score: 92 },
  { name: "Global Steel", score: 88 },
  { name: "Heavy Mach", score: 82 },
];

const scorecardData = [
  { metric: "Delivery Timeliness", score: 94, trend: "+2.1%" },
  { metric: "Quality & Compliance", score: 97, trend: "+0.5%" },
  { metric: "Safety Record", score: 99, trend: "0.0%" },
  { metric: "Cost Variance", score: 88, trend: "-4.2%" },
];

export default function VendorPerformancePage() {
  return (
    <div className="flex flex-col h-full bg-surface">
      <PageHeader 
        title="Vendor Performance Matrix" 
        subtitle="Analyze supplier SLA adherence, quality scores, and reliability metrics"
        breadcrumb={
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
            <span>/</span>
            <Link href="/admin/vendors" className="hover:text-primary transition-colors">Vendors</Link>
            <span>/</span>
            <span className="text-on-surface font-medium">Performance</span>
          </div>
        }
        actions={
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        }
      />
      
      <div className="flex-1 overflow-y-auto p-6 max-w-[1600px] mx-auto w-full space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard 
            title="Avg Network SLA" 
            value="94.2%" 
            trend={{ value: 1.5, label: "vs last quarter", isPositive: true }} 
            icon={<ShieldCheck className="w-5 h-5" />} 
            semanticColor="emerald"
          />
          <KPICard 
            title="Critical Deficiencies" 
            value="3" 
            trend={{ value: 2, label: "vs last quarter", isPositive: false }} 
            icon={<AlertTriangle className="w-5 h-5" />} 
            semanticColor="crimson"
          />
          <KPICard 
            title="Cost Savings" 
            value="₹2.4M" 
            trend={{ value: 12.1, label: "vs baseline", isPositive: true }} 
            icon={<TrendingUp className="w-5 h-5" />} 
            semanticColor="sky"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <Card className="p-6 xl:col-span-2 flex flex-col min-h-[400px]">
            <h3 className="font-merriweather font-bold text-lg text-on-surface mb-6">Top Vendors by SLA Adherence</h3>
            <div className="flex-1 min-h-[300px]">
              <BarChart data={slaData} keys={["score"]} colors={["var(--semantic-emerald)"]} />
            </div>
          </Card>

          {/* Quality Scorecards */}
          <Card className="p-6 flex flex-col">
            <h3 className="font-merriweather font-bold text-lg text-on-surface mb-6">Network Quality Scorecard</h3>
            <div className="space-y-6 flex-1">
              {scorecardData.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-outline-variant/50 rounded-xl bg-surface-variant/20">
                  <div>
                    <h4 className="font-semibold text-on-surface">{item.metric}</h4>
                    <span className={`text-xs font-bold font-jetbrains ${item.trend.startsWith('+') ? 'text-semantic-emerald' : 'text-semantic-crimson'}`}>
                      {item.trend}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-2xl font-jetbrains font-bold ${
                      item.score >= 95 ? 'text-semantic-emerald' : 
                      item.score >= 90 ? 'text-semantic-amber' : 'text-semantic-crimson'
                    }`}>
                      {item.score}
                    </span>
                    <span className="text-xs text-on-surface-variant">/ 100</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
