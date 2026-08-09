import { PedigreeAnalysisView } from '../analysis/PedigreeAnalysisView'
import { EmptyState } from '../components/EmptyState'
import { panel } from '../ui/classes'

export type PedigreeAnalysisPanelProps = {
  sireName?: string | null
  damName?: string | null
}

export function PedigreeAnalysisPanel({
  sireName,
  damName,
}: PedigreeAnalysisPanelProps) {
  const hasKey = Boolean(sireName || damName)

  return (
    <section className={panel} aria-label="血統分析">
      {hasKey ? (
        <PedigreeAnalysisView sireName={sireName} damName={damName} />
      ) : (
        <EmptyState
          title="血統キーが未入力です"
          body="父名・母名を入れると、準備中の分析枠を表示します。"
        />
      )}
    </section>
  )
}
