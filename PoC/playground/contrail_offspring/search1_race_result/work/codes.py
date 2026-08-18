"""JV-DL コード表の本調査用マップ。根拠は定義書コード番号。"""

from __future__ import annotations

JRA_KEIBAJO = {
    "01": "札幌",
    "02": "函館",
    "03": "福島",
    "04": "新潟",
    "05": "東京",
    "06": "中山",
    "07": "中京",
    "08": "京都",
    "09": "阪神",
    "10": "小倉",
}

# 2202.性別コード
SEIBETSU = {"1": "牡", "2": "牝", "3": "せん"}

# 2101.異常区分コード
IJO = {
    "0": "正常",
    "1": "取消",
    "2": "除外",
    "3": "競走中止",
    "4": "失格",
    "5": "降着",
}

# 2003.グレードコード
GRADE = {
    "A": "G1",
    "B": "G2",
    "C": "G3",
    "L": "Listed",
    "D": "グレード無し",
    "": "グレード無し",
}

# 2006.競走条件コード（最若年）。701 系は現行クラス、005/010/016 は旧収得賞金クラス。
JOKEN = {
    "000": "未設定",
    "701": "新馬",
    "702": "未勝利",
    "005": "未勝利",
    "703": "1勝クラス",
    "010": "1勝クラス",
    "704": "2勝クラス",
    "016": "2勝クラス",
    "705": "3勝クラス",
    "999": "オープン",
}

# 2005.競走種別コードは年齢区分（クラスではない）
SHUBETSU = {
    "11": "2歳",
    "12": "3歳",
    "13": "3歳以上",
    "14": "4歳以上",
    "18": "障害",
    "19": "障害",
}

# 2001.トラックコード
# 10-22 芝、23-29 ダート、51-59 障害
TRACK_TURF = set(range(10, 23))
TRACK_DIRT = set(range(23, 30))
TRACK_JUMP = set(range(51, 60))

# 2002.馬場状態コード
BABA = {"1": "良", "2": "稍重", "3": "重", "4": "不良"}

CLASS_ORDER = [
    "新馬",
    "未勝利",
    "1勝クラス",
    "2勝クラス",
    "3勝クラス",
    "オープン",
    "Listed",
    "G3",
    "G2",
    "G1",
    "その他",
]

SMILE_ORDER = ["S", "M", "I", "L", "E"]
SURFACE_ORDER = ["芝", "ダート"]
SEINEN_FOCUS = ("2022", "2023", "2024")

HUNDRED_YEN = 100  # 本賞金の DB 単位は百円

# 調査 B の最小標本
MIN_BMS_RUNNERS = 5
MIN_BMS_RUNS = 20
MIN_LINE_RUNNERS = 8
MIN_LINE_RUNS = 30


def clean_code(value: object) -> str:
    if value is None:
        return ""
    s = str(value).replace("\u3000", "").strip()
    if s.lower() == "none" or s.lower() == "nan":
        return ""
    return s


def to_int(value: object, default: int | None = None) -> int | None:
    s = clean_code(value)
    if s == "":
        return default
    try:
        return int(s)
    except ValueError:
        return default


def seibetsu_label(code: object) -> str:
    return SEIBETSU.get(clean_code(code), "不明")


def is_jra(keibajo_code: object) -> bool:
    return clean_code(keibajo_code) in JRA_KEIBAJO


def track_surface(track_code: object) -> str:
    n = to_int(track_code)
    if n is None:
        return "不明"
    if n in TRACK_JUMP:
        return "障害"
    if n in TRACK_DIRT:
        return "ダート"
    if n in TRACK_TURF:
        return "芝"
    return "不明"


def baba_label(code: object) -> str:
    return BABA.get(clean_code(code), "不明")


def smile_band(kyori: object) -> str:
    n = to_int(kyori)
    if n is None or n <= 0:
        return "不明"
    if n <= 1400:
        return "S"
    if n <= 1600:
        return "M"
    if n <= 2000:
        return "I"
    if n <= 2400:
        return "L"
    return "E"


def um_distance_band(kyori: object) -> str:
    n = to_int(kyori)
    if n is None or n <= 0:
        return "不明"
    if n <= 1600:
        return "16下"
    if n <= 2200:
        return "22下"
    return "22超"


def race_class(grade_code: object, joken_code: object, meisho: object = "") -> str:
    g = clean_code(grade_code)
    if g in {"A", "B", "C", "L"}:
        return GRADE[g]
    j = clean_code(joken_code)
    if j in JOKEN and j not in {"000"}:
        return JOKEN[j]
    name = clean_code(meisho)
    if "新馬" in name:
        return "新馬"
    if "未勝利" in name:
        return "未勝利"
    if "１勝" in name or "1勝" in name:
        return "1勝クラス"
    if "２勝" in name or "2勝" in name:
        return "2勝クラス"
    if "３勝" in name or "3勝" in name:
        return "3勝クラス"
    if "ＯＰ" in name or "OP" in name or "オープン" in name:
        return "オープン"
    return "その他"


def is_graded(grade_code: object) -> bool:
    return clean_code(grade_code) in {"A", "B", "C"}


def is_listed_or_op(grade_code: object, klass: str) -> bool:
    g = clean_code(grade_code)
    return g == "L" or klass == "オープン"


def parse_chakujun(value: object) -> int | None:
    n = to_int(value)
    if n is None or n < 1 or n > 28:
        return None
    return n


def parse_time_sa_seconds(value: object) -> float | None:
    """タイム差。実データを見て 0.1 秒単位整数か秒小数かを吸収する。"""
    s = clean_code(value)
    if s == "" or s in {"----", "9999", "999", "****"}:
        return None
    try:
        raw = float(s)
    except ValueError:
        return None
    if raw < 0:
        return None
    # 4 桁ゼロ埋め整数（例 0120）は 0.1 秒単位 = 12.0 秒、とは限らない。
    # 1.0 秒超判定用なので、10 以上は 0.1 秒単位とみなす。
    if raw >= 10:
        return raw / 10.0
    return raw


def prize_yen(honshokin_hundreds: object) -> int:
    n = to_int(honshokin_hundreds, 0) or 0
    return n * HUNDRED_YEN


def parse_chakukai(raw: object) -> dict[str, int]:
    """18 桁着回数（1〜5 着 + 着外が各 3 桁）を分解する。"""
    s = clean_code(raw).rjust(18, "0")[:18]
    keys = ["1着", "2着", "3着", "4着", "5着", "着外"]
    out = {}
    for i, key in enumerate(keys):
        chunk = s[i * 3 : (i + 1) * 3]
        out[key] = int(chunk) if chunk.isdigit() else 0
    out["出走"] = sum(out.values())
    return out


def ijo_ok(code: object) -> bool:
    """取消・除外・競走中止・失格を除く。降着は確定着順があるので残す。"""
    c = clean_code(code)
    return c in {"", "0", "5"}
