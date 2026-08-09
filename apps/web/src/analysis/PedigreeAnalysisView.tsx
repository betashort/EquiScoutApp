import { PlaceholderPanel } from '../components/PlaceholderPanel'

export type PedigreeAnalysisViewProps = {
  sireName?: string | null
  damName?: string | null
}

export function PedigreeAnalysisView({
  sireName,
  damName,
}: PedigreeAnalysisViewProps) {
  const keys = [sireName, damName].filter(Boolean).join(' × ')
  const title = keys
    ? `${keys}（準備中）`
    : '血統分析（準備中）'

  return (
    <PlaceholderPanel
      title={title}
      body="将来ここに距離適性（SMILE）／馬場適性／兄弟成績を表示します。"
    />
  )
}
