# TrainerAnalysisPanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../trainer.md`](../trainer.md) |
| 再利用 | 募集馬分析 ダッシュボード `trainer` 埋め込み |
| 情報設計の読む順 | 2〜7 |
| 更新日 | 2026-08-09 |

---

## レイアウト

縦積み（上→下）:

```text
ProfileHeader
PrizeSummary
FinishCountSummary
RateSummary
DistanceFinishChart（芝|ダート切替 ＋ グラフ ＋ 表）
RecentGradedWins
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
| ProfileHeader | `SectionHeader` | 分析ブロック先頭。ダッシュボード埋め込み時は省略可 |
| PrizeSummary / FinishCountSummary | `MetricTable` | 表。賞金→着回の順 |
| RateSummary | `RateBadgeRow` | 率は表の直後（視線の流れ） |
| DistanceFinishChart | タブ/トグル + `BarChart` + `MetricTable` | グラフ主、表は併置 |
| RecentGradedWins | `DataTable` | 最下部。0件は Empty |

### 再利用マトリクス

| ブロック | 調教師 | 募集馬分析（trainer） |
|----------|--------|------------------------|
| ProfileHeader | ○ | ○（省略可） |
| Prize / Finish / Rate / Distance / GradedWins | ○ | ○ |

---

## ビジュアル

- 表と見出しで階層。パネル区切りは弱め
- チャート色数は最小（芝/ダート・系列）
- 0件・読取中は [`../visual.md`](../visual.md) の状態方針
