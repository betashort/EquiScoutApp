import type { DataTableColumn } from '../domain/analysis'
import { EmptyState } from './EmptyState'

type DataTableProps = {
  columns: DataTableColumn[]
  rows: Record<string, string>[]
  emptyTitle?: string
  emptyBody?: string
}

export function DataTable({
  columns,
  rows,
  emptyTitle = 'データがありません',
  emptyBody = '条件を変えるか、別の対象を選んでください。',
}: DataTableProps) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} body={emptyBody} />
  }

  return (
    <table className="w-full border-collapse text-[0.8125rem]">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.key}
              scope="col"
              className={
                index === 0
                  ? 'bg-eq-bg-bottom/70 px-2.5 py-1.5 text-left font-semibold whitespace-nowrap text-eq-muted'
                  : 'bg-eq-bg-bottom/70 px-2.5 py-1.5 text-right font-semibold whitespace-nowrap text-eq-muted'
              }
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, index) => (
              <td
                key={column.key}
                className={
                  index === 0
                    ? 'border-b border-eq-border px-2.5 py-1.5 text-left whitespace-nowrap'
                    : 'border-b border-eq-border px-2.5 py-1.5 text-right whitespace-nowrap'
                }
              >
                {row[column.key] ?? ''}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
