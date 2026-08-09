import {
  TrainerAnalysisView,
  type TrainerAnalysisViewProps,
} from '../analysis/TrainerAnalysisView'
import { EmptyState } from '../components/EmptyState'
import { ErrorBanner } from '../components/ErrorBanner'
import { LoadingBlock } from '../components/LoadingBlock'
import type { TrainerAnalysisData } from '../domain/mocks'
import { panel } from '../ui/classes'

export type TrainerAnalysisPanelProps = {
  status: 'empty' | 'loading' | 'success' | 'error'
  data?: TrainerAnalysisData | null
  errorMessage?: string
  onRetry?: () => void
} & Pick<TrainerAnalysisViewProps, 'surface' | 'onSurfaceChange' | 'showProfileHeader'>

export function TrainerAnalysisPanel({
  status,
  data,
  errorMessage,
  onRetry,
  surface,
  onSurfaceChange,
  showProfileHeader = true,
}: TrainerAnalysisPanelProps) {
  return (
    <section className={panel} aria-label="調教師分析">
      {status === 'empty' ? (
        <EmptyState
          title="分析対象が未選択です"
          body="上の候補から調教師を選ぶと、賞金・着回・率などを表示します。"
        />
      ) : null}
      {status === 'loading' ? (
        <LoadingBlock label="分析結果を読み込み中…" />
      ) : null}
      {status === 'error' ? (
        <ErrorBanner
          message={errorMessage ?? '分析結果の取得に失敗しました。'}
          onRetry={onRetry}
        />
      ) : null}
      {status === 'success' && data ? (
        <TrainerAnalysisView
          data={data}
          surface={surface}
          onSurfaceChange={onSurfaceChange}
          showProfileHeader={showProfileHeader}
        />
      ) : null}
    </section>
  )
}
