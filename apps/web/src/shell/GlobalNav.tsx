import { NAV_ITEMS, type NavId } from '../domain/navigation'
import { cn } from '../ui/cn'

type GlobalNavProps = {
  activeNavId: NavId
  onNavSelect?: (id: NavId) => void
}

export function GlobalNav({ activeNavId, onNavSelect }: GlobalNavProps) {
  return (
    <nav className="min-w-0 flex-1 overflow-x-auto" aria-label="グローバルナビ">
      <ul className="m-0 flex list-none flex-row flex-nowrap items-center gap-0.5 p-0">
        {NAV_ITEMS.map((item) => {
          const current = item.id === activeNavId
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                className={cn(
                  'cursor-pointer rounded-md border-0 bg-transparent px-2.5 py-1.5 text-[0.875rem] font-medium text-eq-ink hover:bg-eq-nav-active/55',
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
