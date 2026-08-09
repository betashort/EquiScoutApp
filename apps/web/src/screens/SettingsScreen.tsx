import type { ConnectionViewModel, UpdateResultViewModel } from '../domain/mocks'
import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { ConnectionPanel } from '../panels/ConnectionPanel'
import { UpdateControlPanel } from '../panels/UpdateControlPanel'
import { UpdateResultPanel } from '../panels/UpdateResultPanel'
import { stack } from '../ui/classes'

export type SettingsScreenProps = {
  updateStatus: UpdateStatusViewModel
  result: UpdateResultViewModel
  connection: ConnectionViewModel
  onUpdateClick?: () => void
  onRetry?: () => void
  onConnectionChange?: (field: keyof ConnectionViewModel, value: string) => void
}

export function SettingsScreen({
  updateStatus,
  result,
  connection,
  onUpdateClick,
  onRetry,
  onConnectionChange,
}: SettingsScreenProps) {
  return (
    <div className={stack}>
      <UpdateControlPanel
        updateStatus={updateStatus}
        onUpdateClick={onUpdateClick}
      />
      <UpdateResultPanel result={result} onRetry={onRetry} />
      <ConnectionPanel values={connection} onChange={onConnectionChange} />
    </div>
  )
}
