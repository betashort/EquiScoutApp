import { EntitySearchBox } from '../components/EntitySearchBox'
import { SectionHeader } from '../components/SectionHeader'
import { formGrid2, panel, panelBody } from '../ui/classes'

export type PedigreeKeyPanelProps = {
  sireName: string
  damName: string
  onSireChange?: (value: string) => void
  onDamChange?: (value: string) => void
}

export function PedigreeKeyPanel({
  sireName,
  damName,
  onSireChange,
  onDamChange,
}: PedigreeKeyPanelProps) {
  return (
    <section className={panel} aria-label="血統キー">
      <SectionHeader title="血統キー" />
      <div className={panelBody}>
        <div className={formGrid2}>
          <EntitySearchBox
            label="父名"
            value={sireName}
            placeholder="父名を入力"
            onChange={onSireChange}
          />
          <EntitySearchBox
            label="母名"
            value={damName}
            placeholder="母名を入力"
            onChange={onDamChange}
          />
        </div>
      </div>
    </section>
  )
}
