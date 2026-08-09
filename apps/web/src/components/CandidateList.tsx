import { cn } from '../ui/cn'

type CandidateListItem = {
  id: string
  label: string
}

type CandidateListProps = {
  items: CandidateListItem[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  emptyLabel?: string
}

export function CandidateList({
  items,
  selectedId,
  onSelect,
  emptyLabel,
}: CandidateListProps) {
  if (items.length === 0) {
    if (emptyLabel) {
      return <p className="m-0 text-sm break-all text-eq-muted">{emptyLabel}</p>
    }
    return null
  }

  return (
    <ul className="mt-1.5 max-h-48 list-none overflow-auto rounded-md border border-eq-border bg-eq-surface p-0">
      {items.map((item) => (
        <li key={item.id} className="border-b border-eq-border last:border-b-0">
          <button
            type="button"
            className={cn(
              'block w-full cursor-pointer border-0 bg-transparent px-3 py-2.5 text-left font-eq text-eq-ink hover:bg-eq-accent-soft',
              selectedId === item.id &&
                'bg-eq-nav-active font-semibold text-eq-accent',
            )}
            aria-selected={selectedId === item.id}
            onClick={() => onSelect?.(item.id)}
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
