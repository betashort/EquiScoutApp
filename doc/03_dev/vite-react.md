# Vite / React / TypeScript

| 項目 | 内容 |
|------|------|
| ツール | Vite / React / TypeScript / @vitejs/plugin-react |
| 固定バージョン | Vite **8.1.5** / React **19.2.8** / TypeScript **7.0.2** / plugin-react **6.0.4** |
| 固定基準日 | 2026-07-26 |
| 親索引 | [`README.md`](./README.md) |

---

## 1. 目的

EquiScout の Presentation（UI）を、ブラウザ上で高速に開発できる Vite + React + TypeScript 環境として定義する。  
アーキテクチャの「Web コア先行、Electron 後付け」に対応する開発の主戦場である。

---

## 2. 前提

- [`nodejs.md`](./nodejs.md) のとおり Node.js **26.5.0** / npm **11.17.0** が入っていること
- ホスト OS 上で実行する（Docker 不使用）
- SQLite / PostgreSQL / Electron は未定のため、本手順では **UI 骨格とビルドまで**を扱う
- 配置の想定は `apps/web`（または同等のフロントルート）。モノレポ手順書は別途作成しない

---

## 3. 方針（A）

| # | 方針 | 理由 |
|---|------|------|
| 1 | バンドラは **Vite** | 開発体験・React 親和・Electron 化時も資産を流用しやすい |
| 2 | UI は **React + TypeScript** | アーキ技術選定どおり |
| 3 | テンプレートは公式 `create-vite` の React + TS | 初期構成の差を減らす |
| 4 | バージョンは文書の固定値に合わせる | `@latest` だけに頼らず、導入後に版を確認・固定する |
| 5 | 本線アプリと Storybook は同じ UI ツリー | ノウハウどおり。実装とレビュー面を乖離させない |

固定値:

```text
vite                     8.1.5
react / react-dom        19.2.8
typescript               7.0.2
@vitejs/plugin-react     6.0.4
@types/react             19.2.17
@types/react-dom         19.2.3
create-vite（スキャフォールド用）  9.1.1
```

---

## 4. インストール / 初回セットアップ（B）

> 以下は手順書である。本書作成時点ではリポジトリへの実実行は行わない。

### 4.1 プロジェクト作成

リポジトリルート（またはフロントを置く親ディレクトリ）で:

```bash
npm create vite@9.1.1 web -- --template react-ts
```

モノレポ案に合わせる場合の例:

```bash
mkdir -p apps
npm create vite@9.1.1 apps/web -- --template react-ts
cd apps/web
```

### 4.2 依存のインストールと版の固定確認

```bash
cd apps/web   # 実際のパスに合わせる
npm install
```

導入後、次が固定値と一致することを確認する（ずれていれば指定版で入れ直す）:

```bash
npm ls vite react react-dom typescript @vitejs/plugin-react
```

必要なら明示インストール例:

```bash
npm install react@19.2.8 react-dom@19.2.8
npm install -D vite@8.1.5 typescript@7.0.2 @vitejs/plugin-react@6.0.4
npm install -D @types/react@19.2.17 @types/react-dom@19.2.3
```

### 4.3 動作確認（初回）

```bash
npm run dev
```

ブラウザで表示されればフロント骨格のセットアップ完了。続けて [`storybook.md`](./storybook.md) を実施する。

---

## 5. 日常開発コマンド（C）

`apps/web`（フロントルート）で実行する想定。

| 目的 | コマンド |
|------|----------|
| 開発サーバ起動 | `npm run dev` |
| 本番向けビルド | `npm run build` |
| ビルド結果のプレビュー | `npm run preview` |
| 依存の再インストール | `npm install` |

デフォルトの開発 URL は Vite 既定（多くは `http://localhost:5173`）。変更した場合はチームで共有する。

---

## 6. 設定例

### 6.1 `package.json`（scripts の目安）

`create-vite` 生成後の典型:

```json
{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@types/react": "19.2.17",
    "@types/react-dom": "19.2.3",
    "@vitejs/plugin-react": "6.0.4",
    "typescript": "7.0.2",
    "vite": "8.1.5"
  }
}
```

（生成テンプレートの他スクリプト・依存はそのまま残してよい。上表は版の正とする。）

### 6.2 `vite.config.ts`（最小）

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

### 6.3 TypeScript

- `tsconfig` は `create-vite` の React-TS テンプレートを起点にする
- アプリコードは TypeScript を必須とする（アーキ方針）

---

## 7. よくあるトラブル

| 症状 | 確認・対処 |
|------|------------|
| `npm create vite` で別メジャーが入る | `npm create vite@9.1.1` のように版を指定する |
| React / Vite の版が文書と違う | `npm ls` で確認し、上記の明示インストールで揃える |
| ポートが既に使われている | Vite 起動時の別ポート案内に従うか、占有プロセスを止める |
| パス alias が効かない | `vite.config.ts` と `tsconfig` の `paths` を両方設定する（導入時に必要なら） |
| Electron を今すぐ求めている | 未定・スコープ外。まずはブラウザの `npm run dev` で進める |

---

## 関連

- 前: [`nodejs.md`](./nodejs.md)
- 次: [`storybook.md`](./storybook.md)
- 設計: [`architecture.md`](../02_design/architecture.md)（ブラウザ + SQLite 先行）
- 索引: [`README.md`](./README.md)
