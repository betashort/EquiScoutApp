import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingBlock } from '../components/LoadingBlock'
import { PrimaryButton } from '../components/PrimaryButton'
import { SectionHeader } from '../components/SectionHeader'
import { UpdateStatusSummary } from '../components/UpdateStatusSummary'
import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { panel, panelBody } from '../ui/classes'

type HomeUpdatePanelProps = {
  updateStatus: UpdateStatusViewModel
  onUpdateClick?: () => void
  onRetry?: () => void
}

export function HomeUpdatePanel({
  updateStatus,
  onUpdateClick,
  onRetry,
}: HomeUpdatePanelProps) {
  const isRunning = updateStatus.phase === 'running'

  return (
    <section className={panel} aria-label="データ更新">
      <SectionHeader title="データ更新" />
      <div className={panelBody}>
        <UpdateStatusSummary status={updateStatus} />
        <PrimaryButton
          label="データを更新"
          onClick={onUpdateClick}
          disabled={isRunning}
        />
        {isRunning ? (
          <LoadingBlock
            label={updateStatus.progressLabel ?? 'データを更新しています…'}
          />
        ) : null}
        {updateStatus.phase === 'success' && updateStatus.resultMessage ? (
          <p className="m-0 rounded-md border border-eq-success-border bg-eq-success-bg px-3 py-2.5 text-sm text-eq-success">
            {updateStatus.resultMessage}
          </p>
        ) : null}
        {updateStatus.phase === 'error' && updateStatus.errorMessage ? (
          <ErrorBanner
            message={updateStatus.errorMessage}
            onRetry={onRetry ?? onUpdateClick}
          />
        ) : null}
      </div>
    </section>
  )
}
