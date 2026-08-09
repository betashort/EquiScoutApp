export type AnalysisModuleId = 'trainer' | 'farm' | 'pedigree' | 'similarity'

export type AnalysisTypeOption = {
  id: AnalysisModuleId
  label: string
}

/** strength_cost は載せない（情報設計） */
export const ANALYSIS_TYPE_OPTIONS: readonly AnalysisTypeOption[] = [
  { id: 'trainer', label: '調教師分析' },
  { id: 'farm', label: '生産牧場分析' },
  { id: 'pedigree', label: '血統分析' },
  { id: 'similarity', label: '類似馬' },
] as const

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
