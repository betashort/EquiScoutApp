# 血統（キー入力＋骨格本文）

| 項目 | 内容 |
|------|------|
| 親画面 | [`../pedigree.md`](../pedigree.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.8 |
| ダッシュボード共用 | 本文を 募集馬分析 `pedigree` 埋め込みでも利用 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
PedigreeKeyPanel（父/母） → PedigreeAnalysisPanel（Placeholder）
```

単体画面ではキー入力＋本文。ダッシュボード埋め込みでは **本文のみ**（父・母は募集馬フォーム側を context に渡す）。

| 区画 | コンポーネント |
|------|----------------|
| キー | `EntitySearchBox` 等（父名・母名）。血統 のみ |
| 本文 | `PlaceholderPanel`（将来: SMILE / 馬場 / 兄弟）。募集馬と共用 |

---

## ビジュアル

- 生産牧場単体と同様。プレースホルダ方針は [`../visual.md`](../visual.md)
