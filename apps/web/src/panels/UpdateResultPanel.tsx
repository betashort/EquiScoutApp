import { ErrorBanner } from '../components/ErrorBanner'
import { SectionHeader } from '../components/SectionHeader'
import type { UpdateResultViewModel } from '../domain/mocks'
import { formatLastUpdated } from '../domain/updateStatus'
import { panel, panelBody } from '../ui/classes'

export type UpdateResultPanelProps = {
  result: UpdateResultViewModel
  onRetry?: () => void
}

export function UpdateResultPanel({ result, onRetry }: UpdateResultPanelProps) {
  return (
    <section className={panel} aria-label="更新結果">
      <SectionHeader title="更新結果" />
      <div className={panelBody}>
        {result.errorMessage ? (
          <ErrorBanner message={result.errorMessage} onRetry={onRetry} />
        ) : null}
        <dl className="m-0 grid grid-cols-[8rem_1fr] gap-x-3 gap-y-1.5 text-sm">
          <dt className="m-0 font-semibold text-eq-muted">同期件数</dt>
          <dd className="m-0 text-eq-ink">{result.syncCount}</dd>
          <dt className="m-0 font-semibold text-eq-muted">分析件数</dt>
          <dd className="m-0 text-eq-ink">{result.analyzeCount}</dd>
          <dt className="m-0 font-semibold text-eq-muted">所要時間</dt>
          <dd className="m-0 text-eq-ink">{result.duration}</dd>
          <dt className="m-0 font-semibold text-eq-muted">最終更新</dt>
          <dd className="m-0 text-eq-ink">
            {formatLastUpdated(result.lastUpdatedAt).replace('最終更新: ', '')}
          </dd>
        </dl>
      </div>
    </section>
  )
}
