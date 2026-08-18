"use client";
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { PlusIcon, Edit3Icon } from "lucide-react";

export default function PMLessonsLearned() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Technical", "Financial", "Safety"];

  const filteredLessons = activeCategory === "All"
    ? mockLessons
    : mockLessons.filter(l => l.category === activeCategory);

  return (
    <div className="p-6 space-y-6 max-w-300 mx-auto">
      <PageHeader
        title="Lessons Learned"
        subtitle="Knowledge base of project insights and post-mortems."
        actions={
          <div className="flex gap-3">
            <Button variant="outline"><Edit3Icon className="w-4 h-4 mr-2" /> Start Draft</Button>
            <Button variant="primary"><PlusIcon className="w-4 h-4 mr-2" /> Log New Insight</Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container p-2 rounded-xl border border-outline-variant">
        <div className="flex gap-1 overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-surface-variant text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="w-full md:w-64">
          <SearchInput onSearch={() => { }} placeholder="Filter entries..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => (
          <Card key={lesson.id} className="p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-bold text-on-surface line-clamp-2">{lesson.title}</h4>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${lesson.category === "Technical" ? "bg-sky-500/10 text-sky-600" :
                  lesson.category === "Safety" ? "bg-semantic-crimson/10 text-semantic-crimson" :
                    "bg-semantic-emerald/10 text-semantic-emerald"
                }`}>
                {lesson.category}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant line-clamp-3">{lesson.excerpt}</p>
            <div className="mt-auto pt-4 border-t border-outline-variant/50 flex justify-between items-center text-xs text-on-surface-variant">
              <span>{lesson.project}</span>
              <span className="font-medium text-on-surface">{lesson.author}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const mockLessons = [
  { id: "1", title: "Concrete Curing in High Humidity", category: "Technical", excerpt: "We experienced a 15% delay in curing times due to unexpected humidity levels. Future schedules should account for local microclimates.", project: "Alpha Tower Build", author: "Sarah Jenkins" },
  { id: "2", title: "Subcontractor Invoice Discrepancies", category: "Financial", excerpt: "Implementing a strict bi-weekly review of all subcontractor logs prevented a potential 5% budget overrun.", project: "Sector 7 Pipeline", author: "Marcus Chen" },
  { id: "3", title: "Crane Wind Limits on High Floors", category: "Safety", excerpt: "Anemometer readings differed significantly from ground level forecasts. Mandating dedicated local wind sensors is crucial.", project: "Alpha Tower Build", author: "Alex Kho" },
];