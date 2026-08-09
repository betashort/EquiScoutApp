import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  EMPTY_HORSE_ENTRY,
  FILLED_HORSE_ENTRY,
  HORSE_ENTRY_VALIDATION_ERRORS,
  MOCK_TRAINER_ANALYSIS,
} from '../domain/mocks'
import { ScreenShell } from '../storybook/ScreenShell'
import { HorseScreen } from './HorseScreen'

const meta = {
  title: 'Screens/Horse',
  component: HorseScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    entry: EMPTY_HORSE_ENTRY,
    moduleId: 'trainer',
    hasAnalysisTarget: false,
    trainerData: null,
    surface: 'turf',
    onEntryChange: fn(),
    onSubmit: fn(),
    onClear: fn(),
    onModuleChange: fn(),
    onSurfaceChange: fn(),
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

export const TrainerModule: Story = {
  name: '分析表示・調教師',
  args: {
    entry: FILLED_HORSE_ENTRY,
    moduleId: 'trainer',
    hasAnalysisTarget: true,
    trainerData: MOCK_TRAINER_ANALYSIS,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const FarmModule: Story = {
  name: '分析表示・生産牧場',
  args: {
    entry: FILLED_HORSE_ENTRY,
    moduleId: 'farm',
    hasAnalysisTarget: true,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const PedigreeModule: Story = {
  name: '分析表示・血統',
  args: {
    entry: FILLED_HORSE_ENTRY,
    moduleId: 'pedigree',
    hasAnalysisTarget: true,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}

export const SimilarityModule: Story = {
  name: '分析表示・類似馬',
  args: {
    entry: FILLED_HORSE_ENTRY,
    moduleId: 'similarity',
    hasAnalysisTarget: true,
  },
  render: (args) => (
    <ScreenShell activeNavId="horse">
      <HorseScreen {...args} />
    </ScreenShell>
  ),
}
