/**
 * AppShell ウィンドウサイズ（doc/02_design/UI/shell.md）
 * - 初期: 1280×800
 * - 代替: 1366×768
 * - 最小: 1100×700
 */
export const EQUISCOUT_VIEWPORTS = {
  equiscoutDefault: {
    name: '初期 1280×800',
    styles: { width: '1280px', height: '800px' },
    type: 'desktop' as const,
  },
  equiscoutAlt: {
    name: '代替 1366×768',
    styles: { width: '1366px', height: '768px' },
    type: 'desktop' as const,
  },
  equiscoutMin: {
    name: '最小 1100×700',
    styles: { width: '1100px', height: '700px' },
    type: 'desktop' as const,
  },
}

export type EquiScoutViewportId = keyof typeof EQUISCOUT_VIEWPORTS

export const DEFAULT_VIEWPORT_ID: EquiScoutViewportId = 'equiscoutDefault'

/** 画面ストーリー共通: フルスクリーン + デスクトップ viewport 群 */
export const desktopScreenParameters = {
  layout: 'fullscreen' as const,
  viewport: {
    options: EQUISCOUT_VIEWPORTS,
  },
}

export function viewportGlobals(value: EquiScoutViewportId = DEFAULT_VIEWPORT_ID) {
  return {
    viewport: { value, isRotated: false },
  }
}
