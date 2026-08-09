# AnalysisDashboardPanel

| 項目 | 内容 |
|------|------|
| 親画面 | [`../horse.md`](../horse.md) / [`../analysis_dashboard.md`](../analysis_dashboard.md) |
| 情報設計 | [`../../UI_design.md`](../../UI_design.md) §2.4（募集馬分析 ダッシュボード要素） |
| 更新日 | 2026-08-09 |

---

## レイアウト

既定の読む順: **募集馬（入力表示）→ 調教師（実データ）→ 生産牧場／血統（骨格）**。  
Body は **2×2 で 4 パネルを常時表示**。配置は **DnD で入れ替え可**（詳細は [`../analysis_dashboard.md`](../analysis_dashboard.md)）。`similarity` / `strength_cost` は載せない。

```text
ToolbarPanel
└─ ContextLabel
BodyPanel（スクロール）
└─ Grid 2×2（スロット順は並び替え可）
     ├─ [スロット0] … 既定: horse    → HorseProfilePanel
     ├─ [スロット1] … 既定: trainer  → TrainerAnalysisPanel
     ├─ [スロット2] … 既定: farm     → 生産牧場パネル本文
     └─ [スロット3] … 既定: pedigree → 血統パネル本文
```

| 要素 | コンポーネント | 配置 |
|------|----------------|------|
| 対象表示 | `ContextLabel` | ツールバー |
| 未分析時 | `EmptyState` | Body 中央寄り（グリッド前） |
| セル見出し＋ハンドル | `SectionHeader` + ドラッグハンドル | 各スロット上端 |
| 募集馬本文 | `HorseProfilePanel` | スロット（既定: 左上） |
| 調教師本文 | `TrainerAnalysisView`（TrainerAnalysisPanel） | スロット（既定: 右上） |
| 牧場・血統本文 | 生産牧場 / 血統 と同一（骨格時は `PlaceholderPanel`） | スロット（既定: 左下 / 右下） |

```text
┌─ 分析 ─────────────────────────────────────────────────┐
│ 対象: （入力中の馬）                                    │
├──────────────────────┬──────────────────────────────────┤
│ ⠿ HorseProfilePanel │ ⠿ TrainerAnalysisView           │
├──────────────────────┼──────────────────────────────────┤
│ ⠿ FarmAnalysisView  │ ⠿ PedigreeAnalysisView          │
└──────────────────────┴──────────────────────────────────┘
```

### 初期値・並び替え

各パネルの対象は募集馬入力から決定。DnD はスロット配置のみ変更する（詳細は [`../analysis_dashboard.md`](../analysis_dashboard.md)）。

---

## ビジュアル

- ツールバーは控えめ
- 2×2 の区切りは弱め。狭幅は 1 カラム可
- ドラッグ中のドロップ先ハイライトは控えめ
- Placeholder / Empty は [`../visual.md`](../visual.md)
