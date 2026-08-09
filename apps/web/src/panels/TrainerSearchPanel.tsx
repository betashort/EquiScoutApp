import { CandidateList } from '../components/CandidateList'
import { EmptyState } from '../components/EmptyState'
import { EntitySearchBox } from '../components/EntitySearchBox'
import { LoadingBlock } from '../components/LoadingBlock'
import { SectionHeader } from '../components/SectionHeader'
import type { CandidateItem } from '../domain/analysis'
import { panel, panelBody } from '../ui/classes'

export type TrainerSearchPanelProps = {
  query: string
  candidates: readonly CandidateItem[]
  selectedId?: string | null
  isSearching?: boolean
  onQueryChange?: (value: string) => void
  onSelect?: (id: string) => void
}

export function TrainerSearchPanel({
  query,
  candidates,
  selectedId,
  isSearching = false,
  onQueryChange,
  onSelect,
}: TrainerSearchPanelProps) {
  const showEmptyGuide = !query && candidates.length === 0 && !isSearching
  const showZero = Boolean(query) && candidates.length === 0 && !isSearching

  return (
    <section className={panel} aria-label="調教師を探す">
      <SectionHeader title="調教師を探す" />
      <div className={panelBody}>
        <EntitySearchBox
          label="名前"
          value={query}
          placeholder="調教師名を入力"
          onChange={onQueryChange}
        />
        {isSearching ? <LoadingBlock label="検索中…" /> : null}
        {showEmptyGuide ? (
          <EmptyState
            title="調教師が未選択です"
            body="名前で検索して候補から選ぶと、成績指標を表示します。"
          />
        ) : null}
        {showZero ? (
          <EmptyState
            title="候補がありません"
            body="別の表記や一部の文字で再検索してください。"
          />
        ) : null}
        {!isSearching && candidates.length > 0 ? (
          <CandidateList
            items={[...candidates]}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ) : null}
      </div>
    </section>
  )
}
