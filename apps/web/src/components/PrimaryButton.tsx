import { btnCompact, btnPrimary } from '../ui/classes'
import { cn } from '../ui/cn'

type PrimaryButtonProps = {
  label: string
  onClick?: () => void
  disabled?: boolean
  compact?: boolean
  type?: 'button' | 'submit'
}

export function PrimaryButton({
  label,
  onClick,
  disabled = false,
  compact = false,
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      className={cn(btnPrimary, compact && btnCompact)}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  )
}
