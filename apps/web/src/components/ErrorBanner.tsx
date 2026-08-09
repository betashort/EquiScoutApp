import { SecondaryButton } from './SecondaryButton'

type ErrorBannerProps = {
  message: string
  retryLabel?: string
  onRetry?: () => void
}

export function ErrorBanner({
  message,
  retryLabel = '再試行',
  onRetry,
}: ErrorBannerProps) {
  return (
    <div
      className="flex flex-col items-start gap-2 rounded-md border border-eq-danger-border bg-eq-danger-bg px-3.5 py-3 text-eq-danger"
      role="alert"
    >
      <p className="m-0 text-sm font-medium">{message}</p>
      {onRetry ? (
        <SecondaryButton label={retryLabel} onClick={onRetry} compact />
      ) : null}
    </div>
  )
}
