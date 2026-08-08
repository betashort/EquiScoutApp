# EquiScout UI（レイアウト・ビジュアル）

| 項目 | 内容 |
|------|------|
| 情報設計（正本） | [`../UI_design.md`](../UI_design.md) |
| トークン詳細 | [`../base_desing.md`](../base_desing.md) |
| 更新日 | 2026-08-09 |

本書ディレクトリは **第2層（レイアウト）** と **第3層（ビジュアル）** を、画面・パネル単位で置く。情報設計の「載せる／載せない」を変更しない。

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
| [`screen_transition.puml`](./screen_transition.puml) | 画面遷移（PlantUML。`UI_design.md` §2.2 と同一） |
| [`components.md`](./components.md) | 共有コンポーネントカタログ |
| [`visual.md`](./visual.md) | プロダクト横断ビジュアル |
| [`implementation.md`](./implementation.md) | 実装への翻訳（浅い構造・データ駆動） |

### 画面

| ID | 文書 |
|----|------|
| S00 | [`S00_home.md`](./S00_home.md) |
| S01 | [`S01_horse.md`](./S01_horse.md) |
| S02 | [`S02_trainer.md`](./S02_trainer.md) |
| S03 | [`S03_farm.md`](./S03_farm.md) |
| S04 | [`S04_pedigree.md`](./S04_pedigree.md) |
| S05 | [`S05_compare.md`](./S05_compare.md) |
| S06 | [`S06_settings.md`](./S06_settings.md) |
| 共通 | [`analysis_dashboard.md`](./analysis_dashboard.md) |

### パネル

| ID | 文書 |
|----|------|
| P-S00-A | [`panels/P-S00-A_intro.md`](./panels/P-S00-A_intro.md) |
| P-S00-B | [`panels/P-S00-B_destination.md`](./panels/P-S00-B_destination.md) |
| P-S00-C | [`panels/P-S00-C_home_update.md`](./panels/P-S00-C_home_update.md) |
| P-S01-A | [`panels/P-S01-A_horse_entry.md`](./panels/P-S01-A_horse_entry.md) |
| P-S02-A | [`panels/P-S02-A_trainer_search.md`](./panels/P-S02-A_trainer_search.md) |
| P-S02-B | [`panels/P-S02-B_trainer_analysis.md`](./panels/P-S02-B_trainer_analysis.md) |
| P-S03 | [`panels/P-S03_farm.md`](./panels/P-S03_farm.md) |
| P-S04 | [`panels/P-S04_pedigree.md`](./panels/P-S04_pedigree.md) |
| P-S06-A | [`panels/P-S06-A_update_control.md`](./panels/P-S06-A_update_control.md) |
| P-S06-B | [`panels/P-S06-B_update_result.md`](./panels/P-S06-B_update_result.md) |
| P-S06-C | [`panels/P-S06-C_connection.md`](./panels/P-S06-C_connection.md) |
| Dashboard | [`panels/P-dashboard.md`](./panels/P-dashboard.md) |

---

## MVP 完了条件（レイアウト・ビジュアル）

| 層 | 条件 | 状態 |
|----|------|------|
| レイアウト | AppShell＋起動時 S00。ナビ先頭がホーム | 必須 |
| レイアウト | AppShell＋S02 縦積みワイヤどおり | 必須 |
| レイアウト | S00 / S06 / ヘッダから更新・進捗・最終更新 | 必須 |
| ビジュアル | base トークン適用（最低限の可読性） | 実装時に `base_desing.md` と同期 |

---

## 階層クイックリファレンス

```text
AppShell … shell.md
├─ HeaderBar / GlobalNav / MainContent
└─ Screens
     S00 ホーム … S00_home.md
       P-S00-A / P-S00-B / P-S00-C
     S01 募集馬 … S01_horse.md
       P-S01-A / AnalysisDashboard（P-dashboard）
     S02 調教師 … S02_trainer.md
       P-S02-A / P-S02-B（B1〜B6）
     S03 / S04 … 骨格パネル
     S05 …（非表示）
     S06 … P-S06-A / B / C
```
