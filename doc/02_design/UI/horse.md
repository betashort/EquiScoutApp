# 募集馬分析

| 項目 | 内容 |
|------|------|
| 情報設計 | [`../UI_design.md`](../UI_design.md) §2.4 |
| ダッシュボード | [`analysis_dashboard.md`](./analysis_dashboard.md) |
| 更新日 | 2026-08-09 |

---

## レイアウト

読む順: **左: 入力フォーム → 右: ダッシュボード**。  
入力は **左サイドバー形式**（開閉可）。ダッシュボードが主表示面。

```text
募集馬（MainContent 内・左右分割）
├─ HorseEntrySidebar（左・開閉）
│    └─ HorseEntryPanel
└─ AnalysisDashboardPanel（右・伸縮）
     ├─ Toolbar（ContextLabel）
     └─ Body（2×2: 募集馬 / 調教師 / 生産牧場 / 血統）
```

**画面ワイヤ（展開時）**

```text
┌─ 入力 ──────────┬─ 分析 ────────────────────────────────────┐
│ HorseEntryPanel │ Toolbar（Context）                         │
│ （縦積みフォーム）│ Body（2×2 グリッド・スクロール）            │
│ …               │  募集馬 │ 調教師                            │
│ [クリア][分析]  │  牧場   │ 血統                              │
└─────────────────┴────────────────────────────────────────────┘
```

**画面ワイヤ（折りたたみ時）**

```text
┌┬─ 分析 ─────────────────────────────────────────────────────┐
││ Toolbar                                                     │
││ Body（ダッシュボードが全幅に近い）                           │
└┴─────────────────────────────────────────────────────────────┘
 ↑ 細いレール（再展開コントロール）
```

### 開閉（HorseEntrySidebar）

| 項目 | 決定 |
|------|------|
| 既定 | **展開**（入力→分析の初回導線を優先） |
| 折りたたみ | サイドバー幅を細いレールまで縮小。フォーム内容は非表示 |
| 再展開 | レール上のコントロール（アイコン／「入力」など）で戻す |
| ダッシュボード | サイドバー幅に追従して伸縮。折りたたみ中は主表示を最大化 |
| 状態 | 画面内の UI 状態（永続化は後続で可） |

### パネル

| パネル | 文書 |
|--------|------|
| HorseEntryPanel | [`panels/horse_entry.md`](./panels/horse_entry.md) |
| AnalysisDashboardPanel | [`panels/dashboard.md`](./panels/dashboard.md) / [`analysis_dashboard.md`](./analysis_dashboard.md) |

ダッシュボード Body は **2×2 で常時表示**。配置は DnD で入れ替え可（詳細は [`analysis_dashboard.md`](./analysis_dashboard.md)）。各パネルの初期値は入力フォームから決定する。

| パネル（既定スロット） | 内容 | 文書 |
|------------------------|------|------|
| `horse`（左上） | 入力した馬の情報（読取専用・単体画面なし） | [`panels/horse_profile.md`](./panels/horse_profile.md) |
| `trainer`（右上） | 調教師分析（単体と共用）・初期値 = 入力の調教師 | [`panels/trainer_analysis.md`](./panels/trainer_analysis.md) |
| `farm`（左下） | 生産牧場（本文・単体と共用）・初期値 = 入力の生産牧場 | [`panels/farm.md`](./panels/farm.md) |
| `pedigree`（右下） | 血統（本文・単体と共用）・初期値 = 入力の父名・母名 | [`panels/pedigree.md`](./panels/pedigree.md) |

---

## ビジュアル

- フォームは左サイドバー内で情報密度高め。装飾カード化しない
- 折りたたみレールは控えめ（ヘッダ左ナビと役割を混同しない）
- Primary = 「分析を表示」、Secondary = 「クリア」（サイドバー内・下端揃え）
- 詳細は [`visual.md`](./visual.md)
