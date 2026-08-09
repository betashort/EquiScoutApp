import { BarChart } from '../components/BarChart'
import { DataTable } from '../components/DataTable'
import { MetricTable } from '../components/MetricTable'
import { RateBadgeRow } from '../components/RateBadgeRow'
import { SectionHeader } from '../components/SectionHeader'
import type { Surface } from '../domain/analysis'
import {
  distanceTableFor,
  MOCK_DISTANCE_DIRT,
  MOCK_DISTANCE_TURF,
  type TrainerAnalysisData,
} from '../domain/mocks'
import { block, blockTitle } from '../ui/classes'
import { cn } from '../ui/cn'

const GRADED_COLUMNS = [
  { key: 'date', label: '日付' },
  { key: 'race', label: 'レース' },
  { key: 'grade', label: 'G' },
  { key: 'horse', label: '馬名' },
  { key: 'place', label: '開催' },
]

const surfaceToggleBtn =
  'min-h-7 cursor-pointer rounded-[calc(0.375rem-1px)] border-0 bg-transparent px-2.5 py-1 text-[0.8125rem] font-semibold text-eq-muted'

export type TrainerAnalysisViewProps = {
  data: TrainerAnalysisData
  surface?: Surface
  onSurfaceChange?: (surface: Surface) => void
  /** ダッシュボード埋め込み時は省略可 */
  showProfileHeader?: boolean
}

export function TrainerAnalysisView({
  data,
  surface = 'turf',
  onSurfaceChange,
  showProfileHeader = true,
}: TrainerAnalysisViewProps) {
  const chartItems = surface === 'turf' ? MOCK_DISTANCE_TURF : MOCK_DISTANCE_DIRT
  const gradedRows = data.gradedWins.map((win) => ({
    date: win.date,
    race: win.race,
    grade: win.grade,
    horse: win.horse,
    place: win.place,
  }))

  return (
    <div className="flex flex-col gap-1">
      {showProfileHeader ? (
        <SectionHeader title={data.trainerName} />
      ) : null}

      <MetricTable title="賞金" data={data.prize} />
      <MetricTable title="着回数" data={data.finishCounts} />

      <div className={block}>
        <h3 className={blockTitle}>率</h3>
        <RateBadgeRow items={data.rates} />
      </div>

      <div className={block}>
        <h3 className={blockTitle}>距離別着回数</h3>
        <div
          className="inline-flex gap-1 rounded-md border border-eq-border bg-eq-surface p-0.5"
          role="group"
          aria-label="馬場"
        >
          <button
            type="button"
            className={cn(
              surfaceToggleBtn,
              surface === 'turf' && 'bg-eq-nav-active text-eq-accent',
            )}
            aria-pressed={surface === 'turf'}
            onClick={() => onSurfaceChange?.('turf')}
          >
            芝
          </button>
          <button
            type="button"
            className={cn(
              surfaceToggleBtn,
              surface === 'dirt' && 'bg-eq-nav-active text-eq-accent',
            )}
            aria-pressed={surface === 'dirt'}
            onClick={() => onSurfaceChange?.('dirt')}
          >
            ダート
          </button>
        </div>
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
          <BarChart items={chartItems} surface={surface} />
          <MetricTable data={distanceTableFor(surface)} />
        </div>
      </div>

      <div className={block}>
        <h3 className={blockTitle}>最近の重賞勝利</h3>
        <DataTable
          columns={GRADED_COLUMNS}
          rows={gradedRows}
          emptyTitle="重賞勝利はありません"
          emptyBody="対象期間に重賞勝利がありません。"
        />
      </div>
    </div>
  )
}
