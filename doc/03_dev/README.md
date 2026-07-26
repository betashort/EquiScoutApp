# EquiScout 開発環境ドキュメント

| 項目 | 内容 |
|------|------|
| 対象 | EquiScout の開発環境（ホストマシン上） |
| 根拠 | [`architecture.md`](../02_design/architecture.md) / [`storybook_ui_design_lifecycle.md`](../99_knowhow/storybook_ui_design_lifecycle.md) |
| 作成日 | 2026-07-26 |
| 更新日 | 2026-07-26 |
| バージョン固定基準日 | 2026-07-26（各ツールの最新安定版を固定記載） |

---

## 1. 目的

開発に必要なツールの方針（A）・初回セットアップ（B）・日常コマンド（C）を、ツールごとのドキュメントとして管理する。  
本書は全体図と索引である。手順の詳細は各ファイルを正とする。

---

## 2. 全体方針

| # | 方針 | 備考 |
|---|------|------|
| 1 | **ホストマシン上**で Node / フロントを動かす | Docker は採用しない |
| 2 | **ブラウザ + Vite** で UI を先行開発する | Electron は後付け・今回スコープ外 |
| 3 | パッケージマネージャは **npm** | pnpm / yarn は使わない |
| 4 | Storybook は **UI 実装と同じ場所**に置く | `doc/` 配下では管理しない |
| 5 | SQLite / PostgreSQL / 開発用ホスト / Electron | **未定のため本書では扱わない** |

### 2.1 Docker を採用しない理由（要約）

- 本 PJ の製品形態は将来 Electron を想定する。GUI デスクトップをコンテナで日常開発するのは相性が悪い
- 当面の主戦場は Vite ブラウザ開発であり、ホスト実行で十分揃う
- DB（SQLite / PG）の扱いも未定のため、コンテナ前提を置かない

---

## 3. 全体図

```text
[開発者のホスト OS: macOS / Windows]
        │
        ├─ fnm → Node.js + npm    ← nodejs.md
        │
        └─ フロント（想定: apps/web または同等）
              ├─ Vite + React + TypeScript   ← vite-react.md
              └─ Storybook                   ← storybook.md

（後続・未定）
  SQLite / PostgreSQL / 開発用ホスト / Electron / テストランナー
```

アーキテクチャ上のリポジトリ案（`apps/web` 等）は [`architecture.md` 7.3](../02_design/architecture.md) を参照。モノレポ手順書は今回作成しない。

---

## 4. 固定バージョン一覧（2026-07-26 時点）

| ツール | 固定バージョン | 詳細 |
|--------|----------------|------|
| fnm | （ホストの Node 版管理・推奨） | [`nodejs.md`](./nodejs.md) |
| Node.js | **26.5.0**（Current） | 同上 |
| npm | **11.17.0**（Node 同梱） | 同上 |
| Vite | **8.1.5** | [`vite-react.md`](./vite-react.md) |
| React / react-dom | **19.2.8** | 同上 |
| TypeScript | **7.0.2** | 同上 |
| @vitejs/plugin-react | **6.0.4** | 同上 |
| Storybook | **10.5.4** | [`storybook.md`](./storybook.md) |

バージョンを上げるときは、この表と各ツール文書を同じコミットで更新する。

---

## 5. 推奨セットアップ順

1. [Node.js + npm](./nodejs.md) で **fnm** を入れ、Node **26.5.0** を有効化する
2. [Vite + React + TypeScript](./vite-react.md) でフロント骨格を作る
3. [Storybook](./storybook.md) を同じ UI ツリーに入れる

---

## 6. ドキュメント索引

| ファイル | 内容 | A / B / C |
|----------|------|-----------|
| [`nodejs.md`](./nodejs.md) | fnm・Node.js・npm | 方針 / fnm 導入 / 版切替 / 日常確認 |
| [`vite-react.md`](./vite-react.md) | Vite・React・TypeScript | 方針 / プロジェクト作成 / dev・build |
| [`storybook.md`](./storybook.md) | Storybook | 方針 / 導入 / storybook 起動 |

各ファイルの定型見出し:

1. 目的  
2. 前提  
3. 方針（A）  
4. インストール / 初回セットアップ（B）  
5. 日常開発コマンド（C）  
6. 設定例  
7. よくあるトラブル  

---

## 7. 今回スコープ外（追記予定）

| 領域 | 状態 |
|------|------|
| SQLite | 未定 |
| PostgreSQL（JV-DL 正本接続） | 未定 |
| ブラウザ開発用の薄いローカルホスト | 未定 |
| Electron | 未定（製品化時） |
| テストランナー（Vitest 等） | 今回含めない |
| Docker / Dev Container | **採用しない** |
| モノレポ手順書 | 今回書かない |

---

## 8. 関連ドキュメント

- [`doc/02_design/architecture.md`](../02_design/architecture.md) — 論理構成・技術選定
- [`doc/02_design/UI_design.md`](../02_design/UI_design.md) — 画面仕様（正本）
- [`doc/99_knowhow/storybook_ui_design_lifecycle.md`](../99_knowhow/storybook_ui_design_lifecycle.md) — Storybook ライフサイクル
