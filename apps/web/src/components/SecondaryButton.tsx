import { btnCompact, btnSecondary } from '../ui/classes'
import { cn } from '../ui/cn'

type SecondaryButtonProps = {
  label: string
  onClick?: () => void
  disabled?: boolean
  compact?: boolean
  type?: 'button' | 'submit'
}

export function SecondaryButton({
  label,
  onClick,
  disabled = false,
  compact = false,
  type = 'button',
}: SecondaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(btnSecondary, compact && btnCompact)}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
