import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { eqRoot } from '../ui/classes'
import { ErrorBanner } from './ErrorBanner'

const meta = {
  title: 'Components/ErrorBanner',
  component: ErrorBanner,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[420px]`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'データ更新に失敗しました。接続設定を確認して再試行してください。',
    onRetry: fn(),
  },
}
