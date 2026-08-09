import { SectionHeader } from '../components/SectionHeader'
import type { HorseEntryValues } from '../domain/mocks'
import { block, blockTitle, label as labelClass } from '../ui/classes'

export type HorseProfilePanelProps = {
  values: HorseEntryValues
  /** ダッシュボード埋め込み時はセル見出し側に任せる */
  showSectionHeader?: boolean
}

function display(value: string, suffix = ''): string {
  if (!value.trim()) return '—'
  return suffix ? `${value}${suffix}` : value
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <dt className={labelClass}>{label}</dt>
      <dd className="m-0 text-sm text-eq-ink">{value}</dd>
    </div>
  )
}

export function HorseProfilePanel({
  values,
  showSectionHeader = true,
}: HorseProfilePanelProps) {
  return (
    <div aria-label="募集馬">
      {showSectionHeader ? <SectionHeader title="募集馬" /> : null}

      <section className={block} aria-labelledby="horse-profile-block">
        <h3 id="horse-profile-block" className={blockTitle}>
          プロフィール
        </h3>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <Field label="生年月日" value={display(values.birthDate)} />
          <Field label="性別" value={display(values.sex)} />
          <Field label="毛色" value={display(values.color)} />
          <Field label="体重" value={display(values.weight, ' kg')} />
        </dl>
      </section>

      <section className={block} aria-labelledby="horse-pedigree-block">
        <h3 id="horse-pedigree-block" className={blockTitle}>
          血統キー
        </h3>
        <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field label="母名" value={display(values.damName)} />
          <Field label="父名" value={display(values.sireName)} />
        </dl>
      </section>

      <section className={block} aria-labelledby="horse-relations-block">
        <h3 id="horse-relations-block" className={blockTitle}>
          関係者
        </h3>
        <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <Field label="調教師" value={display(values.trainerName)} />
          <Field label="生産牧場" value={display(values.farmName)} />
          <Field label="産地" value={display(values.birthplace)} />
          <Field label="馬主" value={display(values.owner)} />
        </dl>
      </section>

      <section className={block} aria-labelledby="horse-price-block">
        <h3 id="horse-price-block" className={blockTitle}>
          価格
        </h3>
        <dl className="m-0 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
          <Field
            label="市場取引価格"
            value={
              values.marketPrice.trim()
                ? `${values.marketPrice}円`
                : '—'
            }
          />
          <Field
            label="1口価格（任意）"
            value={
              values.sharePrice.trim() ? `${values.sharePrice}円` : '—'
            }
          />
          <Field label="口数（任意）" value={display(values.shareCount)} />
        </dl>
      </section>
    </div>
  )
}
