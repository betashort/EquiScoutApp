# Tailwind CSS

| 項目 | 内容 |
|------|------|
| ツール | Tailwind CSS（Vite プラグイン） |
| 固定バージョン | tailwindcss **4.3.3** / @tailwindcss/vite **4.3.3** |
| 固定基準日 | 2026-08-09 |
| 親索引 | [`README.md`](./README.md) |

---

## 1. 目的

EquiScout の UI（Vite + React）でユーティリティクラスによるスタイリングを行うため、Tailwind CSS の導入手順を固定する。  
本 PJ では **v4 + 公式 Vite プラグイン**を正とする。

---

## 2. 前提

- [`vite-react.md`](./vite-react.md) どおり、Vite + React + TypeScript のフロントが存在する
- Node.js **26.5.0** / npm **11.17.0**（[`nodejs.md`](./nodejs.md)）
- 配置の想定は `apps/web`（または同等のフロントルート）
- ホスト OS 上で実行する（Docker 不使用）
- パッケージマネージャは **npm のみ**

---

## 3. 方針（A）

| # | 方針 | 理由 |
|---|------|------|
| 1 | **Tailwind CSS v4** を採用する | 現行の推奨メジャー。v3 の PostCSS 手順は使わない |
| 2 | 統合は **`@tailwindcss/vite`** | 公式が Vite 向けに推奨。PostCSS / CLI は本線にしない |
| 3 | `tailwind.config.js` は作らない | v4 は CSS ファースト（`@import` / `@theme`） |
| 4 | 版は文書の固定値に合わせる | `@latest` だけに頼らず、導入後に版を確認・固定する |
| 5 | 本線アプリと Storybook で同じ CSS 入口を共有する | UI ツリー同居方針に合わせる |

固定値:

```text
tailwindcss         4.3.3
@tailwindcss/vite   4.3.3
```

公式: [Installing Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite)

---

## 4. インストール / 初回セットアップ（B）

> 以下は手順書である。本書作成時点ではリポジトリへの実実行は行わない。

### 4.1 パッケージのインストール

フロントルート（例: `apps/web`）で:

```bash
cd apps/web
npm install -D tailwindcss@4.3.3 @tailwindcss/vite@4.3.3
```

導入後、固定値と一致することを確認する:

```bash
npm ls tailwindcss @tailwindcss/vite
```

### 4.2 Vite プラグインの設定

`vite.config.ts` に `@tailwindcss/vite` を追加する（既存の React プラグインと併用）:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### 4.3 CSS 入口への取り込み

アプリの CSS（例: `src/index.css`）を次の内容にする（または先頭に追加する）:

```css
@import "tailwindcss";
```

v3 の `@tailwind base;` / `@tailwind components;` / `@tailwind utilities;` は **使わない**。

`main.tsx`（エントリ）からその CSS が import されていることを確認する:

```ts
import "./index.css";
```

### 4.4 動作確認

```bash
npm run dev
```

任意のコンポーネントでユーティリティが効けば完了例:

```tsx
<h1 className="text-3xl font-bold underline">Hello world!</h1>
```

Storybook を使う場合は、プレビュー側でも同じ CSS を読む（例: `.storybook/preview.ts` で `../src/index.css` を import）。詳細は [`storybook.md`](./storybook.md) と合わせて確認する。

---

## 5. 日常開発コマンド（C）

Tailwind 専用の npm script は不要。Vite / Storybook の既存コマンドでビルドに含まれる。

| 目的 | コマンド |
|------|----------|
| 開発サーバ（本線） | `npm run dev` |
| Storybook | `npm run storybook` |
| 本番向けビルド | `npm run build` |

---

## 6. 設定例

### 6.1 `package.json`（devDependencies 抜粋）

```json
{
  "devDependencies": {
    "@tailwindcss/vite": "4.3.3",
    "tailwindcss": "4.3.3"
  }
}
```

### 6.2 テーマのカスタム（任意）

v4 では JS の `theme` 設定ではなく、CSS の `@theme` を使う:

```css
@import "tailwindcss";

@theme {
  --color-brand: #0f766e;
  --font-sans: "Segoe UI", ui-sans-serif, system-ui, sans-serif;
}
```

---

## 7. よくあるトラブル

| 症状 | 確認・対処 |
|------|------------|
| クラスを書いてもスタイルが付かない | `vite.config.ts` に `tailwindcss()` があるか、CSS に `@import "tailwindcss";` があるか、エントリから CSS を import しているかを確認 |
| `@tailwind base;` が効かない / 古い手順を参照している | v3 の手順。v4 では `@import "tailwindcss";` に切り替える |
| `npx tailwindcss init` が期待どおり動かない | v4 では init 不要。Vite プラグイン手順に従う |
| Storybook だけスタイルが無い | `.storybook/preview` から本線と同じ CSS を import する |
| 版が文書と違う | `npm ls` で確認し、`npm install -D tailwindcss@4.3.3 @tailwindcss/vite@4.3.3` で揃える |

---

## 関連

- 前: [`vite-react.md`](./vite-react.md)
- 併読: [`storybook.md`](./storybook.md)
- 索引: [`README.md`](./README.md)
