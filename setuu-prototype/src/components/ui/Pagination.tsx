import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center space-x-2 font-jetbrains-mono text-sm">
      <button 
        disabled={currentPage <= 1}
        onClick={() => onPageChange(1)}
        className="p-1 rounded hover:bg-surface-variant disabled:opacity-50"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button 
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-1 rounded hover:bg-surface-variant disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-3 py-1 text-on-surface-variant">
        Page {currentPage} of {totalPages}
      </span>
      <button 
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-1 rounded hover:bg-surface-variant disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button 
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(totalPages)}
        className="p-1 rounded hover:bg-surface-variant disabled:opacity-50"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
}
