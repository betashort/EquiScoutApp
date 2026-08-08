# P-dashboard AnalysisDashboardPanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../S01_horse.md`](../S01_horse.md) / [`../analysis_dashboard.md`](../analysis_dashboard.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.6 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
ToolbarPanel
├─ AnalysisTypeSelect（U03）… ツールバー左
└─ ContextLabel
BodyPanel（スクロール）
├─ trainer    → P-S02-B（同一縦順）
├─ farm       → Placeholder
├─ pedigree   → Placeholder
└─ similarity → Placeholder
```

| 要素 | コンポーネント | 配置 |
|------|----------------|------|
| 分析種類 | `AnalysisTypeSelect` | ツールバー左 |
| 未選択時 | `EmptyState` | Body 中央寄り |
| 未実装 | `PlaceholderPanel` | Body |

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
