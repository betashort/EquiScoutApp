# 分析ダッシュボード（共通）

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.4（募集馬分析 ダッシュボード要素） |
| パネル詳細 | [`panels/dashboard.md`](./panels/dashboard.md) |
| 更新日 | 2026-08-09 |

募集馬分析（および将来の比較からの遷移）で共用する分析枠の配置。  
調教師・生産牧場・血統の本文は **各単体画面と同一コンポーネント**（情報設計 §3.2）。

---

## レイアウト

読む優先（情報設計 §2.4）: **調教師（実データ）→ 生産牧場／血統（骨格）→ 類似馬（専用プレースホルダ）**。  
`strength_cost` は載せない。

```text
AnalysisDashboard
├─ ToolbarPanel
│    ├─ AnalysisTypeSelect
│    └─ ContextLabel
└─ BodyPanel（スクロール）
     ├─ trainer    → TrainerAnalysisView（= TrainerAnalysisPanel）
     ├─ farm       → FarmAnalysisView（= 生産牧場パネル本文）
     ├─ pedigree   → PedigreeAnalysisView（= 血統パネル本文）
     └─ similarity → SimilarityPanel（Placeholder・単体画面なし）
```

| 埋め込み | 共用パネル | 中身 |
|----------|------------|------|
| 調教師 | [`panels/trainer_analysis.md`](./panels/trainer_analysis.md) | 実データ（賞金／着回／率／距離／重賞） |
| 生産牧場 | [`panels/farm.md`](./panels/farm.md)（本文） | 骨格（単体と同一） |
| 血統 | [`panels/pedigree.md`](./panels/pedigree.md)（本文） | 骨格（単体と同一） |
| 類似馬 | （本パネル内プレースホルダ） | 単体画面なし |

---

## ビジュアル

- ツールバーは控えめ。本文スクロールと分離
- 未実装モジュールは `PlaceholderPanel`（[`visual.md`](./visual.md) の状態方針）
- `strength_cost` は載せない（情報設計）
- 埋め込み時の ProfileHeader 省略可否は [`panels/trainer_analysis.md`](./panels/trainer_analysis.md) に従う
