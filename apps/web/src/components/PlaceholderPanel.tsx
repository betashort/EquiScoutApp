type PlaceholderPanelProps = {
  title: string
  body: string
}

export function PlaceholderPanel({ title, body }: PlaceholderPanelProps) {
  return (
    <div className="px-1 pt-4 pb-2">
      <p className="mb-1.5 text-[0.9375rem] font-semibold text-eq-ink">{title}</p>
      <p className="m-0 text-sm leading-normal text-eq-muted">{body}</p>
    </div>
  )
}
