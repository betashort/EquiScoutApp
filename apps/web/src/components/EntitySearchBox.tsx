import { input } from '../ui/classes'
import { FormField } from './FormField'

type EntitySearchBoxProps = {
  label: string
  value: string
  placeholder?: string
  onChange?: (v: string) => void
  disabled?: boolean
}

export function EntitySearchBox({
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
}: EntitySearchBoxProps) {
  const inputId = `entity-search-${label}`

  return (
    <FormField label={label} htmlFor={inputId}>
      <input
        id={inputId}
        type="text"
        className={input}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
      />
    </FormField>
  )
}
