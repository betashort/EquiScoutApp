"""PC-KEIBA PostgreSQL 接続（読み取り専用）。

接続 URL は次の順で読む。パスワードはログに出さない。

1. 環境変数 EQUISCOUT_PG_URL
2. EQUISCOUT_PG_HOST / PORT / DATABASE / USER / PASSWORD
3. 作業ディレクトリの .db_url（1 行、非コミット）
4. PoC/.env または本ディレクトリの .env（EQUISCOUT_PG_*）
"""

from __future__ import annotations

import os
from pathlib import Path
from urllib.parse import quote_plus, urlparse, urlunparse

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

HERE = Path(__file__).resolve().parent
POC_ROOT = HERE.parents[3]
SEARCH_ROOT = HERE.parent


def _strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def _load_env_file(path: Path) -> None:
    if not path.is_file():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if key and key not in os.environ:
            os.environ[key] = _strip_quotes(value)


def _redact_url(url: str) -> str:
    parsed = urlparse(url)
    host = parsed.hostname or ""
    port = parsed.port or 5432
    db = (parsed.path or "/").lstrip("/")
    user = parsed.username or ""
    return f"{user}@{host}:{port}/{db}"


def _url_from_parts() -> str | None:
    database = os.environ.get("EQUISCOUT_PG_DATABASE")
    user = os.environ.get("EQUISCOUT_PG_USER")
    if not database or not user:
        return None
    host = os.environ.get("EQUISCOUT_PG_HOST", "127.0.0.1")
    port = os.environ.get("EQUISCOUT_PG_PORT", "5432")
    password = os.environ.get("EQUISCOUT_PG_PASSWORD", "")
    auth = quote_plus(user)
    if password:
        auth = f"{auth}:{quote_plus(password)}"
    return f"postgresql+psycopg://{auth}@{host}:{port}/{database}"


def resolve_url() -> str:
    for env_path in (POC_ROOT / ".env", SEARCH_ROOT / ".env", HERE / ".env"):
        _load_env_file(env_path)

    url = os.environ.get("EQUISCOUT_PG_URL", "").strip()
    if url:
        return url

    parts = _url_from_parts()
    if parts:
        return parts

    db_url_file = HERE / ".db_url"
    if db_url_file.is_file():
        line = db_url_file.read_text(encoding="utf-8").strip().splitlines()[0].strip()
        if line:
            return line

    raise RuntimeError(
        "PostgreSQL の接続情報が見つかりません。"
        " EQUISCOUT_PG_URL か EQUISCOUT_PG_USER / EQUISCOUT_PG_PASSWORD /"
        " EQUISCOUT_PG_DATABASE を設定するか、work/.db_url に URL を 1 行書いてください。"
        " 例: postgresql+psycopg://USER:PASSWORD@127.0.0.1:5432/jvd"
    )


def get_engine() -> Engine:
    url = resolve_url()
    print(f"[db] connect {_redact_url(url)}")
    return create_engine(
        url,
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": 10,
            "options": "-c statement_timeout=900s",
        },
    )
