import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { FARM_CANDIDATES } from '../domain/mocks'
import { ScreenShell } from '../storybook/ScreenShell'
import { FarmScreen } from './FarmScreen'

const meta = {
  title: 'Screens/Farm',
  component: FarmScreen,
  parameters: { layout: 'fullscreen' },
  args: {
    query: '',
    candidates: [],
    selectedId: null,
    selectedLabel: null,
    isSearching: false,
    onQueryChange: fn(),
    onSelect: fn(),
  },
} satisfies Meta<typeof FarmScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: '未選択',
  render: (args) => (
    <ScreenShell activeNavId="farm">
      <FarmScreen {...args} />
    </ScreenShell>
  ),
}

export const Selected: Story = {
  name: '選択・プレースホルダ',
  args: {
    query: 'ノーザン',
    candidates: FARM_CANDIDATES,
    selectedId: 'f1',
    selectedLabel: 'ノーザンファーム',
  },
  render: (args) => (
    <ScreenShell activeNavId="farm">
      <FarmScreen {...args} />
    </ScreenShell>
  ),
}
