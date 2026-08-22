import { Card } from "@/components/ui/Card";
import { Activity } from "lucide-react";

export function RiskScoreGauge({ score }: { score: number }) {
  // Score is 0-100 where 100 is highly at risk, 0 is perfectly healthy
  let color = "semantic-emerald";
  let label = "Healthy";
  let description = "Project is on track.";

  if (score > 40) {
    color = "semantic-amber";
    label = "Warning";
    description = "Some metrics need attention.";
  }
  if (score > 75) {
    color = "semantic-crimson";
    label = "At Risk";
    description = "Critical intervention required.";
  }

  const offset = 100 - score; // SVGO dashoffset logic

  return (
    <Card className="p-6 flex flex-col items-center justify-center relative h-full">
      <div className="absolute top-4 left-4">
        <Activity className={`w-5 h-5 text-${color}`} />
      </div>
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-variant/30"
          />
          {/* Progress Circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeDashoffset={(251.2 * offset) / 100}
            strokeLinecap="round"
            className={`text-${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-3xl font-jetbrains font-bold text-${color}`}>{score}</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h4 className="font-bold text-on-surface uppercase tracking-wider text-sm">{label}</h4>
        <p className="text-xs text-on-surface-variant mt-1">{description}</p>
      </div>
    </Card>
  );
}
