# PoC Python 環境（uv）

PoC の分析・実験用 Python 環境は [uv](https://docs.astral.sh/uv/) で構築する。

| 項目 | 値 |
|------|-----|
| 想定 Python | 3.12 |
| 作業ディレクトリ | `PoC/`（または各 PoC の `work/`） |
| パッケージ管理 | `pyproject.toml` + `uv.lock` |

---

## 1. uv のインストール

### Windows（PowerShell）

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

WinGet の場合:

```powershell
winget install --id=astral-sh.uv -e
```

### macOS / Linux

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

インストール後、ターミナルを開き直して確認する。

```powershell
uv --version
```

アップデート:

```powershell
uv self update
```

---

## 2. Python のインストール

uv が Python 本体も管理できる。PoC では 3.12 を使う。

```powershell
uv python install 3.12
```

利用可能なバージョンの確認:

```powershell
uv python list
```

---

## 3. プロジェクト初期化

`PoC/` で初回のみ実行する。

```powershell
cd PoC
uv init --python 3.12
```

これで `pyproject.toml` などが生成される。既存の `README.md` などと衝突する場合は、手動で `pyproject.toml` を置くか、`--name equiscout-poc` など名前を指定する。

既に `pyproject.toml` がある場合はスキップし、次へ進む。

---

## 4. 仮想環境の作成

```powershell
cd PoC
uv venv --python 3.12
```

`.venv/` が作成される。有効化は任意（`uv run` を使えば不要）。

| OS | 有効化コマンド |
|----|----------------|
| Windows (PowerShell) | `.venv\Scripts\Activate.ps1` |
| macOS / Linux | `source .venv/bin/activate` |

---

## 5. 依存パッケージの追加

例（分析でよく使うもの）:

```powershell
uv add pandas numpy matplotlib jupyter
```

開発用のみ:

```powershell
uv add --dev ruff pytest
```

インストール（`pyproject.toml` / `uv.lock` から同期）:

```powershell
uv sync
```

---

## 6. 実行方法

仮想環境を有効化しなくても、`uv run` で実行できる。

```powershell
uv run python script.py
uv run jupyter lab
uv run python -c "import sys; print(sys.version)"
```

---

## 7. よく使うコマンド

| コマンド | 用途 |
|----------|------|
| `uv python install 3.12` | Python 3.12 を入れる |
| `uv venv --python 3.12` | 仮想環境を作る |
| `uv add <pkg>` | 依存を追加してインストール |
| `uv remove <pkg>` | 依存を削除 |
| `uv sync` | lock に合わせて環境を揃える |
| `uv run <cmd>` | 環境内でコマンド実行 |
| `uv lock` | lock ファイルを更新 |
| `uv self update` | uv 自体を更新 |

---

## 8. Git について

`.venv/` はコミットしない。リポジトリルートの `.gitignore` に以下を含めること。

```
.venv/
__pycache__/
*.pyc
.ipynb_checkpoints/
```

`pyproject.toml` と `uv.lock` は共有する（再現性のため）。

---

## 参考

- [uv 公式ドキュメント](https://docs.astral.sh/uv/)
- [Installing Python](https://docs.astral.sh/uv/guides/install-python/)
- [Working on projects](https://docs.astral.sh/uv/guides/projects/)
