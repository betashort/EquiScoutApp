import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot } from '../ui/classes'
import { LoadingBlock } from './LoadingBlock'

const meta = {
  title: 'Components/LoadingBlock',
  component: LoadingBlock,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-80`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoadingBlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'データを更新しています…' },
}
