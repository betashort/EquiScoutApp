# P-S04 血統（キー入力＋骨格本文）

| 項目 | 内容 |
|------|------|
| 親画面 | [`../S04_pedigree.md`](../S04_pedigree.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.8 |
| 更新日 | 2026-08-09 |

---

## レイアウト

```text
PedigreeKeyPanel（父/母） → PedigreeAnalysisPanel（Placeholder）
```

| 区画 | コンポーネント |
|------|----------------|
| キー | `EntitySearchBox` 等（父名・母名） |
| 本文 | `PlaceholderPanel`（将来: SMILE / 馬場 / 兄弟） |

---

## ビジュアル

- S03 と同様。プレースホルダ方針は [`../visual.md`](../visual.md)
