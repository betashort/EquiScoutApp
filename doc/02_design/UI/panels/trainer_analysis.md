# P-S02-B TrainerAnalysisPanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../S02_trainer.md`](../S02_trainer.md) |
| 再利用 | S01 ダッシュボード `trainer` 埋め込み |
| 情報設計優先 | 2〜7 |
| 更新日 | 2026-08-09 |

---

## レイアウト

縦積み（上→下）:

```text
B1 ProfileHeader
B2 PrizeSummary
B3 FinishCountSummary
B4 RateSummary
B5 DistanceFinishChart（芝|ダート切替 ＋ グラフ ＋ 表）
B6 RecentGradedWins
```

```text
┌─ 〇〇 調教師 ──────────────────────────────────────────┐
│ 【賞金】 本年/前年/累計 × 本賞金・付加賞金              │
│ 【着回数】 1〜5着・着外                                 │
│ 【率】 勝率 / 連対率 / 複勝率                           │
│ 【距離別】 (芝|ダート)  [棒グラフ] + 表                 │
│ 【最近の重賞勝利】 日付|レース|G|馬名|…                 │
└────────────────────────────────────────────────────────┘
```

| ブロック | コンポーネント | 配置メモ |
|----------|----------------|----------|
| B1 | `SectionHeader` | 分析ブロック先頭。ダッシュボード埋め込み時は省略可 |
| B2 / B3 | `MetricTable` | 表。賞金→着回の順 |
| B4 | `RateBadgeRow` | 率は表の直後（視線の流れ） |
| B5 | タブ/トグル + `BarChart` + `MetricTable` | グラフ主、表は併置 |
| B6 | `DataTable` | 最下部。0件は Empty |

### 再利用マトリクス

| ブロック | S02 | S01（trainer） |
|----------|-----|----------------|
| ProfileHeader | ○ | ○（省略可） |
| Prize / Finish / Rate / Distance / GradedWins | ○ | ○ |

---

## ビジュアル

- 表と見出しで階層。パネル区切りは弱め
- チャート色数は最小（芝/ダート・系列）
- 0件・読取中は [`../visual.md`](../visual.md) の状態方針
