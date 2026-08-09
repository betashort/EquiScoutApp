import type { CandidateItem } from '../domain/analysis'
import { FarmAnalysisPanel } from '../panels/FarmAnalysisPanel'
import { FarmSearchPanel } from '../panels/FarmSearchPanel'
import { stack } from '../ui/classes'

export type FarmScreenProps = {
  query: string
  candidates: readonly CandidateItem[]
  selectedId?: string | null
  selectedLabel?: string | null
  isSearching?: boolean
  onQueryChange?: (value: string) => void
  onSelect?: (id: string) => void
}

export function FarmScreen({
  query,
  candidates,
  selectedId,
  selectedLabel,
  isSearching,
  onQueryChange,
  onSelect,
}: FarmScreenProps) {
  return (
    <div className={stack}>
      <FarmSearchPanel
        query={query}
        candidates={candidates}
        selectedId={selectedId}
        isSearching={isSearching}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
      />
      <FarmAnalysisPanel farmName={selectedLabel} />
    </div>
  )
}
