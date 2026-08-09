import { NAV_ITEMS, type NavId } from '../domain/navigation'
import { cn } from '../ui/cn'

type GlobalNavProps = {
  activeNavId: NavId
  onNavSelect?: (id: NavId) => void
}

export function GlobalNav({ activeNavId, onNavSelect }: GlobalNavProps) {
  return (
    <nav
      className="border-eq-border bg-eq-surface/78 p-2 md:border-r md:border-b-0 border-b"
      aria-label="グローバルナビ"
    >
      <ul className="m-0 flex list-none flex-row flex-wrap gap-1 p-0 md:flex-col">
        {NAV_ITEMS.map((item) => {
          const current = item.id === activeNavId
          return (
            <li key={item.id}>
              <button
                type="button"
                className={cn(
                  'block w-full cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 text-left text-[0.9375rem] font-medium text-eq-ink hover:bg-eq-nav-active/55',
                  current && 'bg-eq-nav-active text-eq-accent',
                )}
                aria-current={current ? 'page' : undefined}
                onClick={() => onNavSelect?.(item.id)}
              >
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
