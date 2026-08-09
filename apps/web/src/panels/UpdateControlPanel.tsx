import { LoadingBlock } from '../components/LoadingBlock'
import { PrimaryButton } from '../components/PrimaryButton'
import { SectionHeader } from '../components/SectionHeader'
import { UpdateStatusSummary } from '../components/UpdateStatusSummary'
import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { panel, panelBody } from '../ui/classes'

export type UpdateControlPanelProps = {
  updateStatus: UpdateStatusViewModel
  onUpdateClick?: () => void
}

export function UpdateControlPanel({
  updateStatus,
  onUpdateClick,
}: UpdateControlPanelProps) {
  const isRunning = updateStatus.phase === 'running'

  return (
    <section className={panel} aria-label="更新の実行">
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
            label={updateStatus.progressLabel ?? 'Sync → Analyze を実行中…'}
          />
        ) : null}
      </div>
    </section>
  )
}
