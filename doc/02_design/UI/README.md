# EquiScout UI（レイアウト・ビジュアル）

| 項目 | 内容 |
|------|------|
| 情報設計（正本） | [`../UI_design.md`](../UI_design.md) |
| トークン詳細 | [`../base_desing.md`](../base_desing.md) |
| 更新日 | 2026-08-09 |

本書ディレクトリは **第2層（レイアウト）** と **第3層（ビジュアル）** を、画面・パネル単位で置く。情報設計の「載せる／載せない」を変更しない。画面・パネルに番号 ID（旧 S0x / P-S0x）は付けない。

---

## 文書の書き方

各画面・パネル markdown は次を含める。

1. **情報設計へのリンク**（何を載せるかの根拠）
2. **レイアウト**（親→子、読む順、ワイヤ、コンポーネント対応）
3. **ビジュアル**（その単位での見た目方針。横断方針は [`visual.md`](./visual.md)）

---

## 索引

### 横断

| 文書 | 内容 |
|------|------|
| [`shell.md`](./shell.md) | AppShell（ヘッダ・左ナビ・MainContent） |
| [`components.md`](./components.md) | 共有コンポーネントカタログ |
| [`visual.md`](./visual.md) | プロダクト横断ビジュアル（状態の見た目。表示値ルールは情報設計 §2.11） |
| [`implementation.md`](./implementation.md) | 実装への翻訳（浅い構造・データ駆動・共用ビュー・表示フォーマット） |

### 画面（§2.1 インベントリ順。複数頭比較は対象外）

| # | 画面名 | 文書 | 備考 |
|---|--------|------|------|
| 1 | ホーム | [`home.md`](./home.md) | 起動入口 |
| 2 | 募集馬分析 | [`horse.md`](./horse.md) | ダッシュボードで調教師・生産牧場・血統本文を共用 |
| 3 | 調教師単体分析 | [`trainer.md`](./trainer.md) | 本線・実データ |
| 4 | 生産牧場単体分析 | [`farm.md`](./farm.md) | 骨格。本文は募集馬と共用 |
| 5 | 血統単体分析 | [`pedigree.md`](./pedigree.md) | 骨格。本文は募集馬と共用 |
| 6 | データ更新・設定 | [`settings.md`](./settings.md) | 詳細設定はここ |
| — | 複数頭比較 | [`compare.md`](./compare.md) | 将来。インベントリ・ナビ対象外 |
| — | 共通 | [`analysis_dashboard.md`](./analysis_dashboard.md) | 募集馬ダッシュボード埋め込み枠 |

### パネル

| パネル | 文書 |
|--------|------|
| IntroPanel | [`panels/intro.md`](./panels/intro.md) |
| DestinationPanel | [`panels/destination.md`](./panels/destination.md) |
| HomeUpdatePanel | [`panels/home_update.md`](./panels/home_update.md) |
| HorseEntryPanel | [`panels/horse_entry.md`](./panels/horse_entry.md) |
| TrainerSearchPanel | [`panels/trainer_search.md`](./panels/trainer_search.md) |
| TrainerAnalysisPanel | [`panels/trainer_analysis.md`](./panels/trainer_analysis.md) |
| 生産牧場（検索＋本文） | [`panels/farm.md`](./panels/farm.md) |
| 血統（キー＋本文） | [`panels/pedigree.md`](./panels/pedigree.md) |
| UpdateControlPanel | [`panels/update_control.md`](./panels/update_control.md) |
| UpdateResultPanel | [`panels/update_result.md`](./panels/update_result.md) |
| ConnectionPanel | [`panels/connection.md`](./panels/connection.md) |
| AnalysisDashboardPanel | [`panels/dashboard.md`](./panels/dashboard.md) |

---

## 完了条件（レイアウト・ビジュアル）

| 層 | 条件 | 状態 |
|----|------|------|
| レイアウト | AppShell＋起動時ホーム。ナビはインベントリ順（ホーム / 募集馬 / 調教師 / 生産牧場 / 血統 / 設定） | 必須 |
| レイアウト | AppShell＋調教師単体の縦積みワイヤどおり | 必須 |
| レイアウト | ホーム / 設定 / ヘッダから更新・進捗・最終更新 | 必須 |
| レイアウト | 募集馬分析 ダッシュボード本文は 調教師 / 生産牧場 / 血統と共用 | 必須 |
| ビジュアル | base トークン適用（最低限の可読性） | 実装時に `base_desing.md` と同期 |

---

## 階層クイックリファレンス

```text
AppShell … shell.md
├─ HeaderBar / GlobalNav（§2.1 順） / MainContent
└─ Screens（インベントリ順）
     ホーム … home.md
       IntroPanel / DestinationPanel / HomeUpdatePanel
     募集馬分析 … horse.md
       HorseEntryPanel / AnalysisDashboardPanel
         └─ Body: TrainerAnalysisPanel / 生産牧場本文 / 血統本文 / similarity
     調教師 … trainer.md
       TrainerSearchPanel / TrainerAnalysisPanel
     生産牧場 / 血統 … 骨格パネル（本文は募集馬と共用）
     設定 … UpdateControlPanel / UpdateResultPanel / ConnectionPanel
     複数頭比較 …（インベントリ外・非表示）
```
