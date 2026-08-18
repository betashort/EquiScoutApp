"""コントレイル産駒 成績調査の一括実行。"""

from __future__ import annotations

import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from analyze import run_analyze
from db import get_engine
from extract import run_extract
from report import run_report


def main() -> None:
    engine = get_engine()
    print("[run] extract")
    run_extract(engine)
    print("[run] analyze")
    run_analyze()
    print("[run] report")
    run_report()
    print("[run] done -> notes.md / result.md")


if __name__ == "__main__":
    main()
