import type { ReactNode } from 'react'
import type { NavId } from '../domain/navigation'
import {
  UPDATE_STATUS_IDLE,
  type UpdateStatusViewModel,
} from '../domain/updateStatus'
import { AppShell } from '../shell/AppShell'

type ScreenShellProps = {
  activeNavId: NavId
  updateStatus?: UpdateStatusViewModel
  children: ReactNode
}

export function ScreenShell({
  activeNavId,
  updateStatus = UPDATE_STATUS_IDLE,
  children,
}: ScreenShellProps) {
  return (
    <AppShell activeNavId={activeNavId} updateStatus={updateStatus}>
      {children}
    </AppShell>
  )
}
