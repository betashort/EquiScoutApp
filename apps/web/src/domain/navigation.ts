/** 画面インベントリ順（UI_design.md §2.1）。複数頭比較は除外。 */
export type NavId =
  | 'home'
  | 'horse'
  | 'trainer'
  | 'farm'
  | 'pedigree'
  | 'settings'

export type NavItem = {
  id: NavId
  label: string
}

export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'home', label: 'ホーム' },
  { id: 'horse', label: '募集馬' },
  { id: 'trainer', label: '調教師' },
  { id: 'farm', label: '生産牧場' },
  { id: 'pedigree', label: '血統' },
  { id: 'settings', label: '設定' },
] as const

export type DestinationId = Exclude<NavId, 'home'>

export type DestinationCard = {
  id: DestinationId
  label: string
  description: string
}

/** ホーム遷移カード。ナビ順どおり（ホーム自身は含めない）。 */
export const DESTINATION_CARDS: readonly DestinationCard[] = [
  {
    id: 'horse',
    label: '募集馬を分析する',
    description: '入力→ダッシュボード（調教師・牧場・血統を共用）',
  },
  {
    id: 'trainer',
    label: '調教師を調べる',
    description: '本線・実データ',
  },
  {
    id: 'farm',
    label: '生産牧場を調べる',
    description: '準備中（骨格）',
  },
  {
    id: 'pedigree',
    label: '血統を調べる',
    description: '準備中（骨格）',
  },
  {
    id: 'settings',
    label: '設定・データ詳細',
    description: '接続設定・詳細結果',
  },
] as const
