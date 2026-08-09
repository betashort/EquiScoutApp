import type { AnalysisModuleId, Surface } from '../domain/analysis'
import type {
  HorseEntryErrors,
  HorseEntryValues,
  TrainerAnalysisData,
} from '../domain/mocks'
import { AnalysisDashboardPanel } from '../panels/AnalysisDashboardPanel'
import { HorseEntryPanel } from '../panels/HorseEntryPanel'
import { stack } from '../ui/classes'

export type HorseScreenProps = {
  entry: HorseEntryValues
  entryErrors?: HorseEntryErrors
  moduleId: AnalysisModuleId
  hasAnalysisTarget: boolean
  trainerData?: TrainerAnalysisData | null
  surface?: Surface
  onEntryChange?: (field: keyof HorseEntryValues, value: string) => void
  onSubmit?: () => void
  onClear?: () => void
  onModuleChange?: (id: AnalysisModuleId) => void
  onSurfaceChange?: (surface: Surface) => void
}

export function HorseScreen({
  entry,
  entryErrors,
  moduleId,
  hasAnalysisTarget,
  trainerData,
  surface,
  onEntryChange,
  onSubmit,
  onClear,
  onModuleChange,
  onSurfaceChange,
}: HorseScreenProps) {
  const contextLabel =
    moduleId === 'trainer'
      ? entry.trainerName || null
      : moduleId === 'farm'
        ? entry.farmName || null
        : moduleId === 'pedigree'
          ? [entry.sireName, entry.damName].filter(Boolean).join(' × ') || null
          : '類似馬'

  return (
    <div className={stack}>
      <HorseEntryPanel
        values={entry}
        errors={entryErrors}
        onChange={onEntryChange}
        onSubmit={onSubmit}
        onClear={onClear}
      />
      <AnalysisDashboardPanel
        moduleId={moduleId}
        contextLabel={contextLabel}
        hasAnalysisTarget={hasAnalysisTarget}
        trainerData={trainerData}
        farmName={entry.farmName}
        sireName={entry.sireName}
        damName={entry.damName}
        surface={surface}
        onModuleChange={onModuleChange}
        onSurfaceChange={onSurfaceChange}
      />
    </div>
  )
}
