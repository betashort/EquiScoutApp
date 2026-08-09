import type { ChangeEvent } from 'react'
import { FormField } from '../components/FormField'
import { PrimaryButton } from '../components/PrimaryButton'
import { SecondaryButton } from '../components/SecondaryButton'
import { SectionHeader } from '../components/SectionHeader'
import type { HorseEntryErrors, HorseEntryValues } from '../domain/mocks'
import {
  formActions,
  formStack,
  formStackPair,
  input,
} from '../ui/classes'

export type HorseEntryPanelProps = {
  values: HorseEntryValues
  errors?: HorseEntryErrors
  onChange?: (field: keyof HorseEntryValues, value: string) => void
  onSubmit?: () => void
  onClear?: () => void
}

export function HorseEntryPanel({
  values,
  errors = {},
  onChange,
  onSubmit,
  onClear,
}: HorseEntryPanelProps) {
  const bind = (field: keyof HorseEntryValues) => ({
    value: values[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange?.(field, event.target.value),
  })

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="募集馬の入力">
      <SectionHeader title="募集馬の入力" />
      <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto pr-1">
        <div className={formStack}>
          <FormField label="生年月日" htmlFor="horse-birth" error={errors.birthDate}>
            <input
              id="horse-birth"
              className={input}
              type="date"
              {...bind('birthDate')}
            />
          </FormField>

          <div className={formStackPair}>
            <FormField label="性別" htmlFor="horse-sex" error={errors.sex}>
              <select id="horse-sex" className={input} {...bind('sex')}>
                <option value="">選択</option>
                <option value="牡">牡</option>
                <option value="牝">牝</option>
                <option value="セン">セン</option>
              </select>
            </FormField>
            <FormField label="毛色" htmlFor="horse-color" error={errors.color}>
              <select id="horse-color" className={input} {...bind('color')}>
                <option value="">選択</option>
                <option value="鹿毛">鹿毛</option>
                <option value="黒鹿毛">黒鹿毛</option>
                <option value="栗毛">栗毛</option>
                <option value="青毛">青毛</option>
              </select>
            </FormField>
          </div>

          <FormField label="体重 (kg)" htmlFor="horse-weight" error={errors.weight}>
            <input
              id="horse-weight"
              className={input}
              inputMode="numeric"
              {...bind('weight')}
            />
          </FormField>

          <FormField label="母名" htmlFor="horse-dam" error={errors.damName}>
            <input id="horse-dam" className={input} {...bind('damName')} />
          </FormField>
          <FormField label="父名" htmlFor="horse-sire" error={errors.sireName}>
            <input id="horse-sire" className={input} {...bind('sireName')} />
          </FormField>
          <FormField
            label="調教師"
            htmlFor="horse-trainer"
            error={errors.trainerName}
          >
            <input
              id="horse-trainer"
              className={input}
              {...bind('trainerName')}
            />
          </FormField>
          <FormField label="生産牧場" htmlFor="horse-farm" error={errors.farmName}>
            <input id="horse-farm" className={input} {...bind('farmName')} />
          </FormField>
          <FormField
            label="産地"
            htmlFor="horse-birthplace"
            error={errors.birthplace}
          >
            <input
              id="horse-birthplace"
              className={input}
              {...bind('birthplace')}
            />
          </FormField>
          <FormField label="馬主" htmlFor="horse-owner" error={errors.owner}>
            <input id="horse-owner" className={input} {...bind('owner')} />
          </FormField>
          <FormField
            label="市場取引価格 (円)"
            htmlFor="horse-market"
            error={errors.marketPrice}
          >
            <input
              id="horse-market"
              className={input}
              {...bind('marketPrice')}
            />
          </FormField>

          <div className={formStackPair}>
            <FormField label="1口価格 (円・任意)" htmlFor="horse-share-price">
              <input
                id="horse-share-price"
                className={input}
                {...bind('sharePrice')}
              />
            </FormField>
            <FormField label="口数 (任意)" htmlFor="horse-share-count">
              <input
                id="horse-share-count"
                className={input}
                {...bind('shareCount')}
              />
            </FormField>
          </div>
        </div>
      </div>

      <div className={`${formActions} shrink-0 border-t border-eq-border pt-3`}>
        <SecondaryButton label="クリア" onClick={onClear} />
        <PrimaryButton label="分析を表示" onClick={onSubmit} />
      </div>
    </section>
  )
}
