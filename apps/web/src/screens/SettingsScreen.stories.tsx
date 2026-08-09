import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  MOCK_CONNECTION,
  UPDATE_RESULT_ERROR,
  UPDATE_RESULT_IDLE,
  UPDATE_RESULT_SUCCESS,
} from '../domain/mocks'
import {
  UPDATE_STATUS_ERROR,
  UPDATE_STATUS_IDLE,
  UPDATE_STATUS_RUNNING,
  UPDATE_STATUS_SUCCESS,
} from '../domain/updateStatus'
import { ScreenShell } from '../storybook/ScreenShell'
import {
  desktopScreenParameters,
  viewportGlobals,
} from '../storybook/viewports'
import { SettingsScreen } from './SettingsScreen'

const meta = {
  title: 'Screens/Settings',
  component: SettingsScreen,
  parameters: desktopScreenParameters,
  globals: viewportGlobals(),
  args: {
    updateStatus: UPDATE_STATUS_IDLE,
    result: UPDATE_RESULT_IDLE,
    connection: MOCK_CONNECTION,
    onUpdateClick: fn(),
    onRetry: fn(),
    onConnectionChange: fn(),
  },
} satisfies Meta<typeof SettingsScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Idle: Story = {
  name: '初期',
  render: (args) => (
    <ScreenShell activeNavId="settings" updateStatus={args.updateStatus}>
      <SettingsScreen {...args} />
    </ScreenShell>
  ),
}

export const Running: Story = {
  name: '更新中',
  args: {
    updateStatus: UPDATE_STATUS_RUNNING,
    result: UPDATE_RESULT_IDLE,
  },
  render: (args) => (
    <ScreenShell activeNavId="settings" updateStatus={args.updateStatus}>
      <SettingsScreen {...args} />
    </ScreenShell>
  ),
}

export const Success: Story = {
  name: '更新成功',
  args: {
    updateStatus: UPDATE_STATUS_SUCCESS,
    result: UPDATE_RESULT_SUCCESS,
  },
  render: (args) => (
    <ScreenShell activeNavId="settings" updateStatus={args.updateStatus}>
      <SettingsScreen {...args} />
    </ScreenShell>
  ),
}

export const Failure: Story = {
  name: '更新失敗',
  args: {
    updateStatus: UPDATE_STATUS_ERROR,
    result: UPDATE_RESULT_ERROR,
  },
  render: (args) => (
    <ScreenShell activeNavId="settings" updateStatus={args.updateStatus}>
      <SettingsScreen {...args} />
    </ScreenShell>
  ),
}
