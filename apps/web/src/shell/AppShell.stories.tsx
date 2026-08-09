import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { UPDATE_STATUS_IDLE } from '../domain/updateStatus'
import { HomeScreen } from '../screens/HomeScreen'
import { AppShell } from './AppShell'

const meta = {
  title: 'Screens/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    activeNavId: 'home',
    updateStatus: UPDATE_STATUS_IDLE,
    onNavSelect: fn(),
    onUpdateClick: fn(),
    children: null,
  },
} satisfies Meta<typeof AppShell>

export default meta
type Story = StoryObj<typeof meta>

/** 起動時: MainContent=ホーム、ナビ先頭=ホーム */
export const Default: Story = {
  render: (args) => (
    <AppShell {...args}>
      <HomeScreen
        updateStatus={args.updateStatus}
        onUpdateClick={args.onUpdateClick}
      />
    </AppShell>
  ),
}
