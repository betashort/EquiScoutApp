# EquiScout PoC 計画

| 項目 | 内容 |
|------|------|
| 根拠ドキュメント | [`doc/01_requirement/requirement.md`](../01_requirement/requirement.md) / [`doc/02_design/architecture.md`](../02_design/architecture.md) |
| 作成日 | 2026-07-26 |
| 方針 | MVP 完成後（version2 等）に機能追加。計算式・類似条件は本 PoC で確定する |
| 本フォルダの役割 | PoC の一覧管理と、各検証の計画・成果物の置き場 |

---

## 1. PoC の位置づけ

要求分析では、**強さ・コスパの計算式は未定**とし、PoC で検証してから実装する。アーキテクチャでは `StrengthCost` / `Similarity` を差し替え可能なモジュール境界として先に切っておく。

| 目指すこと（要求） | 実施時期（要求） |
|--------------------|------------------|
| 未出走の募集馬に対し、**説明可能な強さスコア**を出せること | 未定。機能追加は MVP 完成後（version2 等）を想定 |

MVP ではスコアリング表示・複数頭ランキングは行わない。本 PoC の成果を `StrengthCost` / `Similarity` 実装と Analyze 段階への差し込みに接続する。

---

## 2. PoC 一覧

| ID | 名称 | フォルダ | 主な検証テーマ | 依存 |
|----|------|----------|----------------|------|
| POC-01 | 強さスコア定量化 | [`01_strength_score/`](./01_strength_score/) | 1次/2次指標・合成・未出走代理・「大負け」定義 | — |
| POC-02 | コスパ計算式 | [`02_cost_performance/`](./02_cost_performance/) | 強さ × 市場取引価格（HS）の組み合わせ | POC-01 |
| POC-03 | 類似馬・参考成績の定義 | [`03_similarity/`](./03_similarity/) | 血統類似度 / 生産牧場 / 調教師の組み合わせ | —（POC-01 と並行可） |
| POC-04 | スコア根拠の可視化 | [`04_score_visualization/`](./04_score_visualization/) | 数値スコア＋根拠データのグラフ表現 | POC-01, POC-02 |
| POC-05 | StrengthCost モジュール差し込み | [`05_strength_cost_module/`](./05_strength_cost_module/) | Analyze プラグイン化・TS 回帰/集計の実現性 | POC-01, POC-02 |
| POC-06 | データ前提・代理特徴量の妥当性 | [`06_feature_proxy/`](./06_feature_proxy/) | 調教師・牧場・血統から未出走馬を説明する特徴量 | POC-01 と密接 |

推奨実施順: **POC-06 → POC-01 → POC-03（並行可）→ POC-02 → POC-04 → POC-05**

---

## 3. 成果物の扱い

各 PoC フォルダには少なくとも次を置く。

| ファイル | 内容 |
|----------|------|
| `plan.md` | 目的・仮説・成功基準・手順・データ・成果物 |
| `notes.md` | 検証メモ（実施時に追記） |
| `result.md` | 結論・採用する計算ルール・棄却した案（完了時） |

コード・ノートブック・実験用スクリプトを追加する場合は、同フォルダ配下に `work/` を切る。

---

## 4. 要求・アーキとの対応

| PoC | 要求の根拠 | アーキの根拠 |
|-----|------------|--------------|
| POC-01 | §2 強さ（方針）・PoC 節 | §4.3 / §12 StrengthCost、§5.6 回帰 |
| POC-02 | §2 コスパ（方針）・価格 | §5.5 価格、StrengthCost |
| POC-03 | §3.2 類似馬・参考成績 | Similarity モジュール、§12 未決 |
| POC-04 | §2 評価の出力方針（PoC後） | Presentation チャート、ViewModel |
| POC-05 | §4 スコープ（version2） | AnalysisMaterializer / feature flag |
| POC-06 | §2 未出走馬の代理指標、§3.3〜3.5 | Domain: Trainer / Farm / Pedigree |

---

## 5. スコープ外（本 PoC では扱わない）

- 自動出資判断・予想印の自動生成
- クラブ公式サイトのスクレイピング
- MVP 調教師分析そのものの実装（本実装は MVP 側）
- Electron 包装・製品向け IPC の作り込み（差し込み口の確認は POC-05 で最小限）
