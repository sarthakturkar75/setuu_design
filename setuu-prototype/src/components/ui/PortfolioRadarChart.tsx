"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export function PortfolioRadarChart({ projectData, portfolioData }: { projectData: any, portfolioData: any }) {
  const data = [
    {
      subject: 'Progress (%)',
      A: projectData.progress || 0,
      B: portfolioData.avgProgress || 0,
      fullMark: 100,
    },
    {
      subject: 'Risk Score (0-100)',
      A: projectData.riskScore || 0,
      B: portfolioData.avgRiskScore || 0,
      fullMark: 100,
    },
    {
      subject: 'Budget Var (%)',
      A: projectData.budgetVariance || 0,
      B: portfolioData.avgBudgetVariance || 0,
      fullMark: 20, // arbitrary scale for variance
    },
    {
      subject: 'Open Issues',
      A: projectData.openIssues || 0,
      B: portfolioData.avgOpenIssues || 0,
      fullMark: 50,
    },
    {
      subject: 'Milestones Done',
      A: projectData.completedMilestones || 0,
      B: portfolioData.avgCompletedMilestones || 0,
      fullMark: 20,
    }
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(var(--color-on-surface), 0.2)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)' }} />
          <Radar name="This Project" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
          <Radar name="Portfolio Avg" dataKey="B" stroke="#059669" fill="#059669" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
