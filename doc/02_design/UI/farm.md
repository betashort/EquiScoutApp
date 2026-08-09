# 生産牧場単体分析（骨格）

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.7 |
| 更新日 | 2026-08-09 |

---

## レイアウト

**検索上・本文下**。本文は `PlaceholderPanel` のみ。  
本文コンポーネントは 募集馬分析 ダッシュボードの `farm` 埋め込みと共用。

```text
生産牧場: FarmSearchPanel → FarmAnalysisPanel（Placeholder）
```

### パネル

| パネル | 文書 |
|--------|------|
| 検索＋本文 | [`panels/farm.md`](./panels/farm.md) |

---

## ビジュアル

- プレースホルダは本文エリアと区別できるが「壊れた画面」に見えないこと
- 謝罪調にしない。将来載せる内容を短く明示（情報設計の文言）
- 詳細は [`visual.md`](./visual.md)
