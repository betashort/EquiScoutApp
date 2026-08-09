import { PedigreeAnalysisPanel } from '../panels/PedigreeAnalysisPanel'
import { PedigreeKeyPanel } from '../panels/PedigreeKeyPanel'
import { stack } from '../ui/classes'

export type PedigreeScreenProps = {
  sireName: string
  damName: string
  onSireChange?: (value: string) => void
  onDamChange?: (value: string) => void
}

export function PedigreeScreen({
  sireName,
  damName,
  onSireChange,
  onDamChange,
}: PedigreeScreenProps) {
  return (
    <div className={stack}>
      <PedigreeKeyPanel
        sireName={sireName}
        damName={damName}
        onSireChange={onSireChange}
        onDamChange={onDamChange}
      />
      <PedigreeAnalysisPanel sireName={sireName} damName={damName} />
    </div>
  )
}
