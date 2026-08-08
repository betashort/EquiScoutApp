# P-S06-A UpdateControlPanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../S06_settings.md`](../S06_settings.md) |
| 情報設計優先 | 1（更新実行と進捗） |
| 同一 UC | ヘッダ [更新] / [`P-S00-C_home_update.md`](./P-S00-C_home_update.md) |
| 更新日 | 2026-08-09 |

---

## レイアウト

- 更新ボタン・進捗（Sync / Analyze）
- MainContent は更新中もブロックしない（ヘッダに進行表示）

| コンポーネント | 用途 |
|----------------|------|
| `PrimaryButton` | データを更新 |
| `LoadingBlock` / 進捗表示 | Sync / Analyze |
| `UpdateStatusSummary` | 最終更新日時 |

---

## ビジュアル

- Primary = データ更新
- 進捗はヘッダとトーンを揃える
