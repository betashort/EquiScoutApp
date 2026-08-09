# P-S00-C HomeUpdatePanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../S00_home.md`](../S00_home.md) |
| 情報設計優先 | 4（データ更新） |
| 同一 UC | シェルヘッダ [更新] / [`P-S06-A_update_control.md`](./P-S06-A_update_control.md) |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
最終更新: YYYY-MM-DD HH:mm
[データを更新]
（更新中の進捗 / 直近の成功・失敗の短い文言）
```

| コンポーネント | 用途 |
|----------------|------|
| `PrimaryButton` | データを更新 |
| `UpdateStatusSummary`（U16） | 最終更新・短い結果 |
| `ErrorBanner` / `LoadingBlock` | 失敗・進行中 |

詳細結果・接続設定は S06 へ誘導可（情報設計の分担）。

---

## ビジュアル

- ヘッダの更新状態と矛盾しない表示
- エラーは目に入る位置・コントラスト（[`../visual.md`](../visual.md)）
