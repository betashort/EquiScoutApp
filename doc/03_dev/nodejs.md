# Node.js / npm

| 項目 | 内容 |
|------|------|
| ツール | Node.js / npm（版管理: **fnm**） |
| 固定バージョン | Node.js **26.5.0** / npm **11.17.0** |
| 固定基準日 | 2026-07-26 |
| 親索引 | [`README.md`](./README.md) |

---

## 1. 目的

EquiScout のフロント（Vite / React）および将来の TypeScript 分析・同期処理を動かすためのランタイムとパッケージマネージャを揃える。  
他アプリ開発でも Node を使うため、**fnm** でホスト上の Node 版を切り替える。

---

## 2. 前提

- 開発は **ホスト OS**（macOS / Windows）上で行う
- **Docker は使わない**（[`README.md`](./README.md) 参照）
- パッケージマネージャは **npm のみ**（pnpm / yarn は使わない）
- Node の版管理は **fnm** を推奨する（公式 MSI 単体インストールは非推奨）
- 本手順は環境構築の文書化のみ。実際のインストールは別途実施する

---

## 3. 方針（A）

| # | 方針 | 理由 |
|---|------|------|
| 1 | Node.js は文書時点の **最新安定版（Current）を固定**する | 再現性のため。上げるときは文書も更新 |
| 2 | ホストの Node は **fnm** で入れる・切り替える | 複数アプリ・複数版を衝突なく扱うため |
| 3 | プロジェクトの正の版は **`.nvmrc`** に書く | `cd` 時の自動切替・チーム共有のため |
| 4 | npm は **その Node 同梱版** を使う | 追加で npm を上げ下げしない |
| 5 | グローバル依存は最小限にする | プロジェクト依存は各 app の `package.json` に閉じる |
| 6 | バージョン確認を日常の入口にする | チーム・端末差を早期に検知する |

固定値:

```text
Node.js  26.5.0
npm      11.17.0
```

公式: [fnm (Schniz/fnm)](https://github.com/Schniz/fnm)

---

## 4. インストール / 初回セットアップ（B）

### 4.1 fnm のインストール

#### Windows（推奨: winget）

```powershell
winget install Schniz.fnm
```

代替:

```powershell
scoop install fnm
# または
choco install fnm
```

インストール後、**ターミナルを一度閉じて開き直す**（PATH 反映）。

#### macOS（推奨: Homebrew）

```bash
brew install fnm
```

代替（curl スクリプト）:

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

### 4.2 シェル設定（必須）

fnm はシェル起動時に `fnm env` を評価しないと `node` が PATH に乗らない。  
`--use-on-cd` を付けると、ディレクトリ移動時に `.nvmrc` / `.node-version` を読んで自動切替する。

#### PowerShell（Windows）

1. プロファイルが無ければ作成する:

```powershell
if (-not (Test-Path $profile)) { New-Item $profile -Force }
```

2. プロファイルを開き、末尾に次を追加する:

```powershell
Invoke-Item $profile
```

追加する行:

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

3. ターミナルを開き直す。

実行ポリシーでプロファイルが弾かれる場合（例: `RemoteSigned`）:

```powershell
Get-ExecutionPolicy
# Restricted なら、管理者 PowerShell で例:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### zsh（macOS 既定）

`~/.zshrc` に追加:

```bash
eval "$(fnm env --use-on-cd --shell zsh)"
```

#### bash

`~/.bashrc` に追加:

```bash
eval "$(fnm env --use-on-cd --shell bash)"
```

### 4.3 EquiScout 用 Node の導入

```bash
fnm install 26.5.0
fnm use 26.5.0
# このシェル以降の既定にする場合:
fnm default 26.5.0
```

リポジトリ直下に `.nvmrc` がある場合（推奨・後述）:

```bash
# リポジトリルートで
fnm install   # .nvmrc の版を入れる
fnm use       # .nvmrc の版に切替
```

### 4.4 インストール後の確認

```bash
fnm --version
node -v
# 期待: v26.5.0

npm -v
# 期待: 11.17.0
```

### 4.5 公式インストーラとの関係

- **新規端末は fnm のみ**で Node を入れる
- すでに nodejs.org の MSI / pkg で入れている場合は、PATH が競合しやすい  
  → 公式インストールをアンインストールするか、PATH 上で fnm 側が優先されることを確認する
- `where node`（Windows）/ `which node`（macOS）で、fnm 管理下のパスになっていること

### 4.6 プロジェクトでの利用（後続手順への接続）

Node / npm が通ったあと:

1. [`vite-react.md`](./vite-react.md) でフロントを作成
2. [`storybook.md`](./storybook.md) で Storybook を導入

---

## 5. 日常開発コマンド（C）

### 5.1 Node / npm

| 目的 | コマンド |
|------|----------|
| Node 版確認 | `node -v` |
| npm 版確認 | `npm -v` |
| 依存インストール（各パッケージで） | `npm install` |
| スクリプト実行 | `npm run <script>` |

グローバルへのツール常設は避け、可能な限り `npx` または `package.json` の scripts 経由にする。

### 5.2 fnm（版管理）

| 目的 | コマンド |
|------|----------|
| インストール済み一覧 | `fnm list` |
| リモートの利用可能版を見る | `fnm list-remote` |
| 特定版を入れる | `fnm install 26.5.0` |
| `.nvmrc` の版を入れる | `fnm install`（プロジェクト直下で） |
| 特定版に切替（現在のシェル） | `fnm use 26.5.0` |
| `.nvmrc` の版に切替 | `fnm use` |
| シェル既定版を設定 | `fnm default 26.5.0` |
| 現在の版 | `fnm current` |
| 不要な版を削除 | `fnm uninstall 22.14.0` |

**他アプリで別版を使う例:**

```bash
# 別プロジェクト用に LTS などを入れる
fnm install 22.14.0

# そのプロジェクトの .nvmrc が 22.14.0 なら、cd だけで切替（--use-on-cd 設定時）
cd path/to/other-app
node -v
```

EquiScout に戻ると `.nvmrc`（26.5.0）へ自動で戻る。

---

## 6. 設定例

### 6.1 `.nvmrc`（推奨・リポジトリルート）

fnm は `.nvmrc` と `.node-version` の両方を読む。本 PJ では **`.nvmrc`** を正とする。

```text
26.5.0
```

置き場所: リポジトリルート（EquiScoutApp 直下）。  
`--use-on-cd` 済みなら、ルートに `cd` したタイミングで 26.5.0 に切り替わる。

### 6.2 エンジン宣言（推奨・プロジェクト作成後）

フロントの `package.json` に次を置くと、誤った Node でのインストールを防ぎやすい。

```json
{
  "engines": {
    "node": "26.5.0",
    "npm": "11.17.0"
  }
}
```

厳密一致が運用上厳しければ `"node": ">=26.5.0"` などへ緩和してよいが、**文書上の正は 26.5.0** とする。

### 6.3 版を上げるとき

1. `fnm install <新版>` → `fnm use <新版>` で確認
2. `.nvmrc`・本ファイル・[`README.md`](./README.md) の固定表・`package.json` の `engines` を同じ変更で更新
3. `node -v` / `npm -v` が文書と一致することを確認

---

## 7. よくあるトラブル

| 症状 | 確認・対処 |
|------|------------|
| `fnm` が無い | winget / brew の完了、ターミナル再起動、PATH を確認 |
| `Can't find the necessary environment variables` | シェルに `fnm env ...` が未設定。4.2 を実施しターミナルを開き直す |
| `node` / `npm` が無い | 上記シェル設定のあと `fnm install` / `fnm use` を実行 |
| 版が異なる（例: v24.x） | `fnm use 26.5.0`、またはルートで `fnm use`。公式 MSI の Node が PATH 優先していないか確認 |
| `cd` しても版が変わらない | プロファイルに `--use-on-cd` があるか確認。プロジェクト直下に `.nvmrc` があるか確認 |
| PowerShell でプロファイルが実行されない | `Get-ExecutionPolicy`。必要なら `RemoteSigned`（CurrentUser）へ |
| npm だけ古い / 新しい | Node を fnm の 26.5.0 に戻し、同梱 npm を使う（`npm i -g npm` しない） |
| 権限エラー（`EACCES`） | グローバル領域への書き込みを避ける。プロジェクトローカルの `npm install` を使う |
| Apple Silicon / Intel の取り違え | 自分の Mac のアーキ向けバイナリを選ぶ（fnm が解決する） |

---

## 関連

- 次: [`vite-react.md`](./vite-react.md)
- 索引: [`README.md`](./README.md)
- fnm 公式: [https://github.com/Schniz/fnm](https://github.com/Schniz/fnm)
