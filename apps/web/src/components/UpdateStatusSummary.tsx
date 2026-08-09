import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { formatLastUpdated } from '../domain/updateStatus'

type UpdateStatusSummaryProps = {
  status: UpdateStatusViewModel
}

export function UpdateStatusSummary({ status }: UpdateStatusSummaryProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="m-0 text-sm text-eq-muted">
        {formatLastUpdated(status.lastUpdatedAt)}
      </p>
    </div>
  )
}
