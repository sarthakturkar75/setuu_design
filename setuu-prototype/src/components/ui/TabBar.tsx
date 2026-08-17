"use client";

export interface TabItem {
  id: string;
  label: string;
}

export function TabBar({ tabs, activeTab, onChange }: { tabs: TabItem[], activeTab: string, onChange: (id: string) => void }) {
  return (
    <div className="flex space-x-6 border-b border-outline-variant/30 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`pb-3 px-1 text-sm font-medium transition-all duration-fast border-b-2 whitespace-nowrap ${
              isActive 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
