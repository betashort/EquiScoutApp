import type {
  BarChartItem,
  CandidateItem,
  GradedWinRow,
  MetricTableViewModel,
  RateBadge,
  Surface,
} from './analysis'
import type { UpdateStatusViewModel } from './updateStatus'
import {
  UPDATE_STATUS_ERROR,
  UPDATE_STATUS_IDLE,
  UPDATE_STATUS_RUNNING,
  UPDATE_STATUS_SUCCESS,
} from './updateStatus'

export const TRAINER_CANDIDATES: readonly CandidateItem[] = [
  { id: 't1', label: '藤沢和雄 調教師' },
  { id: 't2', label: '国枝栄 調教師' },
  { id: 't3', label: '友道康夫 調教師' },
] as const

export const FARM_CANDIDATES: readonly CandidateItem[] = [
  { id: 'f1', label: 'ノーザンファーム' },
  { id: 'f2', label: '社台ファーム' },
  { id: 'f3', label: '追分ファーム' },
] as const

export const SIRE_CANDIDATES: readonly CandidateItem[] = [
  { id: 's1', label: 'ディープインパクト' },
  { id: 's2', label: 'キズナ' },
] as const

export const DAM_CANDIDATES: readonly CandidateItem[] = [
  { id: 'd1', label: 'ウインドインハーヘア' },
  { id: 'd2', label: 'シーザリオ' },
] as const

export const MOCK_PRIZE_TABLE: MetricTableViewModel = {
  columns: ['本年', '前年', '累計'],
  rows: [
    { label: '本賞金', values: ['128,400,000円', '96,200,000円', '1,842,500,000円'] },
    { label: '付加賞金', values: ['18,600,000円', '14,100,000円', '221,800,000円'] },
  ],
}

export const MOCK_FINISH_TABLE: MetricTableViewModel = {
  columns: ['本年', '前年', '累計'],
  rows: [
    { label: '1着', values: ['42', '38', '612'] },
    { label: '2着', values: ['31', '29', '448'] },
    { label: '3着', values: ['28', '24', '391'] },
    { label: '4着', values: ['22', '19', '302'] },
    { label: '5着', values: ['18', '17', '271'] },
    { label: '着外', values: ['96', '88', '1,420'] },
  ],
}

export const MOCK_RATES: readonly RateBadge[] = [
  { label: '勝率', value: '17.8%', period: '本年' },
  { label: '連対率', value: '30.9%', period: '本年' },
  { label: '複勝率', value: '42.8%', period: '本年' },
  { label: '勝率', value: '18.2%', period: '累計' },
  { label: '連対率', value: '31.5%', period: '累計' },
  { label: '複勝率', value: '43.1%', period: '累計' },
] as const

export const MOCK_DISTANCE_TURF: readonly BarChartItem[] = [
  { label: '〜1400', value: 18, displayValue: '18' },
  { label: '1401-1600', value: 34, displayValue: '34' },
  { label: '1601-1800', value: 41, displayValue: '41' },
  { label: '1801-2000', value: 52, displayValue: '52' },
  { label: '2001-2200', value: 29, displayValue: '29' },
  { label: '2201〜', value: 14, displayValue: '14' },
] as const

export const MOCK_DISTANCE_DIRT: readonly BarChartItem[] = [
  { label: '〜1400', value: 22, displayValue: '22' },
  { label: '1401-1600', value: 27, displayValue: '27' },
  { label: '1601-1800', value: 19, displayValue: '19' },
  { label: '1801-2000', value: 11, displayValue: '11' },
  { label: '2001〜', value: 6, displayValue: '6' },
] as const

export function distanceTableFor(surface: Surface): MetricTableViewModel {
  const items = surface === 'turf' ? MOCK_DISTANCE_TURF : MOCK_DISTANCE_DIRT
  return {
    columns: ['着回数'],
    rows: items.map((item) => ({
      label: item.label,
      values: [item.displayValue],
    })),
  }
}

export const MOCK_GRADED_WINS: readonly GradedWinRow[] = [
  {
    id: 'g1',
    date: '2026-05-31',
    race: '東京優駿',
    grade: 'G1',
    horse: 'サンプルステイ',
    place: '東京',
  },
  {
    id: 'g2',
    date: '2026-04-12',
    race: '桜花賞',
    grade: 'G1',
    horse: 'サンプルローズ',
    place: '阪神',
  },
  {
    id: 'g3',
    date: '2026-03-01',
    race: 'チューリップ賞',
    grade: 'G2',
    horse: 'サンプルローズ',
    place: '阪神',
  },
] as const

export type TrainerAnalysisData = {
  trainerName: string
  prize: MetricTableViewModel
  finishCounts: MetricTableViewModel
  rates: readonly RateBadge[]
  gradedWins: readonly GradedWinRow[]
}

export const MOCK_TRAINER_ANALYSIS: TrainerAnalysisData = {
  trainerName: '藤沢和雄 調教師',
  prize: MOCK_PRIZE_TABLE,
  finishCounts: MOCK_FINISH_TABLE,
  rates: MOCK_RATES,
  gradedWins: MOCK_GRADED_WINS,
}

export type HorseEntryValues = {
  birthDate: string
  sex: string
  color: string
  weight: string
  damName: string
  sireName: string
  trainerName: string
  farmName: string
  birthplace: string
  owner: string
  marketPrice: string
  sharePrice: string
  shareCount: string
}

export type HorseEntryErrors = Partial<Record<keyof HorseEntryValues, string>>

export const EMPTY_HORSE_ENTRY: HorseEntryValues = {
  birthDate: '',
  sex: '',
  color: '',
  weight: '',
  damName: '',
  sireName: '',
  trainerName: '',
  farmName: '',
  birthplace: '',
  owner: '',
  marketPrice: '',
  sharePrice: '',
  shareCount: '',
}

export const FILLED_HORSE_ENTRY: HorseEntryValues = {
  birthDate: '2024-03-12',
  sex: '牡',
  color: '鹿毛',
  weight: '486',
  damName: 'ウインドインハーヘア',
  sireName: 'ディープインパクト',
  trainerName: '藤沢和雄 調教師',
  farmName: 'ノーザンファーム',
  birthplace: '安平町',
  owner: 'サンプルオーナー',
  marketPrice: '35,000,000',
  sharePrice: '350,000',
  shareCount: '100',
}

export const HORSE_ENTRY_VALIDATION_ERRORS: HorseEntryErrors = {
  birthDate: '生年月日を入力してください',
  sex: '性別を選択してください',
  marketPrice: '市場取引価格を入力してください',
  trainerName: '調教師を選択してください',
}

export type UpdateResultViewModel = {
  syncCount: string
  analyzeCount: string
  duration: string
  lastUpdatedAt: string | null
  errorMessage?: string
}

export const UPDATE_RESULT_SUCCESS: UpdateResultViewModel = {
  syncCount: '12,480 件',
  analyzeCount: '3,210 件',
  duration: '4分12秒',
  lastUpdatedAt: '2026-08-09 19:12',
}

export const UPDATE_RESULT_ERROR: UpdateResultViewModel = {
  syncCount: '—',
  analyzeCount: '—',
  duration: '—',
  lastUpdatedAt: '2026-08-08 18:40',
  errorMessage: 'PostgreSQL への接続に失敗しました。接続設定を確認してください。',
}

export const UPDATE_RESULT_IDLE: UpdateResultViewModel = {
  syncCount: '—',
  analyzeCount: '—',
  duration: '—',
  lastUpdatedAt: '2026-08-08 18:40',
}

export type ConnectionViewModel = {
  host: string
  port: string
  database: string
  user: string
  password: string
  sqlitePath: string
}

export const MOCK_CONNECTION: ConnectionViewModel = {
  host: '127.0.0.1',
  port: '5432',
  database: 'jvd',
  user: 'equiscout',
  password: '********',
  sqlitePath: 'C:\\Users\\betashort\\AppData\\EquiScout\\analysis.sqlite',
}

export function updateStatusForSettings(
  phase: UpdateStatusViewModel['phase'],
): UpdateStatusViewModel {
  switch (phase) {
    case 'running':
      return UPDATE_STATUS_RUNNING
    case 'success':
      return UPDATE_STATUS_SUCCESS
    case 'error':
      return UPDATE_STATUS_ERROR
    default:
      return UPDATE_STATUS_IDLE
  }
}
