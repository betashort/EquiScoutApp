import { useState } from 'react'
import type { DragEvent, KeyboardEvent } from 'react'
import { FarmAnalysisView } from '../analysis/FarmAnalysisView'
import { PedigreeAnalysisView } from '../analysis/PedigreeAnalysisView'
import { TrainerAnalysisView } from '../analysis/TrainerAnalysisView'
import { DragHandle } from '../components/DragHandle'
import { EmptyState } from '../components/EmptyState'
import { SectionHeader } from '../components/SectionHeader'
import {
  DASHBOARD_PANEL_LABELS,
  DEFAULT_DASHBOARD_SLOT_ORDER,
  type AnalysisModuleId,
  type Surface,
} from '../domain/analysis'
import type { HorseEntryValues, TrainerAnalysisData } from '../domain/mocks'
import {
  dashboardGrid,
  dashboardSlot,
  dashboardSlotDropTarget,
} from '../ui/classes'
import { cn } from '../ui/cn'
import { HorseProfilePanel } from './HorseProfilePanel'

export type AnalysisDashboardPanelProps = {
  contextLabel?: string | null
  hasAnalysisTarget: boolean
  entry: HorseEntryValues
  trainerData?: TrainerAnalysisData | null
  farmName?: string | null
  sireName?: string | null
  damName?: string | null
  surface?: Surface
  /** 初期スロット順（以降は画面内 UI 状態。永続化は後続） */
  initialSlotOrder?: readonly AnalysisModuleId[]
  onSlotOrderChange?: (order: AnalysisModuleId[]) => void
  onSurfaceChange?: (surface: Surface) => void
}

function swapSlots(
  order: readonly AnalysisModuleId[],
  fromIndex: number,
  toIndex: number,
): AnalysisModuleId[] {
  if (fromIndex === toIndex) return [...order]
  const next = [...order]
  const tmp = next[fromIndex]!
  next[fromIndex] = next[toIndex]!
  next[toIndex] = tmp
  return next
}

function neighborIndex(fromIndex: number, key: string): number | null {
  const col = fromIndex % 2
  const row = Math.floor(fromIndex / 2)
  switch (key) {
    case 'ArrowLeft':
      return col === 1 ? fromIndex - 1 : null
    case 'ArrowRight':
      return col === 0 ? fromIndex + 1 : null
    case 'ArrowUp':
      return row === 1 ? fromIndex - 2 : null
    case 'ArrowDown':
      return row === 0 ? fromIndex + 2 : null
    default:
      return null
  }
}

export function AnalysisDashboardPanel({
  contextLabel,
  hasAnalysisTarget,
  entry,
  trainerData,
  farmName,
  sireName,
  damName,
  surface = 'turf',
  initialSlotOrder = DEFAULT_DASHBOARD_SLOT_ORDER,
  onSlotOrderChange,
  onSurfaceChange,
}: AnalysisDashboardPanelProps) {
  const [slotOrder, setSlotOrder] = useState<AnalysisModuleId[]>(() => [
    ...initialSlotOrder,
  ])
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
  const [dropOverIndex, setDropOverIndex] = useState<number | null>(null)

  const moveSlot = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= slotOrder.length) return
    const next = swapSlots(slotOrder, fromIndex, toIndex)
    setSlotOrder(next)
    onSlotOrderChange?.(next)
  }

  const renderPanel = (moduleId: AnalysisModuleId) => {
    switch (moduleId) {
      case 'horse':
        return <HorseProfilePanel values={entry} showSectionHeader={false} />
      case 'trainer':
        return trainerData ? (
          <TrainerAnalysisView
            data={trainerData}
            surface={surface}
            onSurfaceChange={onSurfaceChange}
            showProfileHeader={false}
          />
        ) : (
          <EmptyState
            title="調教師データがありません"
            body="入力の調教師に対応する分析結果を表示します。"
          />
        )
      case 'farm':
        return <FarmAnalysisView farmName={farmName} />
      case 'pedigree':
        return <PedigreeAnalysisView sireName={sireName} damName={damName} />
    }
  }

  return (
    <section className="flex min-h-0 flex-col" aria-label="分析">
      <SectionHeader title="分析" />
      <div className="mb-3.5 flex flex-wrap items-center gap-2.5 border-b border-eq-border pb-3">
        {contextLabel ? (
          <p className="m-0 text-sm text-eq-muted">対象: {contextLabel}</p>
        ) : null}
      </div>

      {!hasAnalysisTarget ? (
        <EmptyState
          title="分析を表示してください"
          body="必須項目を入力して「分析を表示」を押すと、ここに結果が出ます。"
        />
      ) : (
        <div className={dashboardGrid} role="list" aria-label="分析パネル">
          {slotOrder.map((moduleId, index) => {
            const label = DASHBOARD_PANEL_LABELS[moduleId]
            return (
              <div
                key={moduleId}
                role="listitem"
                className={cn(
                  dashboardSlot,
                  dropOverIndex === index &&
                    dragFromIndex !== null &&
                    dragFromIndex !== index &&
                    dashboardSlotDropTarget,
                )}
                onDragOver={(event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault()
                  event.dataTransfer.dropEffect = 'move'
                  setDropOverIndex(index)
                }}
                onDragLeave={() => {
                  setDropOverIndex((current) =>
                    current === index ? null : current,
                  )
                }}
                onDrop={(event: DragEvent<HTMLDivElement>) => {
                  event.preventDefault()
                  const fromRaw = event.dataTransfer.getData('text/plain')
                  const fromIndex = Number.parseInt(fromRaw, 10)
                  if (!Number.isNaN(fromIndex)) {
                    moveSlot(fromIndex, index)
                  }
                  setDragFromIndex(null)
                  setDropOverIndex(null)
                }}
              >
                <div className="mb-2 flex items-center gap-1">
                  <DragHandle
                    label={label}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move'
                      event.dataTransfer.setData('text/plain', String(index))
                      setDragFromIndex(index)
                    }}
                    onDragEnd={() => {
                      setDragFromIndex(null)
                      setDropOverIndex(null)
                    }}
                    onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
                      const target = neighborIndex(index, event.key)
                      if (target === null) return
                      event.preventDefault()
                      moveSlot(index, target)
                    }}
                  />
                  <h3 className="m-0 text-[0.9375rem] font-semibold text-eq-ink">
                    {label}
                  </h3>
                </div>
                <div className="min-h-0 min-w-0 overflow-auto">
                  {renderPanel(moduleId)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
