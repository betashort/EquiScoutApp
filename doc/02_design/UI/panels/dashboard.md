# AnalysisDashboardPanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../horse.md`](../horse.md) / [`../analysis_dashboard.md`](../analysis_dashboard.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.4（募集馬分析 ダッシュボード要素） |
| 更新日 | 2026-08-09 |

---

## レイアウト

読む優先: **調教師（実データ）→ 生産牧場／血統（骨格）→ 類似馬**。`strength_cost` は載せない。

```text
ToolbarPanel
├─ AnalysisTypeSelect … ツールバー左
└─ ContextLabel
BodyPanel（スクロール）
├─ trainer    → TrainerAnalysisPanel（調教師単体と同一）
├─ farm       → 生産牧場パネル本文（単体と同一）
├─ pedigree   → 血統パネル本文（単体と同一）
└─ similarity → Placeholder（単体画面なし）
```

| 要素 | コンポーネント | 配置 |
|------|----------------|------|
| 分析種類 | `AnalysisTypeSelect` | ツールバー左 |
| 未選択時 | `EmptyState` | Body 中央寄り |
| 調教師本文 | `TrainerAnalysisView`（TrainerAnalysisPanel） | Body |
| 牧場・血統本文 | 生産牧場 / 血統 と同一（骨格時は `PlaceholderPanel`） | Body |
| 類似馬 | `PlaceholderPanel` | Body |

```text
┌─ 分析 ─────────────────────────────────────────────────┐
│ 分析種類 [調教師分析 v]     対象: 〇〇 調教師          │
│ （埋め込み: TrainerAnalysisView 他）                    │
└────────────────────────────────────────────────────────┘
```

---

## ビジュアル

- ツールバーは控えめ
- Placeholder / Empty は [`../visual.md`](../visual.md)
