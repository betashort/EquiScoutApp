"""調査 A / B の集計。extract の parquet を読む。"""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd

from codes import (
    MIN_BMS_RUNNERS,
    MIN_BMS_RUNS,
    MIN_LINE_RUNNERS,
    MIN_LINE_RUNS,
    SEINEN_FOCUS,
)
from extract import load_df

OUT = Path(__file__).resolve().parent / "out"


def wilson(successes: int, n: int, z: float = 1.96) -> tuple[float | None, float | None]:
    if n <= 0:
        return None, None
    p = successes / n
    z2 = z * z
    denom = 1 + z2 / n
    center = (p + z2 / (2 * n)) / denom
    margin = z * ((p * (1 - p) / n + z2 / (4 * n * n)) ** 0.5) / denom
    return max(0.0, center - margin), min(1.0, center + margin)


def shrink(p: float, n: int, p0: float, k: float = 20.0) -> float:
    if n < 0:
        return p0
    return (n / (n + k)) * p + (k / (n + k)) * p0


def rate_block(successes: int, n: int, p0: float | None = None) -> dict:
    lo, hi = wilson(successes, n)
    p = (successes / n) if n else None
    out = {
        "k": int(successes),
        "n": int(n),
        "p": p,
        "wilson_lo": lo,
        "wilson_hi": hi,
    }
    if p0 is not None and p is not None:
        out["shrunk"] = shrink(p, n, p0)
    return out


def diff_ci(p1: float, n1: int, p0: float, n0: int) -> tuple[float, float, float]:
    diff = p1 - p0
    se = ((p1 * (1 - p1) / n1) + (p0 * (1 - p0) / n0)) ** 0.5 if n1 and n0 else None
    if se is None:
        return diff, float("nan"), float("nan")
    return diff, diff - 1.96 * se, diff + 1.96 * se


def pct(x: float | None, digits: int = 1) -> str:
    if x is None or (isinstance(x, float) and np.isnan(x)):
        return "—"
    return f"{100 * x:.{digits}f}%"


def yen(x: float | None) -> str:
    if x is None or (isinstance(x, float) and np.isnan(x)):
        return "—"
    return f"{int(round(x)):,}円"


def load_inputs() -> dict[str, pd.DataFrame | dict]:
    meta = json.loads((OUT / "meta.json").read_text(encoding="utf-8"))
    horses = load_df("horses")
    runs = load_df("runs_contrail")
    baseline_um = load_df("baseline_um")
    baseline_runs = load_df("runs_baseline")
    first_crop = load_df("sire_first_crop")
    return {
        "meta": meta,
        "horses": horses,
        "runs": runs,
        "baseline_um": baseline_um,
        "baseline_runs": baseline_runs,
        "first_crop": first_crop,
    }


def horse_metrics(horses: pd.DataFrame, runs: pd.DataFrame) -> pd.DataFrame:
    valid = runs[runs["valid"]].copy() if not runs.empty else runs
    if valid.empty:
        h = horses.copy()
        h["valid_runs"] = 0
        h["wins"] = 0
        h["top2"] = 0
        h["top3"] = 0
        h["prize_yen_se"] = 0
        h["is_p2"] = False
        h["is_p1"] = h["in_um"].astype(bool)
        return h

    g = valid.groupby("ketto_toroku_bango")
    agg = g.agg(
        valid_runs=("valid", "size"),
        wins=("win", "sum"),
        top2=("top2", "sum"),
        top3=("top3", "sum"),
        prize_yen_se=("prize_yen", "sum"),
        graded_runs=("is_graded", "sum"),
        g1_runs=("is_g1", "sum"),
        g2_runs=("is_g2", "sum"),
        g3_runs=("is_g3", "sum"),
        listed_runs=("is_listed", "sum"),
        turf_runs=("surface", lambda s: int((s == "芝").sum())),
        dirt_runs=("surface", lambda s: int((s == "ダート").sum())),
        big_loss_n=("big_loss", "sum"),
        fav13_n=("fav13", "sum"),
    ).reset_index()

    extra = pd.DataFrame({"ketto_toroku_bango": agg["ketto_toroku_bango"]})
    extra = extra.merge(
        valid[valid["is_graded"] & valid["win"]].groupby("ketto_toroku_bango").size().rename("graded_wins"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[valid["is_g1"] & valid["win"]].groupby("ketto_toroku_bango").size().rename("g1_wins"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[valid["is_g2"] & valid["win"]].groupby("ketto_toroku_bango").size().rename("g2_wins"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[valid["is_g3"] & valid["win"]].groupby("ketto_toroku_bango").size().rename("g3_wins"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[(valid["klass"] == "オープン") & valid["win"]].groupby("ketto_toroku_bango").size().rename("op_wins"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[valid["surface"] == "芝"].groupby("ketto_toroku_bango")["top3"].sum().rename("turf_top3"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[valid["surface"] == "ダート"].groupby("ketto_toroku_bango")["top3"].sum().rename("dirt_top3"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra = extra.merge(
        valid[valid["win"]].groupby("ketto_toroku_bango")["smile"].agg(
            lambda s: s.value_counts().idxmax() if len(s) else ""
        ).rename("max_win_smile"),
        on="ketto_toroku_bango",
        how="left",
    )
    extra["max_win_smile"] = extra["max_win_smile"].fillna("")
    extra = extra.fillna(0)

    h = horses.merge(agg, on="ketto_toroku_bango", how="left")
    h = h.merge(extra, on="ketto_toroku_bango", how="left")
    num_cols = [
        "valid_runs", "wins", "top2", "top3", "prize_yen_se",
        "graded_runs", "graded_wins", "g1_runs", "g2_runs", "g3_runs",
        "listed_runs", "op_runs", "turf_runs", "dirt_runs", "big_loss_n",
        "fav13_n", "g1_wins", "g2_wins", "g3_wins", "op_wins", "turf_top3", "dirt_top3",
    ]
    for c in num_cols:
        if c in h.columns:
            h[c] = h[c].fillna(0)
    h["is_p2"] = h["valid_runs"] > 0
    h["is_p1"] = h["in_um"].astype(bool)
    h["win_horse"] = h["wins"] >= 1
    h["graded_starter"] = h["graded_runs"] >= 1
    h["graded_winner"] = h["graded_wins"] >= 1
    h["g1_winner"] = h["g1_wins"] >= 1
    h["g2plus_winner"] = (h["g1_wins"] + h["g2_wins"]) >= 1
    h["g3plus_winner"] = (h["g1_wins"] + h["g2_wins"] + h["g3_wins"]) >= 1
    h["op_winner"] = h["op_wins"] >= 1
    h["win_rate"] = np.where(h["valid_runs"] > 0, h["wins"] / h["valid_runs"], np.nan)
    h["place_rate"] = np.where(h["valid_runs"] > 0, h["top3"] / h["valid_runs"], np.nan)
    h["prize_per_run"] = np.where(h["valid_runs"] > 0, h["prize_yen_se"] / h["valid_runs"], np.nan)
    return h


def summarize_group(h: pd.DataFrame, valid: pd.DataFrame, label: str) -> dict:
    p0 = h[h["in_sk"]] if "in_sk" in h.columns else h
    p1 = h[h["is_p1"]] if "is_p1" in h.columns else h
    p2 = h[h["is_p2"]]
    n_run = int(valid.shape[0]) if valid is not None and not valid.empty else 0
    wins = int(valid["win"].sum()) if n_run else 0
    top2 = int(valid["top2"].sum()) if n_run else 0
    top3 = int(valid["top3"].sum()) if n_run else 0
    prize = valid["prize_yen"].sum() if n_run else 0
    p2_prize = p2["prize_yen_se"] if not p2.empty else pd.Series(dtype=float)
    return {
        "label": label,
        "p0": int(len(p0)),
        "p1": int(len(p1)),
        "p2": int(len(p2)),
        "p3": n_run,
        "start_rate": (len(p2) / len(p1)) if len(p1) else None,
        "win_horse_rate": (int(p2["win_horse"].sum()) / len(p2)) if len(p2) else None,
        "graded_start_rate": (int(p2["graded_starter"].sum()) / len(p2)) if len(p2) else None,
        "graded_win_horse_rate": (int(p2["graded_winner"].sum()) / len(p2)) if len(p2) else None,
        "g3plus_n": int(p2["g3plus_winner"].sum()) if not p2.empty else 0,
        "g2plus_n": int(p2["g2plus_winner"].sum()) if not p2.empty else 0,
        "g1_n": int(p2["g1_winner"].sum()) if not p2.empty else 0,
        "op_win_n": int(p2["op_winner"].sum()) if not p2.empty else 0,
        "win": rate_block(wins, n_run),
        "top2": rate_block(top2, n_run),
        "top3": rate_block(top3, n_run),
        "prize_yen_sum": int(prize),
        "prize_per_run": (prize / n_run) if n_run else None,
        "prize_median": float(p2_prize.median()) if len(p2_prize) else None,
        "prize_p90": float(p2_prize.quantile(0.9)) if len(p2_prize) else None,
        "prize_mean": float(p2_prize.mean()) if len(p2_prize) else None,
    }


def cross_tabs(valid: pd.DataFrame) -> list[dict]:
    if valid.empty:
        return []
    rows = []
    axes = {
        "馬場": valid["surface"],
        "SMILE": valid["smile"],
        "距離帯": valid["dist_band"],
        "馬場状態": valid["baba_group"],
        "クラス": valid["klass"],
        "馬齢": valid["barei_n"].map(lambda x: f"{int(x)}歳" if pd.notna(x) else "不明"),
        "開催": valid["keibajo_code"],
    }
    for axis, series in axes.items():
        tmp = valid.copy()
        tmp["_ax"] = series
        g = tmp.groupby("_ax", dropna=False)
        for key, sub in g:
            n = len(sub)
            rec = {
                "axis": axis,
                "key": str(key),
                "n": n,
                "ref": n < 30,
                "win_rate": float(sub["win"].mean()) if n else None,
                "place_rate": float(sub["top3"].mean()) if n else None,
                "prize_per_run": float(sub["prize_yen"].mean()) if n else None,
            }
            rec["win"] = rate_block(int(sub["win"].sum()), n)
            rec["top3"] = rate_block(int(sub["top3"].sum()), n)
            rows.append(rec)
    return rows


def generation_compare(h: pd.DataFrame, valid: pd.DataFrame, baseline_um: pd.DataFrame, baseline_runs: pd.DataFrame) -> list[dict]:
    rows = []
    bvalid = baseline_runs[baseline_runs["valid"]].copy() if not baseline_runs.empty else baseline_runs
    for year in SEINEN_FOCUS:
        ch = h[h["seinen"] == year]
        cv = valid[valid["ketto_toroku_bango"].isin(ch["ketto_toroku_bango"])] if not valid.empty else valid
        bu = baseline_um[baseline_um["seinen"] == year]
        bv = bvalid[bvalid["ketto_toroku_bango"].isin(bu["ketto_toroku_bango"])] if not bvalid.empty else bvalid
        # 対照側の馬単位
        if not bv.empty:
            b_p2_ids = set(bv["ketto_toroku_bango"])
            b_win_horses = set(bv.loc[bv["win"], "ketto_toroku_bango"])
            b_gwin_horses = set(bv.loc[bv["is_graded"] & bv["win"], "ketto_toroku_bango"])
            b_p1 = len(bu)
            b_p2 = len(b_p2_ids)
        else:
            b_win_horses, b_gwin_horses = set(), set()
            b_p1 = len(bu)
            b_p2 = 0
        c_p2 = ch[ch["is_p2"]]
        rec = {
            "seinen": year,
            "contrail": summarize_group(ch, cv, f"コントレイル {year}"),
            "generation": {
                "p1": b_p1,
                "p2": b_p2,
                "p3": int(len(bv)) if bv is not None and not bv.empty else 0,
                "start_rate": (b_p2 / b_p1) if b_p1 else None,
                "win_horse_rate": (len(b_win_horses) / b_p2) if b_p2 else None,
                "graded_win_horse_rate": (len(b_gwin_horses) / b_p2) if b_p2 else None,
                "win": rate_block(int(bv["win"].sum()) if not bv.empty else 0, int(len(bv)) if not bv.empty else 0),
                "top3": rate_block(int(bv["top3"].sum()) if not bv.empty else 0, int(len(bv)) if not bv.empty else 0),
                "prize_per_run": float(bv["prize_yen"].mean()) if not bv.empty else None,
            },
        }
        # 差
        def _diff(a, b, na, nb):
            if a is None or b is None or not na or not nb:
                return None
            d, lo, hi = diff_ci(a, na, b, nb)
            return {"diff": d, "lo": lo, "hi": hi, "excludes_zero": not (lo <= 0 <= hi)}

        rec["diff"] = {
            "win_horse_rate": _diff(
                rec["contrail"]["win_horse_rate"], rec["generation"]["win_horse_rate"],
                rec["contrail"]["p2"], rec["generation"]["p2"],
            ),
            "place_rate": _diff(
                rec["contrail"]["top3"]["p"], rec["generation"]["top3"]["p"],
                rec["contrail"]["p3"], rec["generation"]["p3"],
            ),
            "win_rate": _diff(
                rec["contrail"]["win"]["p"], rec["generation"]["win"]["p"],
                rec["contrail"]["p3"], rec["generation"]["p3"],
            ),
            "graded_win_horse_rate": _diff(
                rec["contrail"]["graded_win_horse_rate"], rec["generation"]["graded_win_horse_rate"],
                rec["contrail"]["p2"], rec["generation"]["p2"],
            ),
        }
        rows.append(rec)
    return rows


def peer_sires(
    h: pd.DataFrame,
    valid: pd.DataFrame,
    baseline_um: pd.DataFrame,
    baseline_runs: pd.DataFrame,
    first_crop: pd.DataFrame,
    contrail_hn: str,
) -> list[dict]:
    """初年度産駒が 2023 の種牡馬（UM 上）と比較。2023 生に限定。"""
    peers = first_crop[first_crop["first_crop_year"] == "2023"]
    bvalid = baseline_runs[baseline_runs["valid"]].copy() if not baseline_runs.empty else baseline_runs
    um23 = baseline_um[baseline_um["seinen"] == "2023"]
    if bvalid.empty or um23.empty:
        return []
    bv23 = bvalid[bvalid["ketto_toroku_bango"].isin(um23["ketto_toroku_bango"])]
    rows = []
    sire_names = um23.drop_duplicates("sire_hn").set_index("sire_hn")["sire_name"].to_dict()
    for sire, sub_um in um23.groupby("sire_hn"):
        if sire not in set(peers["sire_hn"]) and sire != contrail_hn:
            continue
        ids = set(sub_um["ketto_toroku_bango"])
        sub_r = bv23[bv23["ketto_toroku_bango"].isin(ids)]
        p2_ids = set(sub_r["ketto_toroku_bango"]) if not sub_r.empty else set()
        if len(p2_ids) < 10 and sire != contrail_hn:
            continue
        win_h = set(sub_r.loc[sub_r["win"], "ketto_toroku_bango"]) if not sub_r.empty else set()
        gwin_h = set(sub_r.loc[sub_r["is_graded"] & sub_r["win"], "ketto_toroku_bango"]) if not sub_r.empty else set()
        n = int(len(sub_r))
        rows.append(
            {
                "sire_hn": sire,
                "sire_name": sire_names.get(sire, sire),
                "is_contrail": sire == contrail_hn,
                "p1": int(len(sub_um)),
                "p2": int(len(p2_ids)),
                "p3": n,
                "win_horse_rate": (len(win_h) / len(p2_ids)) if p2_ids else None,
                "graded_win_horse_rate": (len(gwin_h) / len(p2_ids)) if p2_ids else None,
                "place_rate": float(sub_r["top3"].mean()) if n else None,
                "win_rate": float(sub_r["win"].mean()) if n else None,
                "prize_per_run": float(sub_r["prize_yen"].mean()) if n else None,
            }
        )
    rows.sort(key=lambda r: (r["place_rate"] or 0), reverse=True)
    return rows


def nick_table(
    h: pd.DataFrame,
    valid: pd.DataFrame,
    key: str,
    name_col: str,
    min_runners: int,
    min_runs: int,
) -> list[dict]:
    p2 = h[h["is_p2"]].copy()
    overall_place = float(valid["top3"].mean()) if not valid.empty else 0.0
    overall_win_h = float(p2["win_horse"].mean()) if len(p2) else 0.0
    overall_gwin = float(p2["graded_winner"].mean()) if len(p2) else 0.0
    overall_ppr = float(valid["prize_yen"].mean()) if not valid.empty else 0.0
    rows = []
    for kid, sub in h.groupby(key, dropna=False):
        kid = "" if pd.isna(kid) else str(kid)
        name = ""
        if name_col in sub.columns and sub[name_col].ne("").any():
            name = str(sub[name_col].replace("", pd.NA).dropna().mode().iloc[0]) if sub[name_col].replace("", pd.NA).dropna().shape[0] else kid
        else:
            name = kid or "(空)"
        p2s = sub[sub["is_p2"]]
        ids = set(p2s["ketto_toroku_bango"])
        sub_r = valid[valid["ketto_toroku_bango"].isin(ids)] if not valid.empty else valid
        n_run = int(len(sub_r)) if sub_r is not None and not sub_r.empty else 0
        n_p2 = int(len(p2s))
        unverified = n_run == 0
        sample_ok = (n_p2 >= min_runners) or (n_run >= min_runs)
        place_p = float(sub_r["top3"].mean()) if n_run else None
        win_p = float(sub_r["win"].mean()) if n_run else None
        win_h_p = float(p2s["win_horse"].mean()) if n_p2 else None
        gwin_p = float(p2s["graded_winner"].mean()) if n_p2 else None
        ppr = float(sub_r["prize_yen"].mean()) if n_run else None
        turf = sub_r[sub_r["surface"] == "芝"] if n_run else sub_r
        dirt = sub_r[sub_r["surface"] == "ダート"] if n_run else sub_r
        smile_place = {}
        if n_run:
            for sm, ss in sub_r.groupby("smile"):
                smile_place[str(sm)] = float(ss["top3"].mean()) if len(ss) else None

        d_place = diff_ci(place_p, n_run, overall_place, int(len(valid))) if place_p is not None and len(valid) else (None, None, None)
        d_win_h = diff_ci(win_h_p, n_p2, overall_win_h, int(len(p2))) if win_h_p is not None and len(p2) else (None, None, None)

        better_secondary = False
        better_primary = False
        if sample_ok:
            place_ci = isinstance(d_place[1], (int, float)) and d_place[1] == d_place[1] and d_place[1] > 0
            place_shrink = (
                place_p is not None
                and place_p > overall_place
                and shrink(place_p, n_run, overall_place) > overall_place
                and n_run >= MIN_BMS_RUNS
            )
            win_ci = isinstance(d_win_h[1], (int, float)) and d_win_h[1] == d_win_h[1] and d_win_h[1] > 0
            better_secondary = bool(place_ci or place_shrink or win_ci)
            if gwin_p is not None and overall_gwin is not None:
                dg = diff_ci(gwin_p, n_p2, overall_gwin, int(len(p2)))
                g_ci = isinstance(dg[1], (int, float)) and dg[1] == dg[1] and dg[1] > 0
                g_shrink = gwin_p > overall_gwin and shrink(gwin_p, n_p2, overall_gwin) > overall_gwin and n_p2 >= MIN_BMS_RUNNERS
                better_primary = bool(g_ci or g_shrink)

        # 1 頭依存: 賞金最大馬を除く
        dep_ok = True
        dep_note = ""
        if n_p2 >= 2 and sample_ok:
            top_id = p2s.sort_values("prize_yen_se", ascending=False)["ketto_toroku_bango"].iloc[0]
            rest_r = sub_r[sub_r["ketto_toroku_bango"] != top_id]
            rest_h = p2s[p2s["ketto_toroku_bango"] != top_id]
            rest_place = float(rest_r["top3"].mean()) if len(rest_r) else None
            rest_g = float(rest_h["graded_winner"].mean()) if len(rest_h) else None
            dir_place = (place_p or 0) >= overall_place
            dir_place_rest = (rest_place or 0) >= overall_place if rest_place is not None else False
            if dir_place and rest_place is not None and not dir_place_rest and not ((rest_g or 0) > overall_gwin):
                dep_ok = False
                top_name = p2s.loc[p2s["ketto_toroku_bango"] == top_id, "bamei"].iloc[0]
                dep_note = f"{top_name} を除くと産駒平均以下"
        elif n_p2 == 1 and sample_ok:
            dep_ok = False
            dep_note = "出走馬 1 頭"

        candidate = bool(sample_ok and (better_primary or better_secondary) and dep_ok and not unverified)
        rows.append(
            {
                "key": kid or "(空)",
                "name": name or "(空)",
                "p0": int(len(sub)),
                "p1": int(sub["is_p1"].sum()) if "is_p1" in sub.columns else int(sub["in_um"].sum()),
                "p2": n_p2,
                "p3": n_run,
                "unverified": unverified,
                "sample_ok": sample_ok,
                "win_horse_rate": win_h_p,
                "place_rate": place_p,
                "win_rate": win_p,
                "graded_win_horse_rate": gwin_p,
                "graded_win_n": int(p2s["graded_winner"].sum()) if n_p2 else 0,
                "prize_per_run": ppr,
                "prize_median": float(p2s["prize_yen_se"].median()) if n_p2 else None,
                "turf_place": float(turf["top3"].mean()) if turf is not None and len(turf) else None,
                "dirt_place": float(dirt["top3"].mean()) if dirt is not None and len(dirt) else None,
                "smile_place": smile_place,
                "place_wilson": wilson(int(sub_r["top3"].sum()) if n_run else 0, n_run),
                "place_shrunk": shrink(place_p, n_run, overall_place) if place_p is not None else None,
                "place_diff": {"diff": d_place[0], "lo": d_place[1], "hi": d_place[2]} if d_place[0] is not None else None,
                "better_primary": better_primary,
                "better_secondary": better_secondary,
                "dep_ok": dep_ok,
                "dep_note": dep_note,
                "candidate": candidate,
                "seinen_mix": sub["seinen"].value_counts().to_dict(),
                "female_rate": float((sub["seibetsu"] == "牝").mean()) if len(sub) else None,
                "shadai_rate": float(sub["seisanshamei"].fillna("").str.contains("社台|ノーザン").mean()) if len(sub) else None,
                "price_median": float(sub["market_price_yen"].median()) if "market_price_yen" in sub.columns and sub["market_price_yen"].notna().any() else None,
                "trainers": p2s["chokyoshimei_ryakusho"].value_counts().head(3).to_dict() if n_p2 else {},
            }
        )
    rows.sort(key=lambda r: (r["candidate"], r["sample_ok"], r["place_rate"] or -1), reverse=True)
    return rows


def inbreed_compare(h: pd.DataFrame, valid: pd.DataFrame) -> dict:
    out = {}
    for col, label in (("ib_deep", "母系にディープインパクト"), ("ib_sunday", "母系にサンデーサイレンス"), ("ib_any", "母系にサンデーまたはディープ")):
        if col not in h.columns:
            continue
        groups = {}
        for flag, name in ((True, "あり"), (False, "なし")):
            sub = h[h[col] == flag]
            ids = set(sub.loc[sub["is_p2"], "ketto_toroku_bango"])
            sub_r = valid[valid["ketto_toroku_bango"].isin(ids)] if not valid.empty else valid
            groups[name] = summarize_group(sub, sub_r, f"{label} {name}")
        out[label] = groups
    return out


def dam_siblings(h: pd.DataFrame) -> list[dict]:
    rows = []
    p = h[h["dam_hn"].fillna("") != ""]
    for dam, sub in p.groupby("dam_hn"):
        if len(sub) < 2:
            continue
        p2 = sub[sub["is_p2"]]
        rows.append(
            {
                "dam_hn": dam,
                "dam_name": sub["dam_name"].iloc[0],
                "n": int(len(sub)),
                "p2": int(len(p2)),
                "names": sub["bamei"].tolist(),
                "wins": int(p2["wins"].sum()) if len(p2) else 0,
                "graded_winners": int(p2["graded_winner"].sum()) if len(p2) else 0,
                "prize_sum": int(p2["prize_yen_se"].sum()) if len(p2) else 0,
            }
        )
    rows.sort(key=lambda r: (r["graded_winners"], r["prize_sum"]), reverse=True)
    return rows[:20]


def run_analyze() -> dict:
    data = load_inputs()
    horses: pd.DataFrame = data["horses"]
    runs: pd.DataFrame = data["runs"]
    meta = data["meta"]
    valid = runs[runs["valid"]].copy() if not runs.empty else runs
    # P1 外の SE は詳細から外す
    p1_ids = set(horses.loc[horses["in_um"], "ketto_toroku_bango"])
    valid = valid[valid["ketto_toroku_bango"].isin(p1_ids)] if not valid.empty else valid

    h = horse_metrics(horses, valid)
    h.to_pickle(OUT / "horse_metrics.pkl")

    overall = summarize_group(h, valid, "コントレイル産駒 全体")
    by_year = []
    for year, sub in h.groupby("seinen"):
        sub_r = valid[valid["ketto_toroku_bango"].isin(sub["ketto_toroku_bango"])]
        by_year.append(summarize_group(sub, sub_r, str(year)))
    by_sex = []
    for sex, sub in h.groupby("seibetsu"):
        sub_r = valid[valid["ketto_toroku_bango"].isin(sub["ketto_toroku_bango"])]
        by_sex.append(summarize_group(sub, sub_r, str(sex)))

    gen = generation_compare(h, valid, data["baseline_um"], data["baseline_runs"])
    contrail_hn = meta["contrail"]["hanshoku_toroku_bango"]
    peers = peer_sires(h, valid, data["baseline_um"], data["baseline_runs"], data["first_crop"], contrail_hn)

    bms = nick_table(h, valid, "bms_hn", "bms_name", MIN_BMS_RUNNERS, MIN_BMS_RUNS)
    lines = nick_table(h, valid, "bms_keito", "bms_keito", MIN_LINE_RUNNERS, MIN_LINE_RUNS)
    damsire2 = nick_table(h, valid, "damsire2_hn", "damsire2_name", MIN_BMS_RUNNERS, MIN_BMS_RUNS)

    notables = h[h["is_p2"]].sort_values(["g1_wins", "g2_wins", "g3_wins", "prize_yen_se"], ascending=False)
    top_horses = notables.head(15)[
        ["bamei", "seinen", "seibetsu", "bms_name", "valid_runs", "wins", "top3",
         "graded_wins", "g1_wins", "g2_wins", "g3_wins", "prize_yen_se", "seisanshamei"]
    ].to_dict(orient="records")

    result = {
        "overall": overall,
        "by_year": by_year,
        "by_sex": by_sex,
        "cross": cross_tabs(valid),
        "generation": gen,
        "peers": peers,
        "bms": bms,
        "bms_lines": lines,
        "damsire2": damsire2,
        "inbreed": inbreed_compare(h, valid),
        "dam_siblings": dam_siblings(h),
        "top_horses": top_horses,
        "ijo_dist": runs["ijo_kubun_code"].value_counts(dropna=False).to_dict() if not runs.empty else {},
        "time_sa_sample": runs["time_sa"].head(20).tolist() if not runs.empty else [],
        "klass_dist": valid["klass"].value_counts().to_dict() if not valid.empty else {},
        "grade_dist": valid["grade_code"].value_counts().to_dict() if not valid.empty else {},
        "track_dist": valid["track_code"].value_counts().head(20).to_dict() if not valid.empty else {},
    }
    (OUT / "analysis.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2, default=str),
        encoding="utf-8",
    )
    print("[analyze] overall", overall)
    print("[analyze] bms candidates", sum(1 for r in bms if r["candidate"]))
    return result
