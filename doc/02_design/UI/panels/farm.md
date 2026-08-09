# 生産牧場（検索＋骨格本文）

| 項目 | 内容 |
|------|------|
| 親画面 | [`../farm.md`](../farm.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.7 |
| ダッシュボード共用 | 本文を 募集馬分析 `farm` 埋め込みでも利用 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
FarmSearchPanel → FarmAnalysisPanel（Placeholder）
```

単体画面では検索＋本文。ダッシュボード埋め込みでは **本文のみ**（検索は募集馬フォーム側の牧場選択を context に渡す）。

| 区画 | コンポーネント |
|------|----------------|
| 検索 | `EntitySearchBox` / `CandidateList` / `EmptyState` / `LoadingBlock`（生産牧場 のみ） |
| 本文 | `PlaceholderPanel`（将来: 賞金・着回・出身馬リスト）。募集馬と共用 |

---

## ビジュアル

- プレースホルダは壊れた画面に見えないこと
- 将来載せる内容を短文で明示（謝罪調にしない）
