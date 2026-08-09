/** データ更新 UI の ViewModel（ヘッダ / ホームで共用） */
export type UpdatePhase = 'idle' | 'running' | 'success' | 'error'

export type UpdateStatusViewModel = {
  /** `YYYY-MM-DD HH:mm`。未取得時は null */
  lastUpdatedAt: string | null
  phase: UpdatePhase
  /** 更新中の短い進捗文言 */
  progressLabel?: string
  /** 直近の成功メッセージ */
  resultMessage?: string
  /** 失敗理由 */
  errorMessage?: string
}

export const UPDATE_STATUS_IDLE: UpdateStatusViewModel = {
  lastUpdatedAt: '2026-08-08 18:40',
  phase: 'idle',
}

export const UPDATE_STATUS_RUNNING: UpdateStatusViewModel = {
  lastUpdatedAt: '2026-08-08 18:40',
  phase: 'running',
  progressLabel: '同期中…',
}

export const UPDATE_STATUS_SUCCESS: UpdateStatusViewModel = {
  lastUpdatedAt: '2026-08-09 19:12',
  phase: 'success',
  resultMessage: 'データの更新が完了しました。',
}

export const UPDATE_STATUS_ERROR: UpdateStatusViewModel = {
  lastUpdatedAt: '2026-08-08 18:40',
  phase: 'error',
  errorMessage: 'データ更新に失敗しました。接続設定を確認して再試行してください。',
}

export function formatLastUpdated(lastUpdatedAt: string | null): string {
  if (!lastUpdatedAt) {
    return '最終更新: —'
  }
  return `最終更新: ${lastUpdatedAt}`
}
