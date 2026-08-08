# S01 募集馬1頭分析

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.5 |
| ダッシュボード | [`analysis_dashboard.md`](./analysis_dashboard.md) |
| 更新日 | 2026-08-09 |

---

## レイアウト

読む順: **上: 入力フォーム → 下: ダッシュボード**。

```text
S01
├─ P-S01-A HorseEntryPanel
└─ P-S01-B AnalysisDashboardPanel
     ├─ Toolbar（AnalysisTypeSelect + ContextLabel）
     └─ Body（module 別 View）
```

### パネル

| パネル | 文書 |
|--------|------|
| P-S01-A | [`panels/P-S01-A_horse_entry.md`](./panels/P-S01-A_horse_entry.md) |
| P-S01-B | [`panels/P-dashboard.md`](./panels/P-dashboard.md) / [`analysis_dashboard.md`](./analysis_dashboard.md) |

trainer 埋め込み時の分析本文は [`panels/P-S02-B_trainer_analysis.md`](./panels/P-S02-B_trainer_analysis.md) と同一縦順。

---

## ビジュアル

- フォームは情報密度高め。装飾カード化しない
- Primary = 「分析を表示」、Secondary = 「クリア」（右下揃え）
- 詳細は [`visual.md`](./visual.md)
