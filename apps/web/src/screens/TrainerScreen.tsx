import type { CandidateItem, Surface } from '../domain/analysis'
import type { TrainerAnalysisData } from '../domain/mocks'
import { TrainerAnalysisPanel } from '../panels/TrainerAnalysisPanel'
import { TrainerSearchPanel } from '../panels/TrainerSearchPanel'
import { stack } from '../ui/classes'

export type TrainerScreenProps = {
  query: string
  candidates: readonly CandidateItem[]
  selectedId?: string | null
  isSearching?: boolean
  analysisStatus: 'empty' | 'loading' | 'success' | 'error'
  analysisData?: TrainerAnalysisData | null
  analysisError?: string
  surface?: Surface
  onQueryChange?: (value: string) => void
  onSelect?: (id: string) => void
  onSurfaceChange?: (surface: Surface) => void
  onRetry?: () => void
}

export function TrainerScreen({
  query,
  candidates,
  selectedId,
  isSearching,
  analysisStatus,
  analysisData,
  analysisError,
  surface,
  onQueryChange,
  onSelect,
  onSurfaceChange,
  onRetry,
}: TrainerScreenProps) {
  return (
    <div className={stack}>
      <TrainerSearchPanel
        query={query}
        candidates={candidates}
        selectedId={selectedId}
        isSearching={isSearching}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
      />
      <TrainerAnalysisPanel
        status={analysisStatus}
        data={analysisData}
        errorMessage={analysisError}
        surface={surface}
        onSurfaceChange={onSurfaceChange}
        onRetry={onRetry}
      />
    </div>
  )
}
