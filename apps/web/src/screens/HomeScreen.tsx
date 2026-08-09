import type { DestinationId } from '../domain/navigation'
import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { DestinationPanel } from '../panels/DestinationPanel'
import { HomeUpdatePanel } from '../panels/HomeUpdatePanel'
import { IntroPanel } from '../panels/IntroPanel'
import { stack } from '../ui/classes'

export type HomeScreenProps = {
  updateStatus: UpdateStatusViewModel
  onDestinationSelect?: (id: DestinationId) => void
  onUpdateClick?: () => void
  onRetry?: () => void
}

export function HomeScreen({
  updateStatus,
  onDestinationSelect,
  onUpdateClick,
  onRetry,
}: HomeScreenProps) {
  return (
    <div className={stack}>
      <IntroPanel />
      <DestinationPanel onSelect={onDestinationSelect} />
      <HomeUpdatePanel
        updateStatus={updateStatus}
        onUpdateClick={onUpdateClick}
        onRetry={onRetry}
      />
    </div>
  )
}
