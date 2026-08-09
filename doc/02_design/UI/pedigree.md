# 血統単体分析（骨格）

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.7 |
| 更新日 | 2026-08-09 |

---

## レイアウト

**検索上・本文下**。本文は `PlaceholderPanel` のみ。  
本文コンポーネントは 募集馬分析 ダッシュボードの `pedigree` 埋め込みと共用。

```text
血統: PedigreeKeyPanel（父/母） → PedigreeAnalysisPanel（Placeholder）
```

### パネル

| パネル | 文書 |
|--------|------|
| キー入力＋本文 | [`panels/pedigree.md`](./panels/pedigree.md) |

---

## ビジュアル

- 生産牧場単体と同様。プレースホルダは壊れた画面に見えないこと
- 詳細は [`visual.md`](./visual.md)
