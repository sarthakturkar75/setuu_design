import React from 'react';

export function FilterBar({ children, onClear, onApply }: { children: React.ReactNode, onClear?: () => void, onApply?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-surface-container-lowest border border-outline-variant/50 rounded-lg">
      <div className="flex-1 flex flex-wrap items-center gap-3">
        {children}
      </div>
      <div className="flex items-center gap-2 shrink-0 border-l border-outline-variant/30 pl-3">
        {onClear && (
          <button onClick={onClear} className="text-sm text-on-surface-variant hover:text-on-surface px-3 py-1.5 font-medium transition-colors">
            Clear
          </button>
        )}
        {onApply && (
          <button onClick={onApply} className="text-sm bg-primary text-on-primary hover:bg-primary/90 px-4 py-1.5 rounded-lg font-medium transition-colors">
            Apply
          </button>
        )}
      </div>
    </div>
  );
}
