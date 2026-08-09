import type { DestinationId } from '../domain/navigation'
import { DestinationPanel } from '../panels/DestinationPanel'
import { IntroPanel } from '../panels/IntroPanel'
import { stack } from '../ui/classes'

export type HomeScreenProps = {
  onDestinationSelect?: (id: DestinationId) => void
}

export function HomeScreen({ onDestinationSelect }: HomeScreenProps) {
  return (
    <div className={stack}>
      <IntroPanel />
      <DestinationPanel onSelect={onDestinationSelect} />
    </div>
  )
}
