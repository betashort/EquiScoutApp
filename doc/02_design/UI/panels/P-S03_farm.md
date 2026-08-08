# P-S03 生産牧場（検索＋骨格本文）

| 項目 | 内容 |
|------|------|
| 親画面 | [`../S03_farm.md`](../S03_farm.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.7 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
FarmSearchPanel → FarmAnalysisPanel（Placeholder）
```

| 区画 | コンポーネント |
|------|----------------|
| 検索 | `EntitySearchBox` / `CandidateList` / `EmptyState` / `LoadingBlock` |
| 本文 | `PlaceholderPanel`（将来: 賞金・着回・出身馬リスト） |

---

## ビジュアル

- プレースホルダは壊れた画面に見えないこと
- 将来載せる内容を短文で明示（謝罪調にしない）
