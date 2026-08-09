import type { RateBadge } from '../domain/analysis'

type RateBadgeRowProps = {
  items: readonly RateBadge[]
}

export function RateBadgeRow({ items }: RateBadgeRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.period}`}
          className="flex min-w-[6.5rem] flex-col gap-0.5 rounded-md border border-eq-border bg-eq-surface/90 px-2.5 py-2"
        >
          <span className="text-xs text-eq-muted">{item.label}</span>
          <span className="text-base font-semibold text-eq-ink">{item.value}</span>
          <span className="text-[0.6875rem] text-eq-muted">{item.period}</span>
        </div>
      ))}
    </div>
  )
}
