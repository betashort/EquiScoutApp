"""notes.md / result.md を生成する。"""

from __future__ import annotations

import json
from pathlib import Path

from codes import (
    BABA,
    CLASS_ORDER,
    GRADE,
    IJO,
    JOKEN,
    JRA_KEIBAJO,
    MIN_BMS_RUNNERS,
    MIN_BMS_RUNS,
    SEIBETSU,
    SMILE_ORDER,
)

from analyze import pct, yen

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
OUT = HERE / "out"


def md_table(headers: list[str], rows: list[list[object]]) -> str:
    head = "| " + " | ".join(headers) + " |"
    sep = "| " + " | ".join("---" for _ in headers) + " |"
    body = "\n".join("| " + " | ".join(str(c) for c in row) + " |" for row in rows)
    return "\n".join([head, sep, body]) if rows else head + "\n" + sep + "\n| （該当なし） |" + " |" * (len(headers) - 1)


def fmt_p(p: float | None) -> str:
    return pct(p)


def fmt_ci(lo, hi) -> str:
    if lo is None or hi is None or lo != lo or hi != hi:
        return "—"
    return f"{pct(lo)}–{pct(hi)}"


def load_analysis() -> tuple[dict, dict]:
    meta = json.loads((OUT / "meta.json").read_text(encoding="utf-8"))
    analysis = json.loads((OUT / "analysis.json").read_text(encoding="utf-8"))
    return meta, analysis


def write_notes(meta: dict, analysis: dict) -> None:
    qc = meta["quality"]
    contrail = meta["contrail"]
    lines = [
        "# 実施メモ",
        "",
        f"抽出日時: {meta['extracted_at']}",
        "",
        "## コード表マップ",
        "",
        "JV-DL 定義書のコード番号に基づく。本調査ノートの正とする。",
        "",
        "### 競馬場（中央）",
        "",
        md_table(["コード", "競馬場"], [[k, v] for k, v in JRA_KEIBAJO.items()]),
        "",
        "中央平地の判定は `keibajo_code` が上表、かつトラックが芝/ダート。",
        "",
        "### トラックコード",
        "",
        md_table(
            ["範囲", "馬場"],
            [["10–22", "芝"], ["23–29", "ダート"], ["51–59", "障害（主指標から除外）"]],
        ),
        "",
        "### グレードコード（2003）",
        "",
        md_table(["コード", "意味"], [[k or "(空)", v] for k, v in GRADE.items()]),
        "",
        "### 競走条件コード（2006, 最若年）",
        "",
        md_table(["コード", "クラス"], [[k, v] for k, v in JOKEN.items()]),
        "",
        "クラス階層はグレード（G1/G2/G3/Listed）を優先し、非重賞は競走条件コードへ畳む。",
        "`005` / `010` / `016` は旧収得賞金クラス（未勝利 / 500万下=1勝 / 1000万下=2勝）。本 DB では現行 701 系と混在する。",
        "",
        "### 異常区分（2101）",
        "",
        md_table(["コード", "意味", "有効走"], [[k, v, "残す" if k in {"0", "5"} else "除外"] for k, v in IJO.items()]),
        "",
        "降着は確定着順があるため分母に残す。取消・除外・競走中止・失格は除外。",
        "",
        "### 性別（2202） / 馬場状態（2002）",
        "",
        md_table(["コード", "性別"], [[k, v] for k, v in SEIBETSU.items()]),
        "",
        md_table(["コード", "馬場状態"], [[k, v] for k, v in BABA.items()]),
        "",
        "稍重以上 = 稍重・重・不良。",
        "",
        "### SMILE 仮境界",
        "",
        md_table(
            ["SMILE", "距離 (m)"],
            [["S", "〜1400"], ["M", "1401–1600"], ["I", "1601–2000"], ["L", "2001–2400"], ["E", "2401〜"]],
        ),
        "",
        "## コントレイルの確定",
        "",
        md_table(
            ["項目", "値"],
            [
                ["馬名", contrail.get("bamei")],
                ["生年", contrail.get("seinen")],
                ["繁殖登録番号 CONTRAL_HN", contrail.get("hanshoku_toroku_bango")],
                ["血統登録番号", contrail.get("ketto_toroku_bango")],
                ["父の繁殖登録番号", contrail.get("sire_hn")],
            ],
        ),
        "",
        f"候補は `work/out/contrail_hn_candidates.pkl`。生年 2017 で一意化。Deep Impact の HN は産駒の `ketto_joho_03a` 最頻値 `{qc.get('deep_hn')}`。サンデーサイレンスは `ketto_joho_07a` 最頻値 `{qc.get('sunday_hn')}`。",
        "",
        "## 品質チェック（§4.6）",
        "",
        md_table(
            ["チェック", "結果"],
            [
                ["HN のコントレイルは 1 頭", "OK" if qc.get("contrail_hn_unique") else "NG"],
                ["SK 件数", "0（テーブル全件が空。未登録産駒は観測不能）" if qc.get("sk_table_empty") else str(qc.get("sk_n"))],
                ["UM 件数", str(qc.get("um_n"))],
                ["SK ≥ UM", "対象外（SK 未収録）" if qc.get("sk_table_empty") else ("OK" if qc.get("sk_ge_um") else "NG（キー誤りを疑う）")],
                ["UM のみ（SK に無い）", str(len(qc.get("um_only_not_in_sk") or []))],
                ["父名がコントレイルでない UM", f"{qc.get('sire_name_mismatch_n')} （率 {pct(qc.get('sire_name_mismatch_rate'))}）"],
                ["生年 2022 未満", str(len(qc.get("foals_before_2022") or []))],
                ["SE にあり UM に無い", str(len(qc.get("se_not_in_um") or []))],
                ["有効走（中央平地）", str(qc.get("valid_runs"))],
                ["UM 中央着回合計（障害含む）", str(qc.get("um_chuo_starts_sum"))],
            ],
        ),
        "",
        qc.get("chuo_vs_se_note", ""),
        "",
        "### 異常区分の実測",
        "",
        md_table(["ijo_kubun_code", "件数"], [[k, v] for k, v in (analysis.get("ijo_dist") or {}).items()]),
        "",
        "### クラス / グレードの実測（有効走）",
        "",
        md_table(["klass", "件数"], [[k, v] for k, v in (analysis.get("klass_dist") or {}).items()]),
        "",
        md_table(["grade_code", "件数"], [[k, v] for k, v in (analysis.get("grade_dist") or {}).items()]),
        "",
        "## 単位",
        "",
        "- レース本賞金（SE/UM 累計）: DB は **百円**。表示は円（×100）。",
        "- 市場取引価格（HS）: DB は **円**。",
        "",
        "## 発見・判断",
        "",
        "- `jvd_sk` は全件 0 行。P0（未登録産駒）は観測不能。UM 195 頭を実務母集団にした。キー誤りではない。",
        "- HN の『コントレイル』候補は 2 行。生年 2017 で `1120002588` に固定。",
        "- 競走条件コードは現行 701 系と旧 005/010/016 が混在する。",
        "- 馬名は全角スペース埋め。Python 側で除去して表示する。",
        "- `jvd_bt` の系統が付く母父は少ない（外国産母父が多い）。母父系統集約はほとんど「系統不明」。",
        "- 走数 < 30 の適性セルは参考印。",
        "- 母父 mill の点推定順位は成果にしない。Wilson 95% 区間と k=20 の経験ベイズ縮小を併記。",
        "- 大負けは仮定義（着順が下位 1/3、またはタイム差 > 1.0 秒）。POC-01 に委譲。",
        "- 同世代比較は生年を分けた。年齢ミックスの累計比較は主結論に使わない。",
        "",
        "## 再実行",
        "",
        "```powershell",
        "cd PoC",
        "uv run python playground/contrail_offspring/search1_race_result/work/run.py",
        "```",
        "",
        "接続は `EQUISCOUT_PG_URL` または `work/.db_url`。",
        "",
    ]
    (ROOT / "notes.md").write_text("\n".join(lines), encoding="utf-8")
    print("[report] wrote notes.md")


def _sum_row(s: dict, sk_empty: bool = False) -> list[object]:
    p0 = "欠測（SK空）" if sk_empty else s.get("p0", "—")
    return [
        s.get("label", ""),
        p0,
        s.get("p1", "—"),
        s.get("p2", "—"),
        s.get("p3", "—"),
        fmt_p(s.get("start_rate")),
        fmt_p(s.get("win_horse_rate")),
        fmt_p(s.get("graded_start_rate")),
        fmt_p(s.get("graded_win_horse_rate")),
        fmt_p((s.get("win") or {}).get("p")),
        fmt_p((s.get("top3") or {}).get("p")),
        yen(s.get("prize_median")),
        yen(s.get("prize_per_run")),
    ]


def write_result(meta: dict, analysis: dict) -> None:
    contrail = meta["contrail"]
    qc = meta["quality"]
    overall = analysis["overall"]
    gen = analysis["generation"]

    # 主対照は 2023 / 2024（コントレイル産駒が居る年）
    gen_rows = []
    for g in gen:
        c, b = g["contrail"], g["generation"]
        d = g.get("diff") or {}
        def mark(block):
            if not block:
                return "—"
            arrow = "上回る" if block.get("excludes_zero") and block.get("diff", 0) > 0 else (
                "下回る" if block.get("excludes_zero") and block.get("diff", 0) < 0 else "差は区間内"
            )
            return f"{pct(block.get('diff'))}（{arrow}）"
        gen_rows.append([
            g["seinen"],
            f"{c.get('p1')} / {b.get('p1')}",
            f"{c.get('p2')} / {b.get('p2')}",
            f"{fmt_p(c.get('win_horse_rate'))} / {fmt_p(b.get('win_horse_rate'))}",
            f"{fmt_p((c.get('top3') or {}).get('p'))} / {fmt_p((b.get('top3') or {}).get('p'))}",
            f"{fmt_p(c.get('graded_win_horse_rate'))} / {fmt_p(b.get('graded_win_horse_rate'))}",
            f"{yen(c.get('prize_per_run'))} / {yen(b.get('prize_per_run'))}",
            mark(d.get("place_rate")),
        ])

    cross_by_axis: dict[str, list] = {}
    for row in analysis.get("cross") or []:
        cross_by_axis.setdefault(row["axis"], []).append(row)

    def cross_md(axis: str, order: list[str] | None = None) -> str:
        rows = cross_by_axis.get(axis, [])
        if order:
            pos = {k: i for i, k in enumerate(order)}
            rows = sorted(rows, key=lambda r: pos.get(r["key"], 99))
        else:
            rows = sorted(rows, key=lambda r: r["n"], reverse=True)
        return md_table(
            ["区分", "有効走", "勝率", "複勝率", "1走あたり本賞金", "印"],
            [[
                r["key"],
                r["n"],
                fmt_p(r.get("win_rate")),
                fmt_p(r.get("place_rate")),
                yen(r.get("prize_per_run")),
                "参考" if r.get("ref") else "",
            ] for r in rows],
        )

    candidates = [r for r in analysis.get("bms") or [] if r.get("candidate")]
    insufficient = [
        r for r in analysis.get("bms") or []
        if not r.get("unverified") and not r.get("sample_ok") and r.get("p2", 0) > 0
    ]
    unverified = [r for r in analysis.get("bms") or [] if r.get("unverified")]
    rejected = [
        r for r in analysis.get("bms") or []
        if r.get("sample_ok") and not r.get("candidate")
    ]

    def nick_md(items: list[dict], limit: int = 15) -> str:
        return md_table(
            ["母父", "出走馬", "有効走", "勝馬率", "複勝率", "Wilson95%", "縮小複勝", "重賞勝馬", "1走賞金", "備考"],
            [[
                r["name"],
                r["p2"],
                r["p3"],
                fmt_p(r.get("win_horse_rate")),
                fmt_p(r.get("place_rate")),
                fmt_ci(*(r.get("place_wilson") or (None, None))),
                fmt_p(r.get("place_shrunk")),
                f"{r.get('graded_win_n')}（{fmt_p(r.get('graded_win_horse_rate'))}）",
                yen(r.get("prize_per_run")),
                r.get("dep_note") or ("有力" if r.get("candidate") else ""),
            ] for r in items[:limit]],
        )

    peers = analysis.get("peers") or []
    peer_md = md_table(
        ["種牡馬", "登録", "出走", "有効走", "勝馬率", "複勝率", "重賞勝馬率", "1走賞金"],
        [[
            ("**" + r["sire_name"] + "**") if r.get("is_contrail") else r["sire_name"],
            r["p1"], r["p2"], r["p3"],
            fmt_p(r.get("win_horse_rate")),
            fmt_p(r.get("place_rate")),
            fmt_p(r.get("graded_win_horse_rate")),
            yen(r.get("prize_per_run")),
        ] for r in peers[:12]],
    )

    top_h = analysis.get("top_horses") or []
    top_md = md_table(
        ["馬名", "生年", "性", "母父", "有効走", "勝-複", "重賞勝", "G1/G2/G3", "本賞金", "生産者"],
        [[
            r.get("bamei"),
            r.get("seinen"),
            r.get("seibetsu"),
            r.get("bms_name"),
            int(r.get("valid_runs") or 0),
            f"{int(r.get('wins', 0))}-{int(r.get('top3', 0))}",
            int(r.get("graded_wins", 0)),
            f"{int(r.get('g1_wins', 0))}/{int(r.get('g2_wins', 0))}/{int(r.get('g3_wins', 0))}",
            yen(r.get("prize_yen_se")),
            r.get("seisanshamei"),
        ] for r in top_h],
    )

    # §6.4 解釈
    y2023 = next((g for g in gen if g["seinen"] == "2023"), None)
    y2024 = next((g for g in gen if g["seinen"] == "2024"), None)
    turf = next((r for r in cross_by_axis.get("馬場", []) if r["key"] == "芝"), None)
    dirt = next((r for r in cross_by_axis.get("馬場", []) if r["key"] == "ダート"), None)
    smile_sorted = sorted(cross_by_axis.get("SMILE", []), key=lambda r: r["n"], reverse=True)
    smile_top = smile_sorted[0]["key"] if smile_sorted else "不明"

    def gen_line(g, year: str) -> str:
        if not g:
            return f"{year} 世代の産駒は本抽出にほぼ居ない。"
        c, b = g["contrail"], g["generation"]
        d = (g.get("diff") or {}).get("place_rate") or {}
        return (
            f"{year} 生は登録 {c.get('p1')} 頭・出走 {c.get('p2')} 頭（出走率 {fmt_p(c.get('start_rate'))}）。"
            f"同世代中央登録馬は登録 {b.get('p1')}・出走 {b.get('p2')}。"
            f"複勝率は産駒 {fmt_p((c.get('top3') or {}).get('p'))}、世代 {fmt_p((b.get('top3') or {}).get('p'))}"
            f"（差 {pct(d.get('diff'))}）。"
        )

    cand_names = "、".join(r["name"] for r in candidates) if candidates else "条件を満たす母父は無し"
    lines = [
        "# コントレイル産駒 成績調査レポート",
        "",
        "| 項目 | 内容 |",
        "|------|------|",
        f"| 抽出日時 | {meta['extracted_at']} |",
        f"| CONTRAL_HN | `{contrail.get('hanshoku_toroku_bango')}` （{contrail.get('bamei')}、{contrail.get('seinen')} 年産） |",
        f"| 血統登録番号 | `{contrail.get('ketto_toroku_bango')}` |",
        "| 対象 | 中央平地の有効走（取消・除外・競走中止・失格、障害を除く） |",
        "| 賞金単位 | 表示は円。SE/UM 本賞金は DB 百円を換算 |",
        "",
        "## 結論（先に）",
        "",
        f"1. **規模**: 中央登録 {qc.get('um_n')} 頭、出走馬 {overall.get('p2')} 頭、有効走 {overall.get('p3')} 走。`jvd_sk` は全件空のため P0（未登録産駒）は観測不能。実務母集団は P1=UM。",
        f"2. **1 次（重賞）**: 重賞勝馬 {overall.get('g3plus_n')} 頭（G2 以上 {overall.get('g2plus_n')}、G1 {overall.get('g1_n')}）。オープン勝ち {overall.get('op_win_n')} 頭。",
        f"3. **2 次（安定）**: 有効走の勝率 {fmt_p((overall.get('win') or {}).get('p'))}、複勝率 {fmt_p((overall.get('top3') or {}).get('p'))}。勝馬率 {fmt_p(overall.get('win_horse_rate'))}。",
        f"4. **適性**: 芝複勝 {fmt_p(turf.get('place_rate') if turf else None)}、ダート複勝 {fmt_p(dirt.get('place_rate') if dirt else None)}。距離の山は SMILE {smile_top}。",
        f"5. **ニック**: 有力候補は {cand_names}。点推定の母父ランキングは採用しない。",
        "6. **限界**: 2023 生は 3 歳進行中、2024 生は 2 歳で未完成。中央平地のみ。少標本の母父は判断不能。",
        "",
        "## P0 / P1 / P2 件数（生年別）",
        "",
        md_table(
            ["生年", "P0 産駒", "P1 登録", "P2 出走", "P3 有効走", "出走率", "勝馬率", "重賞出走率", "重賞勝馬率", "勝率", "複勝率", "本賞金中央値", "1走本賞金"],
            [_sum_row(s, qc.get("sk_table_empty")) for s in analysis.get("by_year") or []],
        ),
        "",
        "全体:",
        "",
        md_table(
            ["層", "P0", "P1", "P2", "P3", "出走率", "勝馬率", "重賞出走率", "重賞勝馬率", "勝率", "複勝率", "本賞金中央値", "1走本賞金"],
            [_sum_row(overall, qc.get("sk_table_empty"))],
        ),
        "",
        "性別:",
        "",
        md_table(
            ["性", "P0", "P1", "P2", "P3", "出走率", "勝馬率", "重賞出走率", "重賞勝馬率", "勝率", "複勝率", "本賞金中央値", "1走本賞金"],
            [_sum_row(s, qc.get("sk_table_empty")) for s in analysis.get("by_sex") or []],
        ),
        "",
        "## 調査 A: 産駒成績",
        "",
        "### 同世代比（主指標）",
        "",
        "各セルは **コントレイル / 同生年の中央登録馬**。複勝・勝馬・重賞勝馬・1 走本賞金。頭数差は率の差の 95% 区間で見る。",
        "",
        md_table(
            ["生年", "登録 産駒/世代", "出走 産駒/世代", "勝馬率", "複勝率", "重賞勝馬率", "1走本賞金", "複勝の差"],
            gen_rows,
        ),
        "",
        gen_line(y2023, "2023"),
        "",
        gen_line(y2024, "2024"),
        "",
        "2022 生はコントレイル初年度より前の世代であり、対照の底上げ確認用。産駒側は原則ほぼ 0。",
        "",
        "### 初年度が近い種牡馬（2023 初年度産駒、出走 10 頭以上）",
        "",
        peer_md,
        "",
        "### 適性プロファイル",
        "",
        "走数 < 30 は参考。開催場は標本が割れるため主結論に使わない。",
        "",
        "#### 馬場",
        "",
        cross_md("馬場", ["芝", "ダート"]),
        "",
        "#### SMILE",
        "",
        cross_md("SMILE", SMILE_ORDER),
        "",
        "#### 距離帯（UM 既存）",
        "",
        cross_md("距離帯", ["16下", "22下", "22超"]),
        "",
        "#### 馬場状態",
        "",
        cross_md("馬場状態", ["良", "稍重以上"]),
        "",
        "#### クラス",
        "",
        cross_md("クラス", CLASS_ORDER),
        "",
        "#### 馬齢（走時点）",
        "",
        cross_md("馬齢"),
        "",
        "### 主な馬（1 次優先）",
        "",
        top_md,
        "",
        "### 解釈（§6.4）",
        "",
        f"- 規模: UM {qc.get('um_n')}、出走 {overall.get('p2')}、有効走 {overall.get('p3')}。SK は未収録。",
        f"- 1 次: G1 勝利 {overall.get('g1_n')} 頭、G2 以上 {overall.get('g2plus_n')} 頭、G3 以上 {overall.get('g3plus_n')} 頭。同世代比は上表。",
        f"- 2 次: 勝率 {fmt_p((overall.get('win') or {}).get('p'))}、連対 {fmt_p((overall.get('top2') or {}).get('p'))}、複勝 {fmt_p((overall.get('top3') or {}).get('p'))}。",
        f"- 適性: 芝/ダートと SMILE {smile_top} が主戦場。新馬・未勝利の勝率だけで種牡馬評価しない。",
        "- 限界: キャリア未完成、中央平地、少標本。地方・海外は分解していない。",
        "",
        "## 調査 B: 血統組み合わせ（母側）",
        "",
        f"最小標本の目安は出走馬 {MIN_BMS_RUNNERS} 頭または有効走 {MIN_BMS_RUNS}。有力ニックは (1) 最小標本 (2) 1 次または 2 次が産駒全体より良い（差の区間が 0 をまたがない、または縮小推定でも同符号）(3) 1 頭を除いても方向が残る、をすべて満たすものだけ。",
        "",
        "### 有力ニック候補",
        "",
        nick_md(candidates, 20),
        "",
    ]
    if any(r.get("name") == "Galileo" for r in candidates):
        lines.append("Galileo は勝馬率 5/5 で差の区間が 0 をまたがない。複勝の点推定 43% は高いが Wilson 区間（27–61%）は産駒平均 31% を含む。重賞勝ちは 0。最小標本ぎりぎりで、未出走馬への強い代理にはまだ早い。")
        lines.append("")
    lines += [
        "",
        "### 標本は足りるが条件を満たさない（棄却）",
        "",
        nick_md(rejected, 20),
        "",
        "### 標本不足で判断不能な母父（出走はあるが最小標本未満）",
        "",
        nick_md(sorted(insufficient, key=lambda r: r["p2"], reverse=True), 25),
        "",
        f"未検証（有効走 0）の母父は {len(unverified)}。良いとも悪いとも書かない。",
        "",
        "### 母父の父系（標本が足りないときの集約）",
        "",
        nick_md(
            [r for r in (analysis.get("bms_lines") or []) if r.get("candidate") or r.get("sample_ok")][:15],
            15,
        ),
        "",
        "### インブリード（母系にサンデー / ディープ）",
        "",
    ]

    ib = analysis.get("inbreed") or {}
    for label, groups in ib.items():
        lines.append(f"#### {label}")
        lines.append("")
        lines.append(
            md_table(
                ["群", "P1", "P2", "P3", "勝馬率", "複勝率", "重賞勝馬率"],
                [[
                    name,
                    g.get("p1"), g.get("p2"), g.get("p3"),
                    fmt_p(g.get("win_horse_rate")),
                    fmt_p((g.get("top3") or {}).get("p")),
                    fmt_p(g.get("graded_win_horse_rate")),
                ] for name, g in groups.items()],
            )
        )
        lines.append("")

    sib = analysis.get("dam_siblings") or []
    lines += [
        "### 同一母の複数産駒（例外ケース。ニック結論には使わない）",
        "",
        md_table(
            ["母", "産駒数", "出走", "勝利数", "重賞勝馬", "馬名"],
            [[
                r["dam_name"], r["n"], r["p2"], r["wins"], r["graded_winners"],
                "、".join(r["names"]),
            ] for r in sib[:10]],
        ),
        "",
        "## 使ってよい指標 / 捨てた指標",
        "",
        md_table(
            ["判断", "指標"],
            [
                ["使ってよい（1 次）", "G1/G2/G3 勝利の有無と頭数。同世代比の重賞勝馬率"],
                ["使ってよい（2 次）", "生年別の勝馬率・複勝率（Wilson 区間付き）。芝/ダート・SMILE 別複勝（走数 30 以上）"],
                ["使ってよい（規模）", "P0/P1/P2、出走率。未出走は率の分母に入れない"],
                ["代理特徴量の種", "父＝コントレイル × 母父（最小標本を満たし、1 頭依存でないものだけ）"],
                ["捨てた", "母父 mill の勝率ソート表。年齢ミックスの通算比較。新馬・未勝利勝率だけの種牡馬評価"],
                ["捨てた", "開催場別の主結論。地方・海外のクラス分解。p 値の並びによる母父採択"],
                ["仮置き", "大負け（下位 1/3 または 1.0 秒超）。SMILE 境界"],
            ],
        ),
        "",
        "## EquiScout へ持ち込む指標の提案",
        "",
        md_table(
            ["先", "提案"],
            [
                ["要求 §3.6 血統分析", "距離は SMILE 5 区分、馬場は芝/ダート、兄弟は同一母の既走成績。走数 < 30 は参考表示"],
                ["POC-06 代理特徴量", "未出走馬の説明変数候補は「父＝コントレイル × 母父」。標本不足母父は欠損（不明）とし、0 にも罰にもしない"],
                ["POC-01 強さ", "ラベルは 1 次（重賞勝利）と 2 次（複勝/勝馬）を分けて持つ。合成しない"],
                ["POC-03 類似馬", "同じ母父、または母父系統が同じ既走産駒を参考成績の第一候補にする"],
            ],
        ),
        "",
        "## 品質メモ",
        "",
        f"{'SK テーブルは全件空（P0 欠測）。' if qc.get('sk_table_empty') else 'SK≥UM は ' + ('成立' if qc.get('sk_ge_um') else '不成立') + '。'}父名不一致 {qc.get('sire_name_mismatch_n')} 頭。2022 年未満 {len(qc.get('foals_before_2022') or [])} 頭。詳細は `notes.md`。",
        "",
    ]
    (ROOT / "result.md").write_text("\n".join(str(x) for x in lines), encoding="utf-8")
    print("[report] wrote result.md")


def run_report() -> None:
    meta, analysis = load_analysis()
    write_notes(meta, analysis)
    write_result(meta, analysis)
