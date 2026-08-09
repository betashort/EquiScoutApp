import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  EMPTY_HORSE_ENTRY,
  FILLED_HORSE_ENTRY,
  HORSE_ENTRY_VALIDATION_ERRORS,
  MOCK_TRAINER_ANALYSIS,
} from '../domain/mocks'
import { ScreenShell } from '../storybook/ScreenShell'
import {
  desktopScreenParameters,
  viewportGlobals,
} from '../storybook/viewports'
import { HorseScreen } from './HorseScreen'

const meta = {
  title: 'Screens/Horse',
  component: HorseScreen,
  parameters: desktopScreenParameters,
  globals: viewportGlobals(),
  args: {
    entry: EMPTY_HORSE_ENTRY,
    hasAnalysisTarget: false,
    entrySidebarOpen: true,
    trainerData: null,
    surface: 'turf',
    onEntryChange: fn(),
    onSubmit: fn(),
    onClear: fn(),
    onSurfaceChange: fn(),
    onSlotOrderChange: fn(),
    onEntrySidebarOpenChange: fn(),
  },
} satisfies Meta<typeof HorseScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Initial: Story = {
  name: '初期',
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const ValidationError: Story = {
  name: 'バリデーションエラー',
  args: {
    entry: EMPTY_HORSE_ENTRY,
    entryErrors: HORSE_ENTRY_VALIDATION_ERRORS,
    hasAnalysisTarget: false,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const AnalysisShown: Story = {
  name: '分析表示（2×2）',
  args: {
    entry: FILLED_HORSE_ENTRY,
    hasAnalysisTarget: true,
    trainerData: MOCK_TRAINER_ANALYSIS,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const ReorderedSlots: Story = {
  name: '分析表示・配置入れ替え後',
  args: {
    entry: FILLED_HORSE_ENTRY,
    hasAnalysisTarget: true,
    trainerData: MOCK_TRAINER_ANALYSIS,
    initialSlotOrder: ['trainer', 'horse', 'pedigree', 'farm'],
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const SidebarCollapsed: Story = {
  name: '入力サイドバー折りたたみ',
  args: {
    entry: FILLED_HORSE_ENTRY,
    hasAnalysisTarget: true,
    trainerData: MOCK_TRAINER_ANALYSIS,
    entrySidebarOpen: false,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}
