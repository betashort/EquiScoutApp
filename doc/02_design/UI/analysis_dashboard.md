# 分析ダッシュボード（共通）

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.6 |
| パネル詳細 | [`panels/P-dashboard.md`](./panels/P-dashboard.md) |
| 更新日 | 2026-08-09 |

S01（および将来の比較からの遷移）で共用する分析枠の配置。

---

## レイアウト

```text
AnalysisDashboard
├─ ToolbarPanel
│    ├─ AnalysisTypeSelect（U03）
│    └─ ContextLabel
└─ BodyPanel（スクロール）
     ├─ trainer    → TrainerAnalysisView（= P-S02-B）
     ├─ farm       → FarmAnalysisView（Placeholder）
     ├─ pedigree   → PedigreeAnalysisView（Placeholder）
     └─ similarity → SimilarityPanel（Placeholder）
```

調教師埋め込み: [`panels/P-S02-B_trainer_analysis.md`](./panels/P-S02-B_trainer_analysis.md)

---

## ビジュアル

- ツールバーは控えめ。本文スクロールと分離
- 未実装モジュールは `PlaceholderPanel`（[`visual.md`](./visual.md) のプレースホルダ方針）
- `strength_cost` は載せない（情報設計）
