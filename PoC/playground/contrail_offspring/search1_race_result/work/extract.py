"""コントレイル産駒の抽出と品質チェック。中間成果は work/out/。"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd
from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

from codes import (
    SEINEN_FOCUS,
    ijo_ok,
    is_jra,
    parse_chakujun,
    parse_chakukai,
    parse_time_sa_seconds,
    prize_yen,
    race_class,
    seibetsu_label,
    smile_band,
    track_surface,
    um_distance_band,
    baba_label,
    clean_code,
    to_int,
)

OUT = Path(__file__).resolve().parent / "out"
EXTRACTED_AT = datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")

RACE_KEYS = [
    "kaisai_nen",
    "kaisai_tsukihi",
    "keibajo_code",
    "kaisai_kai",
    "kaisai_nichime",
    "race_bango",
]


def q(engine: Engine, sql: str, params: dict | None = None) -> pd.DataFrame:
    with engine.connect() as conn:
        return pd.read_sql(text(sql), conn, params=params or {})


def list_jvd_tables(engine: Engine) -> pd.DataFrame:
    return q(
        engine,
        """
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_type = 'BASE TABLE'
          AND table_name ~ '^jvd_'
        ORDER BY table_schema, table_name
        """,
    )


def table_columns(engine: Engine, table: str) -> list[str]:
    insp = inspect(engine)
    schema = None
    name = table
    if "." in table:
        schema, name = table.split(".", 1)
    cols = insp.get_columns(name, schema=schema)
    return [c["name"] for c in cols]


def pick_col(cols: list[str], *candidates: str) -> str | None:
    lower = {c.lower(): c for c in cols}
    for cand in candidates:
        if cand.lower() in lower:
            return lower[cand.lower()]
    return None


def find_contrail(engine: Engine, hn_cols: list[str]) -> pd.DataFrame:
    bamei = pick_col(hn_cols, "bamei")
    eur = pick_col(hn_cols, "bamei_eur")
    conds = []
    if bamei:
        conds.append(f"bamei LIKE '%コントレイル%'")
    if eur:
        conds.append(f"{eur} ILIKE '%contrail%'")
    where = " OR ".join(conds) if conds else "TRUE"
    select_cols = ", ".join(hn_cols)
    return q(
        engine,
        f"""
        SELECT {select_cols}
        FROM jvd_hn
        WHERE COALESCE(data_kubun, '') <> '0'
          AND ({where})
        """,
    )


def choose_contrail(candidates: pd.DataFrame) -> dict[str, Any]:
    if candidates.empty:
        raise RuntimeError("jvd_hn に『コントレイル』が見つからない")
    df = candidates.copy()
    df["_seinen"] = df["seinen"].map(clean_code) if "seinen" in df.columns else ""
    year2017 = df[df["_seinen"] == "2017"]
    use = year2017 if not year2017.empty else df
    if len(use) > 1:
        # 父がディープインパクトならそれで一意化
        if "ketto_joho_01b" in use.columns:
            deep = use[use["ketto_joho_01b"].map(clean_code) == "ディープインパクト"]
            if not deep.empty:
                use = deep
        if len(use) > 1:
            raise RuntimeError(
                f"コントレイル候補が {len(use)} 頭。生年・父でも一意化できないため停止"
            )
    row = use.iloc[0]
    return {
        "hanshoku_toroku_bango": clean_code(row["hanshoku_toroku_bango"]),
        "ketto_toroku_bango": clean_code(row.get("ketto_toroku_bango", "")),
        "bamei": clean_code(row.get("bamei", "")),
        "seinen": clean_code(row.get("seinen", "")),
        "sire_hn": clean_code(row.get("ketto_joho_01a", "")),
        "raw": {k: (None if pd.isna(v) else str(v)) for k, v in row.items() if not str(k).startswith("_")},
    }


def load_sk(engine: Engine, contrail_hn: str) -> pd.DataFrame:
    return q(
        engine,
        """
        SELECT *
        FROM jvd_sk
        WHERE COALESCE(data_kubun, '') <> '0'
          AND TRIM(ketto_joho_01a) = :hn
        """,
        {"hn": contrail_hn},
    )


def load_um_by_sire(engine: Engine, contrail_hn: str) -> pd.DataFrame:
    return q(
        engine,
        """
        SELECT *
        FROM jvd_um
        WHERE COALESCE(data_kubun, '') <> '0'
          AND TRIM(ketto_joho_01a) = :hn
        """,
        {"hn": contrail_hn},
    )


def load_hn_names(engine: Engine, ids: list[str]) -> pd.DataFrame:
    ids = sorted({i for i in ids if i})
    if not ids:
        return pd.DataFrame(columns=["hanshoku_toroku_bango", "bamei", "ketto_toroku_bango", "seinen"])
    return q(
        engine,
        """
        SELECT DISTINCT ON (TRIM(hanshoku_toroku_bango))
               TRIM(hanshoku_toroku_bango) AS hanshoku_toroku_bango,
               TRIM(bamei) AS bamei,
               TRIM(ketto_toroku_bango) AS ketto_toroku_bango,
               TRIM(seinen) AS seinen
        FROM jvd_hn
        WHERE COALESCE(data_kubun, '') <> '0'
          AND TRIM(hanshoku_toroku_bango) = ANY(:ids)
        ORDER BY TRIM(hanshoku_toroku_bango), data_sakusei_nengappi DESC
        """,
        {"ids": ids},
    )


def load_bt(engine: Engine, ids: list[str]) -> pd.DataFrame:
    ids = sorted({i for i in ids if i})
    if not ids:
        return pd.DataFrame(columns=["hanshoku_toroku_bango", "keito_id", "keito_mei"])
    return q(
        engine,
        """
        SELECT DISTINCT ON (TRIM(hanshoku_toroku_bango))
               TRIM(hanshoku_toroku_bango) AS hanshoku_toroku_bango,
               TRIM(keito_id) AS keito_id,
               TRIM(keito_mei) AS keito_mei
        FROM jvd_bt
        WHERE COALESCE(data_kubun, '') <> '0'
          AND TRIM(hanshoku_toroku_bango) = ANY(:ids)
        ORDER BY TRIM(hanshoku_toroku_bango), LENGTH(COALESCE(keito_mei, '')) DESC
        """,
        {"ids": ids},
    )


def load_hs(engine: Engine, ids: list[str]) -> pd.DataFrame:
    ids = sorted({i for i in ids if i})
    if not ids:
        return pd.DataFrame()
    return q(
        engine,
        """
        SELECT *
        FROM jvd_hs
        WHERE COALESCE(data_kubun, '') <> '0'
          AND TRIM(ketto_toroku_bango) = ANY(:ids)
        """,
        {"ids": ids},
    )


RUN_SELECT = """
          TRIM(se.ketto_toroku_bango) AS ketto_toroku_bango,
          TRIM(se.bamei) AS se_bamei,
          TRIM(se.kaisai_nen) AS kaisai_nen,
          TRIM(se.kaisai_tsukihi) AS kaisai_tsukihi,
          TRIM(se.keibajo_code) AS keibajo_code,
          TRIM(se.kaisai_kai) AS kaisai_kai,
          TRIM(se.kaisai_nichime) AS kaisai_nichime,
          TRIM(se.race_bango) AS race_bango,
          TRIM(se.ijo_kubun_code) AS ijo_kubun_code,
          TRIM(se.kakutei_chakujun) AS kakutei_chakujun,
          TRIM(se.kakutoku_honshokin) AS kakutoku_honshokin,
          TRIM(se.tansho_ninkijun) AS tansho_ninkijun,
          TRIM(se.time_sa) AS time_sa,
          TRIM(se.barei) AS barei,
          TRIM(se.seibetsu_code) AS se_seibetsu_code,
          TRIM(ra.kyori) AS kyori,
          TRIM(ra.track_code) AS track_code,
          TRIM(ra.grade_code) AS grade_code,
          TRIM(ra.kyoso_joken_code) AS kyoso_joken_code,
          TRIM(ra.kyoso_shubetsu_code) AS kyoso_shubetsu_code,
          TRIM(ra.kyoso_joken_meisho) AS kyoso_joken_meisho,
          TRIM(ra.kyosomei_hondai) AS kyosomei_hondai,
          TRIM(ra.babajotai_code_shiba) AS babajotai_code_shiba,
          TRIM(ra.babajotai_code_dirt) AS babajotai_code_dirt,
          TRIM(ra.shusso_tosu) AS shusso_tosu,
          TRIM(ra.nyusen_tosu) AS nyusen_tosu
"""

RUN_JOIN = """
        FROM jvd_se se
        JOIN jvd_ra ra
          ON ra.kaisai_nen = se.kaisai_nen
         AND ra.kaisai_tsukihi = se.kaisai_tsukihi
         AND ra.keibajo_code = se.keibajo_code
         AND ra.kaisai_kai = se.kaisai_kai
         AND ra.kaisai_nichime = se.kaisai_nichime
         AND ra.race_bango = se.race_bango
        WHERE COALESCE(se.data_kubun, '') <> '0'
          AND COALESCE(ra.data_kubun, '') <> '0'
"""


def load_runs_for_horses(engine: Engine, ids: list[str]) -> pd.DataFrame:
    ids = sorted({i for i in ids if i})
    if not ids:
        return pd.DataFrame()
    return q(
        engine,
        f"""
        SELECT {RUN_SELECT}
        {RUN_JOIN}
          AND se.ketto_toroku_bango = ANY(:ids)
        """,
        {"ids": ids},
    )


def load_baseline_runs(engine: Engine) -> pd.DataFrame:
    years = list(SEINEN_FOCUS)
    return q(
        engine,
        f"""
        SELECT {RUN_SELECT},
               SUBSTRING(um.seinengappi FROM 1 FOR 4) AS um_seinen,
               TRIM(um.ketto_joho_01a) AS sire_hn,
               TRIM(um.ketto_joho_01b) AS sire_name
        FROM jvd_um um
        JOIN jvd_se se
          ON se.ketto_toroku_bango = um.ketto_toroku_bango
        JOIN jvd_ra ra
          ON ra.kaisai_nen = se.kaisai_nen
         AND ra.kaisai_tsukihi = se.kaisai_tsukihi
         AND ra.keibajo_code = se.keibajo_code
         AND ra.kaisai_kai = se.kaisai_kai
         AND ra.kaisai_nichime = se.kaisai_nichime
         AND ra.race_bango = se.race_bango
        WHERE COALESCE(um.data_kubun, '') <> '0'
          AND COALESCE(se.data_kubun, '') <> '0'
          AND COALESCE(ra.data_kubun, '') <> '0'
          AND SUBSTRING(um.seinengappi FROM 1 FOR 4) = ANY(:years)
        """,
        {"years": years},
    )


def load_baseline_um(engine: Engine) -> pd.DataFrame:
    years = list(SEINEN_FOCUS)
    return q(
        engine,
        """
        SELECT
          TRIM(ketto_toroku_bango) AS ketto_toroku_bango,
          TRIM(bamei) AS bamei,
          SUBSTRING(TRIM(seinengappi) FROM 1 FOR 4) AS seinen,
          TRIM(seibetsu_code) AS seibetsu_code,
          TRIM(ketto_joho_01a) AS sire_hn,
          TRIM(ketto_joho_01b) AS sire_name,
          TRIM(seisanshamei) AS seisanshamei,
          TRIM(chokyoshimei_ryakusho) AS chokyoshimei_ryakusho,
          TRIM(heichi_honshokin_ruikei) AS heichi_honshokin_ruikei,
          TRIM(chuo_gokei) AS chuo_gokei
        FROM jvd_um
        WHERE COALESCE(data_kubun, '') <> '0'
          AND SUBSTRING(TRIM(seinengappi) FROM 1 FOR 4) = ANY(:years)
        """,
        {"years": years},
    )


def load_sire_first_crop(engine: Engine) -> pd.DataFrame:
    return q(
        engine,
        """
        SELECT
          TRIM(ketto_joho_01a) AS sire_hn,
          MIN(SUBSTRING(TRIM(seinengappi) FROM 1 FOR 4)) AS first_crop_year,
          COUNT(*) AS um_n
        FROM jvd_um
        WHERE COALESCE(data_kubun, '') <> '0'
          AND TRIM(COALESCE(ketto_joho_01a, '')) <> ''
        GROUP BY TRIM(ketto_joho_01a)
        """,
    )


def annotate_runs(runs: pd.DataFrame) -> pd.DataFrame:
    if runs.empty:
        return runs
    df = runs.copy()
    df["kakutei_n"] = df["kakutei_chakujun"].map(parse_chakujun)
    df["surface"] = df["track_code"].map(track_surface)
    df["is_jra"] = df["keibajo_code"].map(is_jra)
    df["ijo_ok"] = df["ijo_kubun_code"].map(ijo_ok)
    df["is_heichi"] = df["surface"].isin(["芝", "ダート"])
    df["valid"] = (
        df["ijo_ok"]
        & df["kakutei_n"].notna()
        & df["is_heichi"]
        & df["is_jra"]
    )
    df["win"] = df["valid"] & (df["kakutei_n"] == 1)
    df["top2"] = df["valid"] & (df["kakutei_n"] <= 2)
    df["top3"] = df["valid"] & (df["kakutei_n"] <= 3)
    df["prize_yen"] = df["kakutoku_honshokin"].map(prize_yen)
    df["prize_yen"] = df["prize_yen"].where(df["valid"], 0)
    df["ninki"] = df["tansho_ninkijun"].map(lambda x: to_int(x))
    df["fav13"] = df["valid"] & df["ninki"].isin([1, 2, 3])
    df["time_sa_sec"] = df["time_sa"].map(parse_time_sa_seconds)
    df["kyori_n"] = df["kyori"].map(lambda x: to_int(x))
    df["smile"] = df["kyori_n"].map(smile_band)
    df["dist_band"] = df["kyori_n"].map(um_distance_band)
    df["klass"] = [
        race_class(g, j, m)
        for g, j, m in zip(df["grade_code"], df["kyoso_joken_code"], df["kyoso_joken_meisho"])
    ]
    df["is_graded"] = df["grade_code"].map(lambda g: clean_code(g) in {"A", "B", "C"})
    df["is_g1"] = df["grade_code"].map(lambda g: clean_code(g) == "A")
    df["is_g2"] = df["grade_code"].map(lambda g: clean_code(g) == "B")
    df["is_g3"] = df["grade_code"].map(lambda g: clean_code(g) == "C")
    df["is_listed"] = df["grade_code"].map(lambda g: clean_code(g) == "L")
    df["barei_n"] = df["barei"].map(lambda x: to_int(x))
    field = df["shusso_tosu"].map(lambda x: to_int(x))
    df["field_n"] = field
    lower_third = []
    big_loss = []
    for n, field_n, tsa, valid in zip(df["kakutei_n"], df["field_n"], df["time_sa_sec"], df["valid"]):
        if not valid or n is None:
            lower_third.append(False)
            big_loss.append(False)
            continue
        fn = field_n or 0
        low = bool(fn >= 3 and n > (2 * fn) / 3)
        t = tsa is not None and tsa > 1.0
        lower_third.append(low)
        big_loss.append(low or t)
    df["lower_third"] = lower_third
    df["big_loss"] = big_loss
    baba = []
    for surface, s_code, d_code in zip(df["surface"], df["babajotai_code_shiba"], df["babajotai_code_dirt"]):
        code = s_code if surface == "芝" else d_code if surface == "ダート" else ""
        baba.append(baba_label(code))
    df["baba"] = baba
    df["baba_group"] = df["baba"].map(lambda x: "良" if x == "良" else ("稍重以上" if x in {"稍重", "重", "不良"} else "不明"))
    return df


def build_horses(sk: pd.DataFrame, um: pd.DataFrame, hn_names: pd.DataFrame, bt: pd.DataFrame) -> pd.DataFrame:
    sk_ids = sk["ketto_toroku_bango"].map(clean_code)
    um_ids = um["ketto_toroku_bango"].map(clean_code)
    all_ids = sorted(set(sk_ids) | set(um_ids))
    name_map = hn_names.set_index("hanshoku_toroku_bango")["bamei"].to_dict() if not hn_names.empty else {}
    bt_map = bt.set_index("hanshoku_toroku_bango") if not bt.empty else pd.DataFrame()

    um_i = um.copy()
    um_i["_id"] = um_ids
    um_i = um_i.drop_duplicates("_id", keep="last").set_index("_id")
    sk_i = sk.copy()
    sk_i["_id"] = sk_ids
    sk_i = sk_i.drop_duplicates("_id", keep="last").set_index("_id")

    rows = []
    for hid in all_ids:
        srow = sk_i.loc[hid] if hid in sk_i.index else None
        urow = um_i.loc[hid] if hid in um_i.index else None
        src = urow if urow is not None else srow
        if src is None:
            continue

        def g(col: str, default: str = "") -> str:
            if urow is not None and col in urow.index and pd.notna(urow[col]):
                return clean_code(urow[col])
            if srow is not None and col in srow.index and pd.notna(srow[col]):
                return clean_code(srow[col])
            return default

        seinengappi = g("seinengappi")
        seinen = seinengappi[:4] if len(seinengappi) >= 4 else ""
        slots = {f"{n:02d}": g(f"ketto_joho_{n:02d}a") for n in range(1, 15)}
        slot_names = {f"{n:02d}": g(f"ketto_joho_{n:02d}b") for n in range(1, 15)}
        for k, v in slots.items():
            if not slot_names[k]:
                slot_names[k] = clean_code(name_map.get(v, ""))

        def keito(slot: str) -> tuple[str, str]:
            hid_k = slots[slot]
            if hid_k and not bt_map.empty and hid_k in bt_map.index:
                rec = bt_map.loc[hid_k]
                if isinstance(rec, pd.DataFrame):
                    rec = rec.iloc[0]
                mei = clean_code(rec.get("keito_mei", ""))
                kid = clean_code(rec.get("keito_id", ""))
                return kid, mei or "系統不明"
            return "", "系統不明"

        bms_keito_id, bms_keito = keito("05")
        bms_sire_keito_id, bms_sire_keito = keito("11")
        dms_keito_id, dms_keito = keito("13")

        chuo = parse_chakukai(g("chuo_gokei"))
        sogo = parse_chakukai(g("sogo"))
        rows.append(
            {
                "ketto_toroku_bango": hid,
                "in_sk": hid in sk_i.index,
                "in_um": hid in um_i.index,
                "bamei": g("bamei") or "(未命名)",
                "seinen": seinen,
                "seinengappi": seinengappi,
                "seibetsu_code": g("seibetsu_code"),
                "seibetsu": seibetsu_label(g("seibetsu_code")),
                "seisansha_code": g("seisansha_code"),
                "seisanshamei": g("seisanshamei"),
                "sanchimei": g("sanchimei"),
                "chokyoshi_code": g("chokyoshi_code"),
                "chokyoshimei_ryakusho": g("chokyoshimei_ryakusho"),
                "heichi_honshokin_ruikei_yen": prize_yen(g("heichi_honshokin_ruikei")),
                "chuo_starts": chuo["出走"],
                "chuo_wins": chuo["1着"],
                "sogo_starts": sogo["出走"],
                "sogo_wins": sogo["1着"],
                "sire_hn": slots["01"],
                "sire_name": slot_names["01"] or "コントレイル",
                "dam_hn": slots["02"],
                "dam_name": slot_names["02"],
                "bms_hn": slots["05"],
                "bms_name": slot_names["05"],
                "bms_keito_id": bms_keito_id,
                "bms_keito": bms_keito,
                "damsire_sire_hn": slots["11"],
                "damsire_sire_name": slot_names["11"],
                "bms_sire_keito": bms_sire_keito,
                "bms_sire_keito_id": bms_sire_keito_id,
                "damsire2_hn": slots["13"],
                "damsire2_name": slot_names["13"],
                "damsire2_keito": dms_keito,
                "ss_hn": slots["07"],
                "ss_name": slot_names["07"],
                "deep_hn": slots["03"],
                "deep_name": slot_names["03"],
                **{f"k{n:02d}": slots[f"{n:02d}"] for n in range(1, 15)},
                **{f"n{n:02d}": slot_names[f"{n:02d}"] for n in range(1, 15)},
            }
        )
    return pd.DataFrame(rows)


def quality_checks(
    contrail: dict[str, Any],
    sk: pd.DataFrame,
    um: pd.DataFrame,
    horses: pd.DataFrame,
    runs: pd.DataFrame,
) -> dict[str, Any]:
    sk_n = int(sk["ketto_toroku_bango"].map(clean_code).nunique()) if not sk.empty else 0
    um_n = int(um["ketto_toroku_bango"].map(clean_code).nunique()) if not um.empty else 0
    sk_table_empty = sk.empty and um_n > 0
    um_only = sorted(set(horses.loc[~horses["in_sk"], "ketto_toroku_bango"])) if not horses.empty else []
    sire_name_mismatch = 0
    if not um.empty and "ketto_joho_01b" in um.columns:
        sire_name_mismatch = int(
            (~um["ketto_joho_01b"].map(clean_code).isin(["コントレイル", ""])).sum()
        )
    early = []
    if not horses.empty:
        early = horses.loc[horses["seinen"].map(lambda y: y.isdigit() and int(y) < 2022), "ketto_toroku_bango"].tolist()
    se_ids = set(runs["ketto_toroku_bango"].map(clean_code)) if not runs.empty else set()
    um_ids = set(horses.loc[horses["in_um"], "ketto_toroku_bango"]) if not horses.empty else set()
    se_not_um = sorted(se_ids - um_ids)

    valid = runs[runs["valid"]] if not runs.empty else runs
    se_starts = int(valid.groupby("ketto_toroku_bango").size().sum()) if not valid.empty else 0
    um_chuo = int(horses["chuo_starts"].sum()) if not horses.empty else 0

    return {
        "contrail_hn_unique": True,
        "sk_n": sk_n,
        "um_n": um_n,
        "sk_table_empty": sk_table_empty,
        "sk_ge_um": True if sk_table_empty else sk_n >= um_n,
        "um_only_not_in_sk": um_only,
        "sire_name_mismatch_n": sire_name_mismatch,
        "sire_name_mismatch_rate": (sire_name_mismatch / um_n) if um_n else 0.0,
        "foals_before_2022": early,
        "se_not_in_um": se_not_um,
        "valid_runs": int(valid.shape[0]) if not valid.empty else 0,
        "um_chuo_starts_sum": um_chuo,
        "se_valid_starts": se_starts,
        "chuo_vs_se_note": "UM 中央着回は障害含む。SE 有効走は中央平地のみ。大枠の件数比較用。",
    }


def save_df(df: pd.DataFrame, stem: str) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{stem}.pkl"
    df.to_pickle(path)
    print(f"[extract] wrote {path} rows={len(df)}")
    return path


def load_df(stem: str) -> pd.DataFrame:
    path = OUT / f"{stem}.pkl"
    if not path.exists():
        alt = OUT / f"{stem}.parquet"
        if alt.exists():
            return pd.read_parquet(alt)
        raise FileNotFoundError(path)
    return pd.read_pickle(path)


def run_extract(engine: Engine) -> dict[str, Any]:
    OUT.mkdir(parents=True, exist_ok=True)
    tables = list_jvd_tables(engine)
    print("[extract] jvd tables:", ", ".join(tables["table_name"].tolist()))
    needed = {"jvd_hn", "jvd_sk", "jvd_um", "jvd_se", "jvd_ra", "jvd_bt"}
    have = set(tables["table_name"].str.lower())
    missing = sorted(needed - have)
    if missing:
        raise RuntimeError(f"必要テーブルが無い: {missing}")

    hn_cols = table_columns(engine, "jvd_hn")
    candidates = find_contrail(engine, hn_cols)
    save_df(candidates, "contrail_hn_candidates")
    contrail = choose_contrail(candidates)
    hn = contrail["hanshoku_toroku_bango"]
    print(f"[extract] CONTRAL_HN={hn} ketto={contrail['ketto_toroku_bango']} seinen={contrail['seinen']}")

    sk = load_sk(engine, hn)
    um = load_um_by_sire(engine, hn)
    print(f"[extract] SK={len(sk)} UM={len(um)}")

    slot_ids: list[str] = []
    for df in (sk, um):
        for n in range(1, 15):
            col = f"ketto_joho_{n:02d}a"
            if col in df.columns:
                slot_ids.extend(df[col].map(clean_code).tolist())
    slot_ids.append(hn)
    if contrail.get("sire_hn"):
        slot_ids.append(contrail["sire_hn"])

    hn_names = load_hn_names(engine, slot_ids)
    bt = load_bt(engine, slot_ids)
    horses = build_horses(sk, um, hn_names, bt)

    # インブリード（母系にディープ / サンデー）
    deep_id = horses["deep_hn"].mode().iloc[0] if not horses.empty and horses["deep_hn"].ne("").any() else ""
    ss_id = horses["ss_hn"].mode().iloc[0] if not horses.empty and horses["ss_hn"].ne("").any() else ""
    dam_slots = [f"k{n:02d}" for n in (5, 6, 11, 12, 13, 14)]
    if not horses.empty:
        horses["ib_deep"] = horses[dam_slots].eq(deep_id).any(axis=1) if deep_id else False
        horses["ib_sunday"] = horses[dam_slots].eq(ss_id).any(axis=1) if ss_id else False
        horses["ib_any"] = horses["ib_deep"] | horses["ib_sunday"]

    ids = horses["ketto_toroku_bango"].tolist() if not horses.empty else []
    hs = load_hs(engine, ids)
    if not hs.empty:
        hs["price_yen"] = hs["torihiki_kakaku"].map(lambda x: to_int(x, 0) or 0)
        price = (
            hs.groupby(hs["ketto_toroku_bango"].map(clean_code))["price_yen"]
            .max()
            .rename("market_price_yen")
        )
        horses = horses.merge(price, left_on="ketto_toroku_bango", right_index=True, how="left")
    else:
        horses["market_price_yen"] = pd.NA

    runs = load_runs_for_horses(engine, ids)
    runs = annotate_runs(runs)

    # 1 頭分の目視確認用（3 代血統）
    sample_horse = horses.sort_values(["in_um", "seinen"], ascending=[False, True]).head(1)
    print("[extract] pedigree sample:")
    if not sample_horse.empty:
        r = sample_horse.iloc[0]
        print(f"  {r['bamei']} {r['seinen']} 父={r['n01']} 母={r['n02']} 母父={r['n05']} 父父={r['n03']}")

    baseline_um = load_baseline_um(engine)
    for col in ("bamei", "sire_name", "seisanshamei", "chokyoshimei_ryakusho"):
        if col in baseline_um.columns:
            baseline_um[col] = baseline_um[col].map(clean_code)
    print(f"[extract] baseline UM {SEINEN_FOCUS} n={len(baseline_um)}")
    baseline_runs = load_baseline_runs(engine)
    baseline_runs = annotate_runs(baseline_runs)
    if "sire_name" in baseline_runs.columns:
        baseline_runs["sire_name"] = baseline_runs["sire_name"].map(clean_code)
    print(f"[extract] baseline SE rows={len(baseline_runs)} valid={int(baseline_runs['valid'].sum()) if not baseline_runs.empty else 0}")

    first_crop = load_sire_first_crop(engine)

    qc = quality_checks(contrail, sk, um, horses, runs)
    qc["deep_hn"] = deep_id
    qc["sunday_hn"] = ss_id
    print("[extract] QC", {k: qc[k] for k in ("sk_n", "um_n", "sk_ge_um", "sire_name_mismatch_n", "foals_before_2022", "valid_runs")})

    save_df(sk, "sk")
    save_df(um, "um")
    save_df(horses, "horses")
    save_df(runs, "runs_contrail")
    save_df(baseline_um, "baseline_um")
    save_df(baseline_runs, "runs_baseline")
    save_df(first_crop, "sire_first_crop")
    save_df(hn_names, "hn_names")
    save_df(bt, "bt")
    if not hs.empty:
        save_df(hs, "hs")

    meta = {
        "extracted_at": EXTRACTED_AT,
        "contrail": {k: v for k, v in contrail.items() if k != "raw"},
        "contrail_raw": contrail.get("raw"),
        "quality": qc,
        "hn_columns": hn_cols,
        "tables": tables.to_dict(orient="records"),
    }
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    return meta
