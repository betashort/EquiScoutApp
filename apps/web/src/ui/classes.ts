/** 繰り返し使う Tailwind クラス束（EquiScout UI） */

export const eqRoot =
  'box-border min-h-full bg-linear-to-br from-eq-bg-top via-eq-bg-bottom to-eq-bg-end font-eq text-sm leading-normal text-eq-ink antialiased text-left [&_button]:font-[inherit]'

export const shell =
  'grid min-h-dvh grid-cols-1 grid-rows-[3.5rem_1fr]'

export const panel =
  'rounded-lg border border-eq-border bg-eq-surface p-4 shadow-eq'

export const panelBody = 'flex flex-col gap-3.5'

export const stack = 'mx-auto flex max-w-3xl flex-col gap-5'

export const sectionHeader = 'mb-2.5 text-[0.9375rem] font-semibold text-eq-ink'

export const block =
  'flex flex-col gap-2 border-t border-eq-border pt-4 mt-4 first-of-type:mt-0 first-of-type:border-t-0 first-of-type:pt-0'

export const blockTitle = 'm-0 text-sm font-semibold text-eq-ink'

export const input =
  'w-full min-h-9 rounded-md border border-eq-border-strong bg-eq-surface px-2.5 py-1.5 font-eq text-eq-ink focus:border-eq-accent focus:outline-2 focus:outline-offset-1 focus:outline-eq-accent/35'

export const label = 'text-xs font-semibold text-eq-muted'

export const btnBase =
  'inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-3.5 py-1.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55'

export const btnPrimary =
  `${btnBase} bg-eq-accent text-white hover:bg-eq-accent-hover disabled:hover:bg-eq-accent`

export const btnSecondary =
  `${btnBase} border-eq-border-strong bg-eq-surface text-eq-ink hover:border-eq-accent/35 hover:bg-eq-accent-soft`

export const btnCompact = 'min-h-8 px-3 py-1 text-xs'

export const formGrid =
  'grid grid-cols-1 gap-x-3.5 gap-y-3 sm:grid-cols-2 xl:grid-cols-4'

export const formGrid2 = 'grid grid-cols-1 gap-x-3.5 gap-y-3 sm:grid-cols-2'

/** 募集馬サイドバー用（1カラム縦積み） */
export const formStack = 'flex flex-col gap-3'

export const formStackPair = 'grid grid-cols-2 gap-x-2.5 gap-y-3'

export const formActions = 'mt-1 flex justify-end gap-2'

/** 募集馬画面: 左サイドバー + 右ダッシュボード */
export const horseLayout =
  '-m-4 flex min-h-[calc(100dvh-3.5rem)] md:-m-5'

export const horseSidebar =
  'flex w-[17.5rem] shrink-0 flex-col border-r border-eq-border bg-eq-surface p-3 md:w-72 md:p-4'

export const horseSidebarRail =
  'flex w-10 shrink-0 flex-col border-r border-eq-border bg-eq-surface'

export const horseDashboard =
  'min-w-0 flex-1 overflow-auto bg-transparent p-4 md:p-5'

/** 分析ダッシュボード Body: 2×2（狭幅は 1 カラム） */
export const dashboardGrid =
  'grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-3.5'

export const dashboardSlot =
  'flex min-h-0 min-w-0 flex-col rounded-md border border-eq-border/80 bg-eq-surface/40 p-3'

export const dashboardSlotDropTarget =
  'border-eq-accent/40 bg-eq-accent-soft'
