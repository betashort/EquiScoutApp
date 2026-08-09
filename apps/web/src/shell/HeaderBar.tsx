import { SecondaryButton } from '../components/SecondaryButton'
import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { formatLastUpdated } from '../domain/updateStatus'

type HeaderBarProps = {
  updateStatus: UpdateStatusViewModel
  onUpdateClick?: () => void
}

export function HeaderBar({ updateStatus, onUpdateClick }: HeaderBarProps) {
  const isRunning = updateStatus.phase === 'running'

  return (
    <header className="col-span-full flex items-center justify-between gap-4 border-b border-eq-border bg-eq-surface/92 px-5 backdrop-blur-sm">
      <h1 className="m-0 text-lg font-semibold tracking-wide text-eq-ink">
        EquiScout
      </h1>
      <div className="flex min-w-0 items-center gap-3">
        <SecondaryButton
          label="更新"
          compact
          onClick={onUpdateClick}
          disabled={isRunning}
        />
        <div className="flex min-w-0 flex-col items-end gap-0.5">
          {isRunning ? (
            <div
              className="flex min-w-40 items-center gap-2"
              aria-live="polite"
            >
              <div
                className="h-1 flex-1 overflow-hidden rounded-full bg-eq-progress-track"
                aria-hidden="true"
              >
                <span className="block h-full w-2/5 animate-eq-progress rounded-full bg-eq-progress-fill" />
              </div>
              <span className="whitespace-nowrap text-xs text-eq-warning">
                {updateStatus.progressLabel ?? '更新中…'}
              </span>
            </div>
          ) : (
            <span className="whitespace-nowrap text-[0.8125rem] text-eq-muted">
              {formatLastUpdated(updateStatus.lastUpdatedAt)}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
