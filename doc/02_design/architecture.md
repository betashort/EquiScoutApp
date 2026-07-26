# EquiScout アーキテクチャ設計書

| 項目 | 内容 |
|------|------|
| 対象プロダクト | EquiScout |
| 根拠ドキュメント | [`doc/01_requirement/requirement.md`](../01_requirement/requirement.md) |
| 関連設計 | [`DB_design.md`](./DB_design.md) / [`UI_design.md`](./UI_design.md) / [`base_desing.md`](./base_desing.md) |
| 作成日 | 2026-07-26 |
| 更新日 | 2026-07-26 |
| 対象フェーズ | MVP（調教師本実装）＋将来拡張を見据えた骨格 |

---

## 1. 目的と方針

### 1.1 目的

一口馬主希望者が、JV-DL 由来のレース・マスタ情報をもとに、**調教師・生産牧場・血統**などを分析・可視化し、募集馬の比較検討を支援するデスクトップアプリのシステム構成を定める。

### 1.2 設計方針

| # | 方針 | 要求・決定との対応 |
|---|------|-------------------|
| 1 | **分析ドメインを UI から分離**する | 調教師 → 牧場 → 血統 → 総合評価の段階実装 |
| 2 | **データは二段構成**とする（PG 正本 / SQLite 読取モデル） | JV-DL は既存 PostgreSQL、アプリは表示・分析用に SQLite |
| 3 | **同期は一方向・アプリ使用マスタのみ** | 手動更新。SQLite → PG は行わない |
| 4 | **更新時に分析し、結果を SQLite へ永続化**する | 表示は計算せず読取。集計・回帰等は TypeScript（＋SQL） |
| 5 | **HTTP API は持たない** | データアクセスは SQL / ユースケース関数。Electron 化時は IPC |
| 6 | **スコアリングは差し替え可能なモジュール**にする | 強さ/コスパは PoC 後（MVP 非表示） |
| 7 | **Web コア先行、Electron 後付け** | 開発はブラウザ + SQLite。製品は Win/Mac の Electron |
| 8 | **ローカル完結**を基本とする | 個人利用。通常操作は SQLite のみでオフライン可 |

### 1.3 本文書の範囲

- システムの論理構成、コンポーネント責務、データフロー、技術選定
- 詳細なテーブル定義 → `DB_design.md`（PostgreSQL 定義書 Excel を正本スキーマの根拠とする）
- 画面レイアウト・コンポーネント詳細 → `UI_design.md`
- 強さ/コスパの計算式 → PoC 後に別紙（本アーキでは差し替え点のみ定義）

---

## 2. システムコンテキスト

```text
┌─────────────────────────────────────────────────────────────┐
│                         利用者                               │
│              （個人の一口馬主希望者）                          │
└────────────────────────────┬────────────────────────────────┘
                             │ 操作（検索・入力・分析閲覧・手動同期）
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     EquiScout App                            │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Presentation│  │ Application  │  │ Analysis Domains   │ │
│  │ (UI)        │↔│ / Use Cases  │↔│ Trainer / Farm /   │ │
│  │             │  │              │  │ Pedigree / Score*  │ │
│  └─────────────┘  └──────────────┘  └─────────┬──────────┘ │
│                                               │            │
│  ┌────────────────────────────────────────────▼──────────┐ │
│  │     Data Access（通常時は SQLite のみ）                 │ │
│  └────────────────────────────┬───────────────────────────┘ │
│                               │                             │
│  ┌────────────────────────────▼───────────────────────────┐ │
│  │  Update Pipeline（手動更新）                            │ │
│  │  1. Sync: PG → SQLite（使用マスタのみ・一方向）         │ │
│  │  2. Analyze: 集計・指標算出（TS）→ 分析結果を SQLite へ │ │
│  └────────────────────────────┬───────────────────────────┘ │
└───────────────────────────────┼─────────────────────────────┘
                                │ 手動更新時のみ PG 接続
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
   ┌─────────────┐      ┌──────────────┐      ┌─────────────┐
   │ PostgreSQL  │      │ 募集馬手入力 │      │ 外部データ  │
   │ (JV-DL 正本 │      │ （画面先行。 │      │ （将来）    │
   │  正規化済み）│      │  永続化は後）│      │             │
   └─────────────┘      └──────────────┘      └─────────────┘

* Score（強さ・コスパ）は MVP では無効化。PoC 後に有効化。
```

### 2.1 外部境界

| 外部要素 | 接続方式 | 備考 |
|----------|----------|------|
| PostgreSQL（JV-DL） | 手動更新時のみ。アプリ使用マスタを SQLite へ抽出 | 正規化・テーブル分割済み。定義書（Excel）あり |
| SQLite（アプリ DB） | マスタスナップショット＋**分析結果**の永続化。通常操作の読取先 | 表示は分析済み行を読むだけ |
| 利用者入力 | UI フォーム | 募集馬は MVP では画面先行（永続化は後続） |
| クラブ公式サイト等 | **接続しない** | スクレイピングはスコープ外 |
| HTTP API / クラウド | **持たない** | ローカル完結。ユースケースは関数または IPC |

---

## 3. 論理アーキテクチャ

レイヤード構成とする。上位層は下位層にのみ依存し、分析ロジックは UI や同期方式に依存しない。

```text
┌──────────────────────────────────────────────┐
│  Presentation Layer                          │
│  画面・ナビ・フォーム・チャート描画          │
├──────────────────────────────────────────────┤
│  Application Layer（ユースケース）            │
│  検索 / 分析表示（読取） / 更新パイプライン指示│
│  （募集馬永続化は後続）                       │
├──────────────────────────────────────────────┤
│  Domain Layer（分析・集計）                   │
│  更新時に実行し結果を永続化                   │
│  Trainer / Farm / Pedigree / Similarity*     │
│  StrengthCost*（PoC後）                      │
├──────────────────────────────────────────────┤
│  Infrastructure Layer                        │
│  SQLite Repository / PgSync / Config         │
└──────────────────────────────────────────────┘
```

### 3.1 層の責務

#### Presentation

- 操作フロー（1頭分析 / 単体分析 / 将来の複数頭比較）の画面遷移
- 分析ダッシュボード内の分析種類切替（プルダウン等）
- 表・グラフの描画（**分析済み SQLite データを表示**。重い集計は行わない）
- MVP: 調教師は実データ、牧場・血統・類似馬は最低限 UI（入力・プレースホルダ可）
- 募集馬: 入力フォームは用意。保存・再表示は後続でよい

#### Application

- ユースケースのオーケストレーション
  - 「調教師を名前検索し候補を返す」
  - 「調教師 ID の分析結果を SQLite から読んで ViewModel 化する」
  - 「選択中分析をダッシュボードに埋め込む」
  - 「更新パイプライン（Sync → Analyze → 結果 UPSERT）を実行する」
- 表示時は原則として再集計しない（既に SQLite にある指標・率を返す）
- スコアリングモジュールの有無を設定で切り替え（MVP はオフ）
- **HTTP エンドポイントは公開しない**。同一プロセス内の関数呼び出し（ブラウザ開発時）、Electron 化後は IPC ハンドラが同じユースケースを呼ぶ

#### Domain

更新パイプラインの Analyze 段階で実行し、**成果物を SQLite の分析テーブルへ書き込む**。表示用ユースケースは主にその読取を行う。

| モジュール | MVP | 責務 |
|------------|-----|------|
| `TrainerAnalysis` | **本実装** | 着回数からの率算出、表示用指標の整形。結果を SQLite に保存 |
| `FarmAnalysis` | UI骨格 | 生産者＝牧場。本実装は後続 |
| `PedigreeAnalysis` | UI骨格 | 距離/馬場適性・兄弟成績（本実装は後続） |
| `Similarity` | 表示枠のみ | 類似条件は PoC。インターフェースのみ用意 |
| `StrengthCost` | 無効 | 強さ/コスパ（回帰等を含む想定）。PoC 後に Analyze 段階へ差し込む |

ドメインモジュールは共通インターフェース（例: `AnalysisModule`）を実装し、ダッシュボードがモジュール ID で切り替えられるようにする。Analyze バッチ用に `materializeAll()` / `materialize(id)` のような永続化エントリを持つ。

#### Infrastructure

- SQLite への CRUD / クエリ（マスタスナップショット＋分析結果。通常時の唯一のデータソース）
- PostgreSQL からの同期（接続・抽出・変換・UPSERT）
- 設定（PG 接続情報、SQLite パス、最終更新日時など）
- ログ・エラー通知の基盤

---

## 4. コンポーネント構成

### 4.1 ランタイム構成

#### 開発（MVP 先行）: ブラウザ + SQLite

```text
┌─────────────────────────────────────────────┐
│  Browser                                     │
│  Frontend (React + TypeScript)               │
│         │                                    │
│         │ ユースケース関数呼び出し            │
│         ▼                                    │
│  Application + Domain + Infrastructure       │
│  SQLite（ファイル or 開発用）                 │
│  UpdatePipeline: Sync → Analyze（手動更新時） │
└─────────────────────────────────────────────┘
```

ブラウザから直接 Node の `pg` / ネイティブ SQLite を叩けない制約がある場合は、**薄いローカルプロセス**（開発用のみ）でユースケースをホストしてよい。ただしこれは製品向け HTTP API ではなく、Electron Main に置き換える前提の一時的ホストとする。

#### 製品: Electron（Windows 主、macOS 対応）

```text
┌─────────────────────────────────────────────┐
│              Electron                        │
│  ┌───────────────────────────────────────┐  │
│  │  Renderer: React (Presentation)       │  │
│  └──────────────────┬────────────────────┘  │
│                     │ IPC（HTTP ではない）   │
│  ┌──────────────────▼────────────────────┐  │
│  │  Main: Application + Domain           │  │
│  │        + SQLite Repository            │  │
│  │        + UpdatePipeline               │  │
│  │          (PgSync → Analyze → Write)   │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

- 通常操作: Renderer → IPC → Main → **SQLite の分析結果・マスタを読取**
- 手動更新: Main が PG 同期のあと Domain 分析を実行し、**結果を SQLite に UPSERT**

### 4.2 主要コンポーネント一覧

| ID | コンポーネント | 層 | 説明 |
|----|----------------|-----|------|
| C01 | `AppShell` | Presentation | ナビ・レイアウト・分析ルート |
| C02 | `HorseEntryForm` | Presentation | 募集馬入力 UI（MVP: 画面先行、永続化は後続） |
| C03 | `AnalysisDashboard` | Presentation | 分析種類切替＋埋め込み領域 |
| C04 | `TrainerAnalysisView` | Presentation | 調教師分析の表・グラフ（読取専用） |
| C05 | `FarmAnalysisView` | Presentation | 牧場分析（MVP: 骨格） |
| C06 | `PedigreeAnalysisView` | Presentation | 血統分析（MVP: 骨格） |
| C07 | `SimilarityPanel` | Presentation | 類似馬枠（MVP: プレースホルダ） |
| C08 | `DataUpdateUI` | Presentation | 手動更新ボタン・進捗・最終更新日時・結果表示 |
| C09 | `SearchService` | Application | 調教師名テキスト検索→候補（SQLite） |
| C10 | `HorseRegistryService` | Application | 募集馬の登録・再表示（**後続**。MVP はスタブ可） |
| C11 | `AnalysisOrchestrator` | Application | 表示: モジュール選択と分析結果の読取。更新: Analyze バッチ起動 |
| C12 | `TrainerAnalysis` | Domain | 調教師指標の算出・整形（更新時実行） |
| C13 | `RateCalculator` | Domain | 勝率・連対率・複勝率（着回数から。更新時に永続化） |
| C14 | `PgSyncJob` | Infrastructure | PG → SQLite 一方向同期（使用マスタのみ） |
| C15 | `AnalysisMaterializer` | Application/Domain | 更新パイプラインの Analyze 段階。結果を SQLite へ書き込み |
| C16 | `SqliteRepository` | Infrastructure | SQLite への CRUD / 検索（マスタ＋分析結果） |
| C17 | `ConfigStore` | Infrastructure | PG 接続・SQLite パス・更新メタ |

### 4.3 分析モジュールの差し替え点

```text
UpdatePipeline
  ├─ PgSyncJob.sync()
  └─ AnalysisMaterializer.run()
        ├─ TrainerAnalysis.materializeAll()   ← MVP
        ├─ FarmAnalysis...                   ← 後続
        └─ StrengthCost...                   ← PoC後

AnalysisOrchestrator（表示時）
  ├─ getAvailableModules()
  ├─ getAnalysis(moduleId, context)  → SQLite 読取
  └─ StrengthCostModule              ← feature flag OFF（MVP）
```

募集馬1頭分析では、入力済み調教師 ID を `context` に渡し、同一ダッシュボード内で分析結果を埋め込む（画面遷移に依存しない）。MVP では募集馬の永続化前でも、フォーム上の調教師選択値を渡して埋め込み可能とする。

---

## 5. データアーキテクチャ（概要）

詳細スキーマは `DB_design.md` に委譲する。PostgreSQL 側のテーブル定義は既存の **データベース定義書（Excel）** を正とする。

### 5.1 ストアの役割

| ストア | 役割 | 備考 |
|--------|------|------|
| **PostgreSQL** | JV-DL の正本 | 正規化・テーブル分割済み。アプリ外で管理・更新される |
| **SQLite** | マスタスナップショット＋**分析結果テーブル**＋アプリ固有データ | 更新時に書き、表示時に読む |

同期は **PostgreSQL → SQLite の一方向のみ**。分析結果も SQLite に閉じ、正本 PG は更新しない。

### 5.2 データ分類

| 分類 | 例 | 格納先 | 更新 |
|------|-----|--------|------|
| JV-DL マスタ（正本） | 調教師・生産者・競走馬等 | PostgreSQL | アプリ外（JV-DL 運用） |
| マスタスナップショット | 調教師の賞金・着回数・距離別・最近重賞など（同期コピー） | SQLite | 更新パイプライン Sync 段階 |
| **分析結果** | 勝率・連対率・複勝率、整形済み表示用指標、（将来）回帰スコア等 | SQLite | 更新パイプライン Analyze 段階 |
| 追加集計（将来） | 年別推移、クラス別、新馬、勝ち上がり | SQLite（分析結果） | P1。元は PG レース成績を Sync 後に Analyze |
| ユーザー入力 | 募集馬、1口価格・口数、募集時体重 | SQLite（アプリ領域） | CRUD。**MVP では画面のみ可** |
| アプリ設定 | PG 接続、最終更新日時、表示デフォルト（P1） | SQLite / 設定ファイル | CRUD |

### 5.3 永続化方針

- **通常時のメインストア**: SQLite
  - 検索・分析**表示**はすべて SQLite（分析結果テーブル優先）
  - バックアップは DB ファイルコピーで可能
- **更新時**:
  1. PostgreSQL から使用マスタを抽出 → SQLite に UPSERT（Sync）
  2. TypeScript の Domain で集計・指標算出（必要なら回帰等）→ 分析結果を SQLite に UPSERT（Analyze）
- **募集馬**: JV-DL 馬マスタと分離したアプリ領域に保存する（実装は MVP 後でも可）
- SQLite には JV-DL 全カラムの完全ミラーは不要。**画面・分析が要する形**に落とす

### 5.4 MVP 同期・分析範囲（設計決定）

| 優先 | 対象 | MVP |
|------|------|-----|
| 必須 Sync | 調教師（CH 相当）および分析に必要な関連表 | **する** |
| 必須 Analyze | 勝率・連対率・複勝率、表示用に必要な整形 | **する**（結果を SQLite へ） |
| 後続 | 生産者(BR)、競走馬(UM)、HS、BT、レース成績、回帰スコア等 | Sync/Analyze 対象に追加 |

```text
PostgreSQL (使用マスタのみ)
  → Sync: Extract / Transform → SQLite（マスタ）
  → Analyze: Domain（TS 集計・指標）→ SQLite（分析結果）
  → update_meta（最終更新日時・件数など）を更新
```

### 5.5 価格データの扱い

- 分析の価格主データ: HS（市場取引価格）。同期対象に含めるのは HS 利用フェーズ以降
- 募集馬入力の補助: 1口価格・口数（JV-DL 外、アプリ領域のみ）
- コスパ評価対象外（価格不明）の扱いは StrengthCost 側のルールとし、他分析は価格なしでも動作可能にする

### 5.6 TypeScript による分析の位置づけ

| 処理 | TypeScript での扱い | 備考 |
|------|---------------------|------|
| 集計・率・ランキング | **十分容易** | SQL（SQLite）＋ TS。MVP の中心 |
| 単純な回帰・相関 | **可能** | `simple-statistics` / `ml-regression` / `danfojs` 等 |
| 大規模 ML・高度な統計 PoC | 必要なら後から分離 | まずは TS。足りなければ Python 等を Analyze プラグイン化 |

本 PJ では分析実行環境を **TypeScript に統一**する。更新パイプラインの Analyze 段階に閉じることで、UI スレッドを重くしない。

---

## 6. 主要データフロー

### 6.1 手動更新パイプライン（Sync → Analyze → SQLite）

```text
利用者 → [更新] → DataUpdateUI
                → Application: UpdateDataUseCase
                → 1) PgSyncJob: 使用マスタを PG から抽出 → SQLite UPSERT
                → 2) AnalysisMaterializer:
                      TrainerAnalysis / RateCalculator（ほか後続モジュール）
                      → 分析結果を SQLite UPSERT
                → update_meta 更新
                → 結果サマリ（同期件数・分析件数・エラー・所要時間）を UI に返却
```

- 起動時の自動全更新は必須としない
- Sync 単位は「アプリが使用するマスタ」。MVP は調教師関連のみ
- Analyze は Sync 成功後に実行。失敗時はマスタのみ更新済みかロールバック方針を `DB_design.md` で定める
- 設定による定期更新は将来オプション
- UI に最終更新日時（Sync/Analyze 完了時刻）を表示する

### 6.2 調教師単体分析（MVP 本線・表示）

```text
利用者: 名前テキスト入力
  → SearchService（SQLite・部分一致候補）
  → 候補選択（trainerId）
  → AnalysisOrchestrator.getAnalysis("trainer", { trainerId })
  → SQLite の分析結果テーブルを読取（表示時に再集計しない）
  → TrainerAnalysisView
      ・本年/前年/累計 賞金（本賞金・付加賞金）
      ・本年/前年/累計 着回数（1〜5着・着外）
      ・勝率・連対率・複勝率（更新時に算出済み）
      ・距離別着回数（芝/ダート × 距離帯）
      ・最近重賞勝利一覧
```

### 6.3 募集馬1頭分析（ダッシュボード埋め込み）

```text
利用者: 必須項目入力（手入力→候補選択を含む）
  → （MVP）フォーム状態を保持。永続化は後続
  → AnalysisDashboard（分析種類プルダウン）
       ├─ trainer 選択時 → 入力済み調教師の分析結果（SQLite）を同一画面に表示
       ├─ farm / pedigree → 骨格ビュー
       └─ similarity → プレースホルダ
```

### 6.4 将来: 強さ・コスパ / 複数頭比較

```text
更新時: StrengthCostModule.materializeAll() → スコアを SQLite へ
表示時: RankingUseCase → SQLite のスコア読取 → ランキング View
  → 1頭選択 → 既存 AnalysisDashboard
```

モジュール境界を先に切っておくことで、MVP コードへの侵入を最小化する。

---

## 7. 技術選定

### 7.1 決定スタック

| 領域 | 選定 | 理由 |
|------|------|------|
| Frontend | **TypeScript + React** | コンポーネント分割・チャート・Electron 親和性 |
| チャート | 実装時選定（Recharts / Chart.js / ECharts 等） | 賞金・着回数・距離別の棒/折れ線が中心 |
| データアクセス | **TypeScript**（SQL クライアント / クエリビルダ） | API サーバ不要。SQL が扱えれば十分 |
| **分析・集計** | **TypeScript**（＋ SQLite SQL） | 更新時に実行。率・集計は標準的。回帰は統計/ML ライブラリ |
| 正本 DB | **PostgreSQL**（既存 JV-DL） | 正規化済み。アプリ外管理 |
| アプリ DB | **SQLite** | マスタスナップショット＋分析結果。通常操作・オフライン |
| デスクトップ | **Electron**（後付け） | Win/Mac 両対応。PG・SQLite・分析を TS で一貫処理 |
| 開発形態 | **ブラウザ + SQLite 先行** | Electron 包装は製品化時 |
| パッケージ管理 | pnpm / npm 等、リポジトリ方針に従う | — |

### 7.2 選定の代替と制約

- **Tauri** は軽量だが、PG 同期 + SQLite + 分析を TypeScript 一貫で扱う方針と噛み合いにくいため採用しない
- **製品向け HTTP API** は持たない（開発用ホストを一時的に置く場合も IPC 置換前提）
- **クラウド DB / マルチユーザー認証**はスコープ外
- 対象 OS: **Windows を主**、**macOS も製品対応**
- 分析を Python に寄せる必要が出た場合は、Analyze 段階のプラグインとして後付け可能とする（MVP では不要）

### 7.3 リポジトリ構成（案）

```text
EquiScoutApp/
  apps/
    web/                 # Presentation (React) ※開発の主戦場
    desktop/             # 将来: Electron シェル
  packages/
    app-core/            # Application + Domain（ユースケース）
    domain/              # 分析ドメイン（純ロジック、UI非依存）※ app-core 内でも可
    db/                  # SQLite スキーマ・マイグレーション（マスタ＋分析結果）
    sync/                # PostgreSQL → SQLite 同期
    analysis/            # 更新時 Analyze（集計・回帰等）※ domain と統合でも可
  doc/
    01_requirement/
    02_design/
```

モノレポとし、Domain / Sync / Analysis を UI から分離してテスト可能にする。

---

## 8. インターフェース方針（API レス）

HTTP REST/GraphQL は採用しない。**ユースケース単位の関数**を境界とし、実行環境だけを差し替える。

| 実行環境 | 呼び出し方 |
|----------|------------|
| ブラウザ開発 | 同一バンドル内、または開発用ホスト経由でユースケース関数を呼ぶ |
| Electron | `ipcMain.handle` / `ipcRenderer.invoke` で同じユースケースを呼ぶ |

### 8.1 MVP で必要なユースケース（論理）

| ユースケース | 概要 |
|--------------|------|
| `searchTrainers(query)` | 調教師名候補（SQLite） |
| `getTrainerAnalysis(trainerId)` | 調教師分析結果の読取（SQLite。表示時は再計算しない） |
| `listAnalysisModules()` | 利用可能分析一覧（feature flag 反映） |
| `updateFromPostgres()` | 更新パイプライン（Sync → Analyze → 結果永続化） |
| `getUpdateStatus()` | 最終更新日時・進捗 |

募集馬の保存・取得（`saveHorse` / `getHorse`）は後続。画面はフォーム状態のみで進めてよい。

### 8.2 ViewModel の原則

- DB の生カラムをそのまま UI に出さない
- **率・スコア等は更新時（Analyze）に算出し SQLite へ保存**。表示ユースケースは読取と軽い整形に留める
- 金額単位の表示換算は Sync または Analyze で行い、UI には解釈済み値を渡す（詳細は DB/UI 設計で確定）

---

## 9. 非機能アーキテクチャ

### 9.1 利用形態

- 単一ユーザー・デスクトップ（製品は Electron）
- 開発はブラウザでも可
- 更新パイプライン実行済みであれば、通常操作は PostgreSQL なしでオフライン利用可能

### 9.2 性能（目安）

| 操作 | 目安 |
|------|------|
| 調教師名検索 | 入力に対しインタラクティブ（SQLite インデックス必須） |
| 調教師分析表示 | 単一 ID の分析結果読取で即時（表示時再集計なし） |
| 手動更新（Sync + Analyze） | バックグラウンド実行＋進捗表示（UI をブロックしない） |

### 9.3 信頼性・データ整合

- Sync / Analyze はトランザクション方針を `DB_design.md` で定める（マスタのみ更新後に Analyze 失敗、など）
- 正本側の削除・更新を SQLite スナップショットに正しく反映する
- 失敗時は部分適用の有無をログに残し、UI で通知
- UI に最終更新日時を出す

### 9.4 セキュリティ・プライバシー

- データはローカルに閉じる
- PostgreSQL 接続情報はローカル設定に保持し、外部送信しない
- Renderer（またはブラウザ）から PG/SQLite へ直接接続せず、Main / データアクセス層経由とする（製品時）
- JV-DL データの再配布は行わない（利用者が正当に保持する PG データを参照する前提）

### 9.5 保守・拡張

- 分析モジュールの追加が Application / UI の大規模改修なしで行えること（Analyze プラグイン）
- 同期対象マスタの追加が Sync プラグイン追加で行えること
- 表示デフォルトのユーザー設定（P1）に備え、ダッシュボードのレイアウト定義をデータ化できる余地を残す（MVP は固定設定オブジェクトで可）

---

## 10. MVP と段階展開

### 10.1 MVP アーキテクチャ上の完了条件

| 項目 | 状態 |
|------|------|
| 調教師関連の PG → SQLite 同期 | 実装 |
| 更新時 Analyze（率算出等）→ SQLite 分析結果へ永続化 | 実装 |
| 調教師検索 → 分析表示（要求の必須可視化一式） | 実装（分析結果の読取） |
| 募集馬入力フォーム＋ダッシュボード枠 | 実装（**永続化は必須としない**） |
| ダッシュボードから調教師分析の埋め込み | 実装（実データ） |
| 牧場・血統・類似馬 | 画面の最低限表示 |
| StrengthCost / 複数頭ランキング | 未実装（拡張点のみ） |
| Electron 包装 | 必須ではない（Win/Mac 対応可能な構造であること） |

### 10.2 ロードマップとアーキテクチャ対応

| フェーズ | 機能 | アーキ対応 |
|----------|------|-----------|
| MVP | 調教師 Sync + Analyze＋他 UI 骨格 | C12/C13/C15 本実装、C14 は調教師のみ |
| MVP 後 | 募集馬の SQLite 永続化 | C10 本実装 |
| P1 | 多年推移・クラス別等 | レース成績 Sync＋Analyze 集計 |
| P1 | 牧場 BR 本実装 → 出身馬リスト | `FarmAnalysis` ＋ Sync/Analyze 追加 |
| P1 | 血統本実装 | `PedigreeAnalysis` + SMILE マッピング |
| P1 | 表示デフォルトのユーザー設定 | レイアウト設定ストア |
| 製品化 | Electron（Win/Mac） | IPC でユースケース接続 |
| v2 / PoC後 | 強さ・コスパ、複数頭ランキング | `StrengthCost` を Analyze に追加 |
| 将来 | PDF/CSV import、外部データ | Sync/Import プラグイン追加 |

---

## 11. 横断的関心事

### 11.1 国際化・文字コード

- JV-DL 由来の氏名は全角・半角カナ混在を含む。同期時に検索用の正規化名カラムを SQLite 側に持つ
- UI は日本語を前提

### 11.2 テスト方針

| 層 | 方針 |
|----|------|
| Domain | 率計算・距離帯集約・（将来）回帰などの単体テストを必須化 |
| Sync | PG フィクスチャ（またはモック）→ SQLite への変換結果検証 |
| Analysis | materialize 結果が SQLite 分析テーブルに期待どおり入ることの検証 |
| Application | ユースケースの結合テスト（SQLite テスト DB） |
| Presentation | 主要画面のスモーク（詳細は UI 設計に従う） |

### 11.3 観測性

- 同期件数・分析件数・エラー件数・所要時間をログ出力
- UI にはユーザー向けの短い結果メッセージと最終更新日時を表示

---

## 12. 未決事項・他設計への委譲

| 項目 | 状態 | 委譲先 |
|------|------|--------|
| SQLite テーブル・インデックス詳細（マスタ／分析結果の分離） | 未決 | `DB_design.md` |
| PG 定義書とのカラムマッピング | 未決 | `DB_design.md`（Excel 定義書を根拠） |
| Sync 成功後 Analyze 失敗時の整合方針 | 未決 | `DB_design.md` |
| 画面ワイヤ・コンポーネント詳細 | 未決 | `UI_design.md` |
| SQLite ファイル配置（ユーザーデータディレクトリ等） | 未決 | `DB_design.md` / 実装時 |
| PG 接続設定の UX | 未決 | UI / Config |
| 強さ/コスパ計算式・回帰の具体 | 未定（PoC） | PoC 報告書 → StrengthCost 実装 |
| 類似馬の定義 | 未定（PoC） | Similarity 実装時 |
| SMILE 距離帯の境界値 | 実装時確定 | Pedigree / DB |
| 定期更新の有無 | 任意（非必須） | Config + スケジューラ |
| ブラウザ開発時の SQLite/PG ホスト方式 | 実装時確定 | 開発用ホスト or 同等 |
| 統計/回帰ライブラリの最終選定 | 実装時（PoC 前でも可） | `analysis` パッケージ |

---

## 13. まとめ

EquiScout は **PostgreSQL 上の JV-DL を正本**とし、**SQLite にマスタスナップショットと分析結果**を持つローカル分析アプリとする。手動更新は **Sync（PG→SQLite）→ Analyze（TypeScript 集計・指標）→ 結果を SQLite へ永続化** のパイプラインとし、表示は再計算せず読取に徹する。HTTP API は持たず、ユースケース関数（のち Electron IPC）で結ぶ。MVP では調教師の Sync/Analyze と表示を縦に貫通させ、募集馬は画面先行、牧場・血統・類似・スコアは同一モジュール枠で後付けする。開発はブラウザ + SQLite、製品は Windows / macOS の Electron を後付けする。
