type LoadingBlockProps = {
  label: string
}

export function LoadingBlock({ label }: LoadingBlockProps) {
  return (
    <div className="flex flex-col gap-1.5 py-1.5" role="status" aria-live="polite">
      <div
        className="h-1 overflow-hidden rounded-full bg-eq-progress-track"
        aria-hidden="true"
      >
        <span className="block h-full w-2/5 animate-eq-progress rounded-full bg-eq-progress-fill" />
      </div>
      <p className="m-0 text-sm text-eq-warning">{label}</p>
    </div>
  )
}
