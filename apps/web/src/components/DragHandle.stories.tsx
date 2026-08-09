import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot } from '../ui/classes'
import { DragHandle } from './DragHandle'

const meta = {
  title: 'Components/DragHandle',
  component: DragHandle,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DragHandle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '募集馬',
  },
}
