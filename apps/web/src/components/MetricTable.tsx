import type { MetricTableViewModel } from '../domain/analysis'
import { block, blockTitle } from '../ui/classes'

type MetricTableProps = {
  title?: string
  data: MetricTableViewModel
}

export function MetricTable({ title, data }: MetricTableProps) {
  const table = (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[0.8125rem]">
        <thead>
          <tr>
            <th
              scope="col"
              className="bg-eq-bg-bottom/70 px-2.5 py-1.5 text-left font-semibold whitespace-nowrap text-eq-muted"
            />
            {data.columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="bg-eq-bg-bottom/70 px-2.5 py-1.5 text-right font-semibold whitespace-nowrap text-eq-muted"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="border-b border-eq-border px-2.5 py-1.5 text-left font-medium whitespace-nowrap"
              >
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td
                  key={`${row.label}-${index}`}
                  className="border-b border-eq-border px-2.5 py-1.5 text-right whitespace-nowrap"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  if (!title) {
    return table
  }

  return (
    <div className={block}>
      <h3 className={blockTitle}>{title}</h3>
      {table}
    </div>
  )
}
