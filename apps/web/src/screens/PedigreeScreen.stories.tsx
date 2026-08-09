import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { ScreenShell } from '../storybook/ScreenShell'
import {
  desktopScreenParameters,
  viewportGlobals,
} from '../storybook/viewports'
import { PedigreeScreen } from './PedigreeScreen'

const meta = {
  title: 'Screens/Pedigree',
  component: PedigreeScreen,
  parameters: desktopScreenParameters,
  globals: viewportGlobals(),
  args: {
    sireName: '',
    damName: '',
    onSireChange: fn(),
    onDamChange: fn(),
  },
} satisfies Meta<typeof PedigreeScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  name: '未入力',
  render: (args) => (
    <ScreenShell activeNavId="pedigree">
      <PedigreeScreen {...args} />
    </ScreenShell>
  ),
}

export const WithKeys: Story = {
  name: 'キー入力・プレースホルダ',
  args: {
    sireName: 'ディープインパクト',
    damName: 'ウインドインハーヘア',
  },
  render: (args) => (
    <ScreenShell activeNavId="pedigree">
      <PedigreeScreen {...args} />
    </ScreenShell>
  ),
}
