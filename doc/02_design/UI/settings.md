# データ更新・設定

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.8 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
設定
├─ UpdateControlPanel   … 更新ボタン・進捗
├─ UpdateResultPanel    … 結果・エラー
├─ ConnectionPanel      … PG 接続フォーム
└─ （任意）パス表示
```

シェルヘッダの [更新] および ホームの HomeUpdatePanel は UpdateControlPanel と同じ UC。更新中はヘッダに進行表示し、MainContent はブロックしない。

設定は情報量が少なければ **モーダル**でも可（実装選択）。ホームからは「設定・データ詳細」カードで本画面へ遷移する。

### パネル

| パネル | 文書 |
|--------|------|
| UpdateControlPanel | [`panels/update_control.md`](./panels/update_control.md) |
| UpdateResultPanel | [`panels/update_result.md`](./panels/update_result.md) |
| ConnectionPanel | [`panels/connection.md`](./panels/connection.md) |

---

## ビジュアル

- Primary = 「データを更新」
- エラー・結果は本文より先に目に入る位置
- 詳細は [`visual.md`](./visual.md)
