import type { BarChartItem, Surface } from '../domain/analysis'
import { cn } from '../ui/cn'

type BarChartProps = {
  items: readonly BarChartItem[]
  surface?: Surface
}

export function BarChart({ items, surface = 'turf' }: BarChartProps) {
  const maxValue = Math.max(...items.map((item) => item.value), 1)

  return (
    <div className="flex min-h-36 items-end gap-1.5 px-1 pt-2">
      {items.map((item) => {
        const heightPercent = (item.value / maxValue) * 100

        return (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col items-center gap-1"
          >
            <div className="flex h-28 w-full items-end">
              <div
                className={cn(
                  'mx-auto w-full max-w-8 min-h-0.5 rounded-t-sm',
                  surface === 'dirt' ? 'bg-eq-dirt' : 'bg-eq-accent',
                )}
                style={{ height: `${heightPercent}%` }}
              />
            </div>
            <span className="text-[0.6875rem] text-eq-ink">{item.displayValue}</span>
            <span className="text-center text-[0.6875rem] leading-tight text-eq-muted">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
