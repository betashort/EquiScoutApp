import { PlaceholderPanel } from '../components/PlaceholderPanel'

export type FarmAnalysisViewProps = {
  farmName?: string | null
}

export function FarmAnalysisView({ farmName }: FarmAnalysisViewProps) {
  const title = farmName
    ? `${farmName}（準備中）`
    : '生産牧場分析（準備中）'

  return (
    <PlaceholderPanel
      title={title}
      body="将来ここに本年／累計の賞金・着回数、出身馬リストを表示します。"
    />
  )
}
