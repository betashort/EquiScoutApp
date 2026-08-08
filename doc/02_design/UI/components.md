# 共有コンポーネント（配置の部品）

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) |
| ビジュアル | [`visual.md`](./visual.md) / [`../base_desing.md`](../base_desing.md) |
| 更新日 | 2026-08-09 |

情報設計の要素を載せるための部品カタログ。見た目トークンは `base_desing.md`。

| ID | コンポーネント | 載せる情報の例 |
|----|----------------|----------------|
| U01 | `EntitySearchBox` | 名前検索 |
| U02 | `CandidateList` | 候補選択 |
| U03 | `AnalysisTypeSelect` | 分析種類 |
| U04 | `EmptyState` | 未選択・案内 |
| U05 | `PlaceholderPanel` | 未実装枠 |
| U06 | `MetricTable` | 賞金・着回数 |
| U07 | `RateBadgeRow` | 勝率・連対・複勝 |
| U08 | `BarChart` | 距離別 |
| U09 | `DataTable` | 重賞一覧など |
| U10 | `FormField` | ラベル付き入力 |
| U11 | `SectionHeader` | パネル見出し |
| U12 | `LoadingBlock` | 読取中 |
| U13 | `ErrorBanner` | エラー |
| U14 | `PrimaryButton` / `SecondaryButton` | 主／副アクション |
| U15 | `NavCard` | ホームからの画面遷移（ラベル・短い説明・遷移先） |
| U16 | `UpdateStatusSummary` | 最終更新・短い結果（ホーム／ヘッダと共用可） |

リストは **1セル定義＋データ繰り返し**（候補・重賞行・ホームの遷移カードなど）。同型を複製配置しない。詳細は [`implementation.md`](./implementation.md)。
