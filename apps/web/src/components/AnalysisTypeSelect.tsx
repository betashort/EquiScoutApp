import {
  ANALYSIS_TYPE_OPTIONS,
  type AnalysisModuleId,
  type AnalysisTypeOption,
} from '../domain/analysis'
import { input } from '../ui/classes'
import { FormField } from './FormField'

type AnalysisTypeSelectProps = {
  value: AnalysisModuleId
  options?: readonly AnalysisTypeOption[]
  onChange?: (id: AnalysisModuleId) => void
}

export function AnalysisTypeSelect({
  value,
  options = ANALYSIS_TYPE_OPTIONS,
  onChange,
}: AnalysisTypeSelectProps) {
  const selectId = 'analysis-type-select'

  return (
    <FormField label="分析種類" htmlFor={selectId}>
      <select
        id={selectId}
        className={input}
        value={value}
        onChange={(e) => onChange?.(e.target.value as AnalysisModuleId)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  )
}
