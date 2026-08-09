import type { ReactNode } from 'react'
import { label as labelClass } from '../ui/classes'
import { cn } from '../ui/cn'

type FormFieldProps = {
  label: string
  htmlFor?: string
  error?: string
  children: ReactNode
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-1',
        error &&
          '[&_input]:border-eq-danger [&_select]:border-eq-danger',
      )}
    >
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="m-0 text-xs text-eq-danger">{error}</p>
      ) : null}
    </div>
  )
}
