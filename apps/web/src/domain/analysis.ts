export type AnalysisModuleId = 'horse' | 'trainer' | 'farm' | 'pedigree'

export type AnalysisTypeOption = {
  id: AnalysisModuleId
  label: string
}

/** similarity / strength_cost は載せない（情報設計） */
export const ANALYSIS_TYPE_OPTIONS: readonly AnalysisTypeOption[] = [
  { id: 'horse', label: '募集馬' },
  { id: 'trainer', label: '調教師分析' },
  { id: 'farm', label: '生産牧場分析' },
  { id: 'pedigree', label: '血統分析' },
] as const

/** ダッシュボード 2×2 の既定スロット順（左上→右上→左下→右下） */
export const DEFAULT_DASHBOARD_SLOT_ORDER: readonly AnalysisModuleId[] = [
  'horse',
  'trainer',
  'farm',
  'pedigree',
] as const

export const DASHBOARD_PANEL_LABELS: Record<AnalysisModuleId, string> = {
  horse: '募集馬',
  trainer: '調教師',
  farm: '生産牧場',
  pedigree: '血統',
}

export type Surface = 'turf' | 'dirt'

export type CandidateItem = {
  id: string
  label: string
}

export type MetricTableViewModel = {
  columns: string[]
  rows: { label: string; values: string[] }[]
}

export type RateBadge = {
  label: string
  value: string
  period: string
}

export type BarChartItem = {
  label: string
  value: number
  displayValue: string
}

export type DataTableColumn = {
  key: string
  label: string
}

export type GradedWinRow = {
  id: string
  date: string
  race: string
  grade: string
  horse: string
  place: string
}
