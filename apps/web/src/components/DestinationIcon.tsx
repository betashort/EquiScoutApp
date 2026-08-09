import type { DestinationId } from '../domain/navigation'

type DestinationIconProps = {
  id: DestinationId
  className?: string
}

/** 遷移先識別用の線画アイコン（イラスト・写真は使わない）。 */
export function DestinationIcon({ id, className = 'size-6' }: DestinationIconProps) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (id) {
    case 'horse':
      return (
        <svg {...common}>
          <path d="M4 16c1.5-1 3-1.5 5-1.5 1.2 0 2.2.3 3 .8" />
          <path d="M12 15.3c1.2-2.2 3.2-3.8 6-4.3 1.2-.2 2.2.4 2.5 1.4.3 1.1-.3 2.2-1.4 2.6l-2.6.9" />
          <path d="M8 14.5V19M14 16.5V19" />
          <path d="M5 10.5c.8-2 2.4-3.2 4.5-3.5 1.4-.2 2.6.3 3.5 1.2" />
          <circle cx="7.2" cy="9.2" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'trainer':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.5 19.5c1.2-3.2 3.4-4.8 6.5-4.8s5.3 1.6 6.5 4.8" />
        </svg>
      )
    case 'farm':
      return (
        <svg {...common}>
          <path d="M4 19h16" />
          <path d="M6 19V11l6-5 6 5v8" />
          <path d="M10 19v-4h4v4" />
          <path d="M9 9.5c.6-1.4 1.6-2.3 3-2.5" />
        </svg>
      )
    case 'pedigree':
      return (
        <svg {...common}>
          <circle cx="12" cy="5.5" r="2" />
          <circle cx="6.5" cy="18" r="2" />
          <circle cx="17.5" cy="18" r="2" />
          <path d="M12 7.5v4.5M12 12 6.5 16M12 12l5.5 4" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
        </svg>
      )
  }
}
