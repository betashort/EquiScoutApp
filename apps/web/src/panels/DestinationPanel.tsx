import { NavCard } from '../components/NavCard'
import { SectionHeader } from '../components/SectionHeader'
import {
  DESTINATION_CARDS,
  type DestinationCard,
  type DestinationId,
} from '../domain/navigation'
import { panel } from '../ui/classes'

type DestinationPanelProps = {
  destinations?: readonly DestinationCard[]
  onSelect?: (id: DestinationId) => void
}

export function DestinationPanel({
  destinations = DESTINATION_CARDS,
  onSelect,
}: DestinationPanelProps) {
  return (
    <section className={panel} aria-label="分析・設定へ">
      <SectionHeader title="分析・設定へ" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {destinations.map((item) => (
          <NavCard
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  )
}
