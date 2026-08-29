"use client";
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/contexts/ToastContext";
import { SearchInput } from "@/components/ui/SearchInput";
import { PlusIcon, X } from "lucide-react";
import { getLessons, createLesson } from "@/app/actions/lessonsLearnedActions";

function LogInsightModal({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await createLesson({
        title: fd.get("title"),
        category: fd.get("category"),
        description: fd.get("description"),
        impact: fd.get("impact"),
        status: 'published'
      });
      if (res.success) {
        toast.success("Insight logged successfully");
        onRefresh();
        onClose();
      } else {
        toast.error(res.error || "Failed to log insight");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-outline/10">
          <h2 className="text-xl font-semibold text-on-surface">Log New Insight</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
            <input name="title" required className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Category</label>
            <select name="category" className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface">
              <option value="Technical">Technical</option>
              <option value="Safety">Safety</option>
              <option value="Financial">Financial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Impact Level</label>
            <select name="impact" className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Description / Details</label>
            <textarea name="description" rows={4} required className="w-full bg-surface-container border border-outline rounded-lg px-4 py-2 text-on-surface" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>{loading ? "Saving..." : "Save Insight"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PMLessonsLearned() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadLessons() {
      try {
        const data = await getLessons();
        setLessons(data || []);
      } catch (error) {
        console.error("Failed to fetch lessons", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadLessons();
  }, []);

  const categories = ["All", "Technical", "Financial", "Safety"];

  const filteredLessons = activeCategory === "All"
    ? lessons
    : lessons.filter(l => l.category === activeCategory);

  return (
    <div className="p-6 space-y-6 max-w-300 mx-auto">
      <PageHeader
        title="Lessons Learned"
        subtitle="Knowledge base of project insights and post-mortems."
        actions={
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setIsModalOpen(true)}><PlusIcon className="w-4 h-4 mr-2" /> Log New Insight</Button>
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

      {isLoading ? (
        <div className="p-8 text-center text-on-surface-variant">Loading lessons...</div>
      ) : (
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
              <p className="text-sm text-on-surface-variant line-clamp-3">{lesson.description}</p>
              <div className="mt-auto pt-4 border-t border-outline-variant/50 flex justify-between items-center text-xs text-on-surface-variant">
                <span className="font-medium text-on-surface">Impact: {lesson.impact || "N/A"}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
      <LogInsightModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={() => { setIsLoading(true); getLessons().then(d => { setLessons(d||[]); setIsLoading(false); }) }} />
    </div>
  );
}
