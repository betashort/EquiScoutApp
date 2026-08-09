import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  UPDATE_STATUS_ERROR,
  UPDATE_STATUS_IDLE,
  UPDATE_STATUS_RUNNING,
  UPDATE_STATUS_SUCCESS,
  type UpdateStatusViewModel,
} from '../domain/updateStatus'
import { AppShell } from '../shell/AppShell'
import { HomeScreen } from './HomeScreen'

function HomeInShell({
  updateStatus,
}: {
  updateStatus: UpdateStatusViewModel
}) {
  return (
    <AppShell
      activeNavId="home"
      updateStatus={updateStatus}
      onNavSelect={fn()}
      onUpdateClick={fn()}
    >
      <HomeScreen
        updateStatus={updateStatus}
        onDestinationSelect={fn()}
        onUpdateClick={fn()}
        onRetry={fn()}
      />
    </AppShell>
  )
}

const meta = {
  title: 'Screens/Home',
  component: HomeScreen,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    updateStatus: UPDATE_STATUS_IDLE,
    onDestinationSelect: fn(),
    onUpdateClick: fn(),
    onRetry: fn(),
  },
} satisfies Meta<typeof HomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Initial: Story = {
  name: '初期',
  args: { updateStatus: UPDATE_STATUS_IDLE },
  render: (args) => <HomeInShell updateStatus={args.updateStatus} />,
}

export const Updating: Story = {
  name: '更新中',
  args: { updateStatus: UPDATE_STATUS_RUNNING },
  render: (args) => <HomeInShell updateStatus={args.updateStatus} />,
}

export const UpdateSuccess: Story = {
  name: '更新成功',
  args: { updateStatus: UPDATE_STATUS_SUCCESS },
  render: (args) => <HomeInShell updateStatus={args.updateStatus} />,
}

export const UpdateFailure: Story = {
  name: '更新失敗',
  args: { updateStatus: UPDATE_STATUS_ERROR },
  render: (args) => <HomeInShell updateStatus={args.updateStatus} />,
}
