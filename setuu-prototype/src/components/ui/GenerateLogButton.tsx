"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { PlusCircleIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import { generateDailyReport } from "@/app/actions/dailyLogActions";
import { useToast } from "@/contexts/ToastContext";
import { useRouter } from "next/navigation";

export function GenerateLogButton({ projectId, date, hasLogToday = false }: { projectId: string, date: string, hasLogToday?: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      toast.info("AI is analyzing site updates and labor data...");
      await generateDailyReport(projectId, date);
      toast.success(hasLogToday ? "Daily Log updated successfully!" : "Daily Log generated successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to generate log.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="primary" 
      onClick={handleGenerate} 
      disabled={isGenerating}
      className={`gap-2 shadow-elevation-l1 hover:shadow-elevation-l2 transition-all ${hasLogToday ? 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80 border border-outline-variant' : 'bg-gradient-to-r from-primary to-primary/90'}`}
    >
      {isGenerating ? (
        <Loader2Icon className="w-4 h-4 animate-spin" />
      ) : (
        <SparklesIcon className="w-4 h-4" />
      )}
      {isGenerating ? "Synthesizing Report..." : hasLogToday ? "Refresh Today's Log" : "Generate Today's Log"}
    </Button>
  );
}
