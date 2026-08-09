import { FarmAnalysisView } from '../analysis/FarmAnalysisView'
import { EmptyState } from '../components/EmptyState'
import { panel } from '../ui/classes'

export type FarmAnalysisPanelProps = {
  farmName?: string | null
}

export function FarmAnalysisPanel({ farmName }: FarmAnalysisPanelProps) {
  return (
    <section className={panel} aria-label="生産牧場分析">
      {farmName ? (
        <FarmAnalysisView farmName={farmName} />
      ) : (
        <EmptyState
          title="分析対象が未選択です"
          body="上の候補から生産牧場を選ぶと、準備中の分析枠を表示します。"
        />
      )}
    </section>
  )
}
