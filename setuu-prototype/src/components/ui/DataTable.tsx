import * as React from "react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => React.ReactNode
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[]
  data: T[]
}

export function DataTable<T>({ columns, data, className, ...props }: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-auto rounded-lg border border-outline-variant", className)} {...props}>
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-container-low text-on-surface-variant font-jetbrains-mono text-xs uppercase tracking-wider">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-on-surface-variant font-inter">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-surface-container-low/50 transition-colors font-inter">
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-on-surface">
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
