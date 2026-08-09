import type { ReactNode } from 'react'

type MainContentProps = {
  children: ReactNode
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="min-h-0 overflow-auto p-4 md:p-5 md:pb-8">{children}</main>
  )
}
