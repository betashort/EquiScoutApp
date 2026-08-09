import type { DragEvent, KeyboardEvent } from 'react'
import { cn } from '../ui/cn'

export type DragHandleProps = {
  label: string
  className?: string
  draggable?: boolean
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void
  onDragEnd?: (event: DragEvent<HTMLButtonElement>) => void
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void
}

export function DragHandle({
  label,
  className,
  draggable = true,
  onDragStart,
  onDragEnd,
  onKeyDown,
}: DragHandleProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded border-0 bg-transparent text-eq-muted hover:bg-eq-accent-soft hover:text-eq-ink active:cursor-grabbing',
        className,
      )}
      aria-label={`${label}を移動`}
      title="ドラッグして配置を入れ替え"
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onKeyDown={onKeyDown}
    >
      <span aria-hidden className="text-sm leading-none tracking-tighter">
        ⠿
      </span>
    </button>
  )
}
