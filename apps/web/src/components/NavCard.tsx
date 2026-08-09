import type { DestinationId } from '../domain/navigation'
import { DestinationIcon } from './DestinationIcon'

type NavCardProps = {
  id: DestinationId
  label: string
  description?: string
  onSelect?: (id: DestinationId) => void
}

export function NavCard({ id, label, description, onSelect }: NavCardProps) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer flex-col items-start gap-2.5 rounded-md border border-eq-border bg-eq-surface px-4 py-3.5 text-left text-inherit hover:border-eq-accent/40 hover:bg-eq-accent-soft"
      onClick={() => onSelect?.(id)}
    >
      <span className="flex size-9 items-center justify-center rounded-md bg-eq-accent-soft text-eq-accent">
        <DestinationIcon id={id} className="size-5" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-[0.9375rem] font-semibold text-eq-ink">{label}</span>
        {description ? (
          <span className="text-[0.8125rem] leading-snug text-eq-muted">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  )
}
