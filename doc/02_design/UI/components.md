# 共有コンポーネント（配置の部品）

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) |
| ビジュアル | [`visual.md`](./visual.md) / [`../base_desing.md`](../base_desing.md) |
| 更新日 | 2026-08-09 |

情報設計の要素を載せるための部品カタログ。見た目トークンは `base_desing.md`。

| コンポーネント | 載せる情報の例 |
|----------------|----------------|
| `EntitySearchBox` | 名前検索 |
| `CandidateList` | 候補選択 |
| `AnalysisTypeSelect` | 分析種類（単体画面等。ダッシュボードは 2×2 常時表示のため未使用） |
| `EmptyState` | 未選択・案内 |
| `PlaceholderPanel` | 未実装枠 |
| `MetricTable` | 賞金・着回数 |
| `RateBadgeRow` | 勝率・連対・複勝 |
| `BarChart` | 距離別 |
| `DataTable` | 重賞一覧など |
| `FormField` | ラベル付き入力 |
| `SectionHeader` | パネル見出し |
| `DragHandle` | ダッシュボード 2×2 セルの並び替え（見出し付近） |
| `LoadingBlock` | 読取中 |
| `ErrorBanner` | エラー |
| `PrimaryButton` / `SecondaryButton` | 主／副アクション |
| `NavCard` | ホームからの画面遷移（アイコン・ラベル・短い説明・遷移先） |
| `UpdateStatusSummary` | 最終更新・短い結果（ホーム／ヘッダと共用可） |

### 画面／埋め込みで共用するビュー（パネル級）

| ビュー | 単体 | 募集馬ダッシュボード |
|--------|------|----------------------|
| `HorseProfilePanel` | （単体なし） | `horse` 専用 |
| `TrainerAnalysisView` | 調教師単体（[`panels/trainer_analysis.md`](./panels/trainer_analysis.md)） | `trainer` |
| `FarmAnalysisView` | 生産牧場単体（[`panels/farm.md`](./panels/farm.md) 本文） | `farm` |
| `PedigreeAnalysisView` | 血統単体（[`panels/pedigree.md`](./panels/pedigree.md) 本文） | `pedigree` |

リストは **1セル定義＋データ繰り返し**（候補・重賞行・ホームの遷移カードなど）。同型を複製配置しない。詳細は [`implementation.md`](./implementation.md)。
