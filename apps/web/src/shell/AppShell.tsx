import type { ReactNode } from 'react'
import type { NavId } from '../domain/navigation'
import type { UpdateStatusViewModel } from '../domain/updateStatus'
import { eqRoot, shell } from '../ui/classes'
import { GlobalNav } from './GlobalNav'
import { HeaderBar } from './HeaderBar'
import { MainContent } from './MainContent'

export type AppShellProps = {
  activeNavId: NavId
  updateStatus: UpdateStatusViewModel
  onNavSelect?: (id: NavId) => void
  onUpdateClick?: () => void
  children: ReactNode
}

export function AppShell({
  activeNavId,
  updateStatus,
  onNavSelect,
  onUpdateClick,
  children,
}: AppShellProps) {
  return (
    <div className={eqRoot}>
      <div className={shell}>
        <HeaderBar updateStatus={updateStatus} onUpdateClick={onUpdateClick} />
        <GlobalNav activeNavId={activeNavId} onNavSelect={onNavSelect} />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  )
}
