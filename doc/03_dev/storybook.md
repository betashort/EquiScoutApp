# Storybook

| 項目 | 内容 |
|------|------|
| ツール | Storybook（React + Vite） |
| 固定バージョン | Storybook **10.5.4** |
| 固定基準日 | 2026-07-26 |
| 親索引 | [`README.md`](./README.md) |

---

## 1. 目的

画面仕様のレビュー面として、本番と同系統の React コンポーネントを状態別に可視化する。  
正本は画面仕様（[`UI_design.md`](../02_design/UI_design.md)）、Storybook はレビュー面・実装の種とする。

詳細なライフサイクルは [`storybook_ui_design_lifecycle.md`](../99_knowhow/storybook_ui_design_lifecycle.md) を参照。

---

## 2. 前提

- [`vite-react.md`](./vite-react.md) どおり、Vite + React + TypeScript のフロントが存在する（または同時に用意する）
- Node.js **26.5.0** / npm **11.17.0**
- Storybook は **UI 実装パッケージと同じ場所**に置く（`doc/` 配下では管理しない）
- ホスト OS 上で実行する（Docker 不使用）

---

## 3. 方針（A）

| # | 方針 | 理由 |
|---|------|------|
| 1 | Storybook を UI ツリー（例: `apps/web`）に同居させる | バンドラ・コンポーネント・スタイルを本線と共有する |
| 2 | 版は **10.5.4** に固定する | 文書時点の最新安定版 |
| 3 | モック props / ViewModel で状態を並べる | 空・読込中・成功・エラー・プレースホルダを仕様どおり確認する |
| 4 | 見た目で決まったことは画面仕様へ書き戻す | Story が正本を侵食しない |
| 5 | HTML モックは任意の下書きに留める | 本番コンポーネント + Story を主戦場にする |

固定値:

```text
storybook  10.5.4
```

（`@storybook/*` 関連パッケージも CLI 導入後に **10.5.4 系**へ揃える。）

先に用意する Story の目安（ノウハウより）:

| 単位 | 主な状態例 |
|------|------------|
| アプリシェル | 既定レイアウト |
| 主入力フォーム | 初期 / バリデーションエラー |
| 主結果ビュー | 空 / 読込中 / 成功 / エラー |
| 共用パネル | 単体 / 埋め込み |
| 未実装枠 | プレースホルダ |
| 更新など非同期 UI | 未実行 / 実行中 / 成功 / 失敗 |

---

## 4. インストール / 初回セットアップ（B）

> 以下は手順書である。本書作成時点ではリポジトリへの実実行は行わない。

### 4.1 導入

フロントルート（例: `apps/web`）で:

```bash
cd apps/web
npm create storybook@10.5.4
```

対話プロンプトでは、既存の Vite + React プロジェクト向けの推奨を選ぶ。

### 4.2 版の固定確認

```bash
npm ls storybook
```

期待: `storybook@10.5.4`（および同系の `@storybook/*`）。  
ずれている場合:

```bash
npx storybook@10.5.4 upgrade
```

または `package.json` の Storybook 関連依存を 10.5.4 に揃えてから `npm install`。

### 4.3 配置の確認

導入後、おおむね次があること:

```text
apps/web/
  .storybook/          # 設定
  src/
    **/*.stories.*     # コンポーネント隣、または stories/ 配下
```

`doc/` 配下に Storybook プロジェクトを作らない。

### 4.4 初回起動確認

```bash
npm run storybook
```

ブラウザで Storybook UI が開けば導入完了。

---

## 5. 日常開発コマンド（C）

フロントルートで:

| 目的 | コマンド |
|------|----------|
| Storybook 開発サーバ | `npm run storybook` |
| 静的エクスポート（必要な場合） | `npm run build-storybook` |

本線アプリ（`npm run dev`）と Storybook は別ポートで並走してよい。  
レビューサイクル: 仕様 → Story → レビュー → 仕様更新 → 本線接続（ノウハウ参照）。

---

## 6. 設定例

### 6.1 `package.json` scripts（目安）

CLI が追加する典型:

```json
{
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "devDependencies": {
    "storybook": "10.5.4"
  }
}
```

（実際の `@storybook/react-vite` 等は CLI が追加した一覧を 10.5.4 系に揃える。）

### 6.2 Story の置き方（例）

```ts
// src/components/TrainerAnalysisView.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TrainerAnalysisView } from "./TrainerAnalysisView";

const meta = {
  title: "Analysis/TrainerAnalysisView",
  component: TrainerAnalysisView,
} satisfies Meta<typeof TrainerAnalysisView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { /* 空状態の ViewModel */ } };
export const Loading: Story = { args: { /* 読込中 */ } };
export const Success: Story = { args: { /* 成功データ */ } };
export const ErrorState: Story = { args: { /* エラー */ } };
```

コンポーネント名は実装時の実際の名前に合わせる。ここでは状態カタログの型だけを示す。

---

## 7. よくあるトラブル

| 症状 | 確認・対処 |
|------|------------|
| `doc/` 配下に Storybook を置いてしまった | UI パッケージへ移す。依存・設定を本線 Vite と共有する |
| Vite / React の版と Storybook が噛み合わない | 本文書と [`vite-react.md`](./vite-react.md) の固定版に揃える |
| Story はあるが仕様と矛盾する | 画面仕様を更新する（Story だけで正本を上書きしない） |
| ページ全体 Story だけが増える | パネル・部品単位の状態カタログも用意する |
| ポート 6006 が使用中 | `-p` で別ポートにするか、占有プロセスを止める |

---

## 関連

- 前: [`vite-react.md`](./vite-react.md)
- ノウハウ: [`storybook_ui_design_lifecycle.md`](../99_knowhow/storybook_ui_design_lifecycle.md)
- 画面正本: [`UI_design.md`](../02_design/UI_design.md)
- 索引: [`README.md`](./README.md)
