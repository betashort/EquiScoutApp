import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { UPDATE_STATUS_IDLE } from '../domain/updateStatus'
import { HomeScreen } from '../screens/HomeScreen'
import {
  desktopScreenParameters,
  viewportGlobals,
} from '../storybook/viewports'
import { AppShell } from './AppShell'

const meta = {
  title: 'Screens/AppShell',
  component: AppShell,
  parameters: desktopScreenParameters,
  globals: viewportGlobals(),
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

/** 起動時: MainContent=ホーム、ナビ先頭=ホーム（初期ウィンドウ 1280×800） */
export const Default: Story = {
  name: '初期 1280×800',
  globals: viewportGlobals('equiscoutDefault'),
  render: (args) => (
    <AppShell {...args}>
      <HomeScreen onDestinationSelect={fn()} />
    </AppShell>
  ),
}

/** 代替ウィンドウサイズ（shell.md） */
export const AltWindow: Story = {
  name: '代替 1366×768',
  globals: viewportGlobals('equiscoutAlt'),
  render: (args) => (
    <AppShell {...args}>
      <HomeScreen onDestinationSelect={fn()} />
    </AppShell>
  ),
}

/** 最小ウィンドウサイズ（shell.md） */
export const MinWindow: Story = {
  name: '最小 1100×700',
  globals: viewportGlobals('equiscoutMin'),
  render: (args) => (
    <AppShell {...args}>
      <HomeScreen onDestinationSelect={fn()} />
    </AppShell>
  ),
}
