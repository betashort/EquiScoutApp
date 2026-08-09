# 募集馬分析

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.4 |
| ダッシュボード | [`analysis_dashboard.md`](./analysis_dashboard.md) |
| 更新日 | 2026-08-09 |

---

## レイアウト

読む順: **上: 入力フォーム → 下: ダッシュボード**。

```text
募集馬
├─ HorseEntryPanel
└─ AnalysisDashboardPanel
     ├─ Toolbar（AnalysisTypeSelect + ContextLabel）
     └─ Body（module 別 View。単体画面と共用）
```

### パネル

| パネル | 文書 |
|--------|------|
| HorseEntryPanel | [`panels/horse_entry.md`](./panels/horse_entry.md) |
| AnalysisDashboardPanel | [`panels/dashboard.md`](./panels/dashboard.md) / [`analysis_dashboard.md`](./analysis_dashboard.md) |

埋め込み本文は各単体画面と同一コンポーネント:

| module | 共用元 |
|--------|--------|
| `trainer` | [`panels/trainer_analysis.md`](./panels/trainer_analysis.md) |
| `farm` | [`panels/farm.md`](./panels/farm.md)（本文） |
| `pedigree` | [`panels/pedigree.md`](./panels/pedigree.md)（本文） |
| `similarity` | ダッシュボード専用プレースホルダ |

---

## ビジュアル

- フォームは情報密度高め。装飾カード化しない
- Primary = 「分析を表示」、Secondary = 「クリア」（右下揃え）
- 詳細は [`visual.md`](./visual.md)
