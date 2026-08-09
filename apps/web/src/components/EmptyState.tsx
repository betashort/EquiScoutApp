type EmptyStateProps = {
  title: string
  body: string
}

export function EmptyState({ title, body }: EmptyStateProps) {
  return (
    <div className="px-1 py-5 text-eq-muted" role="status">
      <p className="mb-1.5 text-[0.9375rem] font-semibold text-eq-ink">{title}</p>
      <p className="m-0 text-sm">{body}</p>
    </div>
  )
}
