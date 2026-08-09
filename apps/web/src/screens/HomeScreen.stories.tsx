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
      <HomeScreen onDestinationSelect={fn()} />
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
    onDestinationSelect: fn(),
  },
} satisfies Meta<typeof HomeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Initial: Story = {
  name: '初期',
  render: () => <HomeInShell updateStatus={UPDATE_STATUS_IDLE} />,
}

/** 更新はシェルヘッダに一任。ホーム本文に更新パネルは置かない。 */
export const Updating: Story = {
  name: '更新中（ヘッダ）',
  render: () => <HomeInShell updateStatus={UPDATE_STATUS_RUNNING} />,
}

export const UpdateSuccess: Story = {
  name: '更新成功（ヘッダ）',
  render: () => <HomeInShell updateStatus={UPDATE_STATUS_SUCCESS} />,
}

export const UpdateFailure: Story = {
  name: '更新失敗（ヘッダ）',
  render: () => <HomeInShell updateStatus={UPDATE_STATUS_ERROR} />,
}
