import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  MOCK_TRAINER_ANALYSIS,
  TRAINER_CANDIDATES,
} from '../domain/mocks'
import { ScreenShell } from '../storybook/ScreenShell'
import { TrainerScreen } from './TrainerScreen'

const meta = {
  title: 'Screens/Trainer',
  component: TrainerScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    query: '',
    candidates: [],
    selectedId: null,
    isSearching: false,
    analysisStatus: 'empty',
    analysisData: null,
    surface: 'turf',
    onQueryChange: fn(),
    onSelect: fn(),
    onSurfaceChange: fn(),
    onRetry: fn(),
  },
} satisfies Meta<typeof TrainerScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: '未選択',
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}

export const Searching: Story = {
  name: '検索中',
  args: {
    query: '藤',
    isSearching: true,
    analysisStatus: 'empty',
  },
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}

export const Candidates: Story = {
  name: '候補あり・未選択分析',
  args: {
    query: '藤',
    candidates: TRAINER_CANDIDATES,
    analysisStatus: 'empty',
  },
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}

export const Loading: Story = {
  name: '読込中',
  args: {
    query: '藤沢',
    candidates: TRAINER_CANDIDATES,
    selectedId: 't1',
    analysisStatus: 'loading',
  },
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}

export const Success: Story = {
  name: '成功',
  args: {
    query: '藤沢',
    candidates: TRAINER_CANDIDATES,
    selectedId: 't1',
    analysisStatus: 'success',
    analysisData: MOCK_TRAINER_ANALYSIS,
  },
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}

export const NoGradedWins: Story = {
  name: '重賞0件',
  args: {
    query: '藤沢',
    candidates: TRAINER_CANDIDATES,
    selectedId: 't1',
    analysisStatus: 'success',
    analysisData: {
      ...MOCK_TRAINER_ANALYSIS,
      gradedWins: [],
    },
  },
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}

export const ErrorState: Story = {
  name: 'エラー',
  args: {
    query: '藤沢',
    candidates: TRAINER_CANDIDATES,
    selectedId: 't1',
    analysisStatus: 'error',
    analysisError: '分析結果の読取に失敗しました。再試行してください。',
  },
  render: (args) => (
    <ScreenShell activeNavId="trainer">
      <TrainerScreen {...args} />
    </ScreenShell>
  ),
}
