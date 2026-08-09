import type { AnalysisModuleId, Surface } from '../domain/analysis'
import type {
  HorseEntryErrors,
  HorseEntryValues,
  TrainerAnalysisData,
} from '../domain/mocks'
import { AnalysisDashboardPanel } from '../panels/AnalysisDashboardPanel'
import { HorseEntryPanel } from '../panels/HorseEntryPanel'
import {
  btnSecondary,
  horseDashboard,
  horseLayout,
  horseSidebar,
  horseSidebarRail,
} from '../ui/classes'
import { cn } from '../ui/cn'

export type HorseScreenProps = {
  entry: HorseEntryValues
  entryErrors?: HorseEntryErrors
  hasAnalysisTarget: boolean
  entrySidebarOpen?: boolean
  trainerData?: TrainerAnalysisData | null
  surface?: Surface
  initialSlotOrder?: readonly AnalysisModuleId[]
  onEntryChange?: (field: keyof HorseEntryValues, value: string) => void
  onSubmit?: () => void
  onClear?: () => void
  onSurfaceChange?: (surface: Surface) => void
  onSlotOrderChange?: (order: AnalysisModuleId[]) => void
  onEntrySidebarOpenChange?: (open: boolean) => void
}

function contextLabelFor(entry: HorseEntryValues): string {
  return (
    [entry.sireName, entry.damName].filter(Boolean).join(' × ') || '入力中の馬'
  )
}

export function HorseScreen({
  entry,
  entryErrors,
  hasAnalysisTarget,
  entrySidebarOpen = true,
  trainerData,
  surface,
  initialSlotOrder,
  onEntryChange,
  onSubmit,
  onClear,
  onSurfaceChange,
  onSlotOrderChange,
  onEntrySidebarOpenChange,
}: HorseScreenProps) {
  const contextLabel = hasAnalysisTarget ? contextLabelFor(entry) : null

  return (
    <div className={horseLayout}>
      {entrySidebarOpen ? (
        <aside className={horseSidebar} aria-label="入力サイドバー">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              className={cn(btnSecondary, 'min-h-8 px-2.5 py-1 text-xs')}
              aria-expanded={true}
              aria-controls="horse-entry-sidebar"
              onClick={() => onEntrySidebarOpenChange?.(false)}
            >
              閉じる
            </button>
          </div>
          <div id="horse-entry-sidebar" className="flex min-h-0 flex-1 flex-col">
            <HorseEntryPanel
              values={entry}
              errors={entryErrors}
              onChange={onEntryChange}
              onSubmit={onSubmit}
              onClear={onClear}
            />
          </div>
        </aside>
      ) : (
        <aside className={horseSidebarRail} aria-label="入力サイドバー（折りたたみ）">
          <button
            type="button"
            className="flex w-full flex-1 cursor-pointer flex-col items-center gap-2 border-0 bg-transparent px-1 py-3 text-eq-muted hover:bg-eq-accent-soft hover:text-eq-ink"
            aria-expanded={false}
            onClick={() => onEntrySidebarOpenChange?.(true)}
          >
            <span className="text-base leading-none" aria-hidden>
              ›
            </span>
            <span className="text-[0.6875rem] font-semibold tracking-wide [writing-mode:vertical-rl]">
              入力
            </span>
          </button>
        </aside>
      )}

      <div className={horseDashboard}>
        <AnalysisDashboardPanel
          key={(initialSlotOrder ?? []).join(',') || 'default'}
          contextLabel={contextLabel}
          hasAnalysisTarget={hasAnalysisTarget}
          entry={entry}
          trainerData={trainerData}
          farmName={entry.farmName}
          sireName={entry.sireName}
          damName={entry.damName}
          surface={surface}
          initialSlotOrder={initialSlotOrder}
          onSlotOrderChange={onSlotOrderChange}
          onSurfaceChange={onSurfaceChange}
        />
      </div>
    </div>
  )
}
