# S06 データ更新・設定

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.10 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
S06
├─ P-S06-A UpdateControlPanel   … 更新ボタン・進捗
├─ P-S06-B UpdateResultPanel    … 結果・エラー
├─ P-S06-C ConnectionPanel      … PG 接続フォーム
└─ P-S06-D（任意）パス表示
```

シェルヘッダの [更新] および S00 の HomeUpdatePanel は A と同じ UC。更新中はヘッダに進行表示し、MainContent はブロックしない。

設定は情報量が少なければ **モーダル**でも可（実装選択）。ホームからは「設定・データ詳細」カードで本画面へ遷移する。

### パネル

| パネル | 文書 |
|--------|------|
| P-S06-A | [`panels/P-S06-A_update_control.md`](./panels/P-S06-A_update_control.md) |
| P-S06-B | [`panels/P-S06-B_update_result.md`](./panels/P-S06-B_update_result.md) |
| P-S06-C | [`panels/P-S06-C_connection.md`](./panels/P-S06-C_connection.md) |

---

## ビジュアル

- Primary = 「データを更新」
- エラー・結果は本文より先に目に入る位置
- 詳細は [`visual.md`](./visual.md)
