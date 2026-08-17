"use client";
import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronUp, ChevronDown, MoreVertical, Search, FileSearch } from 'lucide-react';
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { LoadingSkeleton } from "./LoadingSkeleton";

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  selectable?: boolean
  selectedIds?: Set<string | number>
  onSelectionChange?: (ids: Set<string | number>) => void
  getRowId?: (row: T) => string | number
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  rowActions?: (row: T) => React.ReactNode
}

export function DataTable<T>({ 
  columns, 
  data, 
  className,
  isLoading,
  selectable,
  selectedIds = new Set(),
  onSelectionChange,
  getRowId = (row: any) => row.id,
  onSort,
  sortKey,
  sortDirection,
  pagination,
  rowActions,
  ...props 
}: DataTableProps<T>) {
  
  const toggleAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange(new Set(data.map(getRowId)));
    } else {
      onSelectionChange(new Set());
    }
  }

  const toggleRow = (id: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedIds);
    if (checked) next.add(id);
    else next.delete(id);
    onSelectionChange(next);
  }

  const allSelected = data.length > 0 && selectedIds.size === data.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative group/table">
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-container-lowest to-transparent pointer-events-none md:hidden opacity-100 transition-opacity" />
        <div className={cn("w-full overflow-x-auto rounded-lg border border-outline-variant shadow-elevation-l1 bg-surface-container-lowest custom-scrollbar", className)} {...props}>
          <table className="w-full text-sm text-left min-w-[600px]">
            <thead className="bg-surface-container text-on-surface-variant font-jetbrains-mono text-xs uppercase tracking-wider">
              <tr>
                {selectable && (
                  <th className="px-4 py-3 w-12 border-b border-outline-variant">
                    <input 
                      type="checkbox" 
                      className="rounded border-outline-variant text-primary focus:ring-primary"
                      checked={allSelected}
                      ref={input => { if (input) input.indeterminate = someSelected; }}
                      onChange={e => toggleAll(e.target.checked)}
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-3 font-semibold whitespace-nowrap border-b border-outline-variant">
                    {col.sortable && onSort ? (
                      <button 
                        onClick={() => onSort(col.key, sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc')}
                        className="flex items-center space-x-1 hover:text-on-surface transition-colors focus:outline-none"
                      >
                        <span>{col.header}</span>
                        <div className="flex flex-col ml-1">
                          <ChevronUp className={cn("w-3 h-3 -mb-1", sortKey === col.key && sortDirection === 'asc' ? "text-primary" : "opacity-30")} />
                          <ChevronDown className={cn("w-3 h-3", sortKey === col.key && sortDirection === 'desc' ? "text-primary" : "opacity-30")} />
                        </div>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
                {rowActions && <th className="px-4 py-3 w-12 text-right border-b border-outline-variant">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {selectable && <td className="px-4 py-4"><LoadingSkeleton className="w-4 h-4" /></td>}
                    {columns.map(col => (
                      <td key={col.key} className="px-6 py-4"><LoadingSkeleton className="h-4 w-full max-w-[80%]" /></td>
                    ))}
                    {rowActions && <td className="px-4 py-4"><LoadingSkeleton className="w-6 h-6 ml-auto" /></td>}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className="p-8">
                    <EmptyState 
                      title="No Data Available" 
                      message="There are no records to display matching your criteria."
                      icon={<FileSearch className="w-12 h-12 opacity-20" />}
                    />
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => {
                  const id = getRowId(row);
                  const isSelected = selectedIds.has(id);
                  return (
                    <tr 
                      key={id} 
                      className={cn(
                         "transition-colors font-inter group/row",
                        isSelected ? "bg-primary/5" : "hover:bg-surface-container-low/50"
                      )}
                    >
                      {selectable && (
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => toggleRow(id, e.target.checked)}
                            className="rounded border-outline-variant text-primary focus:ring-primary"
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 text-on-surface">
                          {col.cell(row)}
                        </td>
                      ))}
                      {rowActions && (
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end">
                            {rowActions(row)}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Mobile scroll hint */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-surface-container-low border border-outline-variant rounded-l-full shadow-md md:hidden animate-pulse pointer-events-none opacity-80 group-hover/table:opacity-0 transition-opacity">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
      {pagination && (
        <div className="flex justify-end mt-4">
          <Pagination {...pagination} />
        </div>
      )}
    </div>
  )
}
