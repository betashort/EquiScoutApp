import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  EMPTY_HORSE_ENTRY,
  FILLED_HORSE_ENTRY,
  MOCK_TRAINER_ANALYSIS,
} from '../domain/mocks'
import { eqRoot } from '../ui/classes'
import { AnalysisDashboardPanel } from './AnalysisDashboardPanel'

const meta = {
  title: 'Panels/AnalysisDashboard',
  component: AnalysisDashboardPanel,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} mx-auto max-w-5xl p-6`}>
        <Story />
      </div>
    ),
  ],
  args: {
    entry: EMPTY_HORSE_ENTRY,
    hasAnalysisTarget: false,
    trainerData: null,
    surface: 'turf',
    onSurfaceChange: fn(),
    onSlotOrderChange: fn(),
  },
} satisfies Meta<typeof AnalysisDashboardPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: '未分析',
  args: {
    hasAnalysisTarget: false,
    contextLabel: null,
  },
}

export const DefaultGrid: Story = {
  name: '2×2（既定配置）',
  args: {
    entry: FILLED_HORSE_ENTRY,
    hasAnalysisTarget: true,
    contextLabel: 'ディープインパクト × ウインドインハーヘア',
    trainerData: MOCK_TRAINER_ANALYSIS,
    farmName: FILLED_HORSE_ENTRY.farmName,
    sireName: FILLED_HORSE_ENTRY.sireName,
    damName: FILLED_HORSE_ENTRY.damName,
  },
}

export const Reordered: Story = {
  name: '2×2（入れ替え後）',
  args: {
    entry: FILLED_HORSE_ENTRY,
    hasAnalysisTarget: true,
    contextLabel: 'ディープインパクト × ウインドインハーヘア',
    trainerData: MOCK_TRAINER_ANALYSIS,
    farmName: FILLED_HORSE_ENTRY.farmName,
    sireName: FILLED_HORSE_ENTRY.sireName,
    damName: FILLED_HORSE_ENTRY.damName,
    initialSlotOrder: ['pedigree', 'farm', 'trainer', 'horse'],
  },
}
