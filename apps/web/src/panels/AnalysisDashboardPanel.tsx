import { FarmAnalysisView } from '../analysis/FarmAnalysisView'
import { PedigreeAnalysisView } from '../analysis/PedigreeAnalysisView'
import { SimilarityPanel } from '../analysis/SimilarityPanel'
import { TrainerAnalysisView } from '../analysis/TrainerAnalysisView'
import { AnalysisTypeSelect } from '../components/AnalysisTypeSelect'
import { EmptyState } from '../components/EmptyState'
import { SectionHeader } from '../components/SectionHeader'
import type { AnalysisModuleId, Surface } from '../domain/analysis'
import type { TrainerAnalysisData } from '../domain/mocks'
import { panel } from '../ui/classes'

export type AnalysisDashboardPanelProps = {
  moduleId: AnalysisModuleId
  contextLabel?: string | null
  hasAnalysisTarget: boolean
  trainerData?: TrainerAnalysisData | null
  farmName?: string | null
  sireName?: string | null
  damName?: string | null
  surface?: Surface
  onModuleChange?: (id: AnalysisModuleId) => void
  onSurfaceChange?: (surface: Surface) => void
}

export function AnalysisDashboardPanel({
  moduleId,
  contextLabel,
  hasAnalysisTarget,
  trainerData,
  farmName,
  sireName,
  damName,
  surface = 'turf',
  onModuleChange,
  onSurfaceChange,
}: AnalysisDashboardPanelProps) {
  return (
    <section className={panel} aria-label="分析">
      <SectionHeader title="分析" />
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-eq-border pb-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <AnalysisTypeSelect value={moduleId} onChange={onModuleChange} />
          {contextLabel ? (
            <p className="m-0 text-sm text-eq-muted">対象: {contextLabel}</p>
          ) : null}
        </div>
      </div>

      {!hasAnalysisTarget ? (
        <EmptyState
          title="分析を表示してください"
          body="必須項目を入力して「分析を表示」を押すと、ここに結果が出ます。"
        />
      ) : null}

      {hasAnalysisTarget && moduleId === 'trainer' && trainerData ? (
        <TrainerAnalysisView
          data={trainerData}
          surface={surface}
          onSurfaceChange={onSurfaceChange}
          showProfileHeader={false}
        />
      ) : null}

      {hasAnalysisTarget && moduleId === 'farm' ? (
        <FarmAnalysisView farmName={farmName} />
      ) : null}

      {hasAnalysisTarget && moduleId === 'pedigree' ? (
        <PedigreeAnalysisView sireName={sireName} damName={damName} />
      ) : null}

      {hasAnalysisTarget && moduleId === 'similarity' ? (
        <SimilarityPanel />
      ) : null}
    </section>
  )
}
