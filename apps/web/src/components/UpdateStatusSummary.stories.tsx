import type { Meta, StoryObj } from '@storybook/react-vite'
import { UPDATE_STATUS_IDLE } from '../domain/updateStatus'
import { eqRoot } from '../ui/classes'
import { UpdateStatusSummary } from './UpdateStatusSummary'

const meta = {
  title: 'Components/UpdateStatusSummary',
  component: UpdateStatusSummary,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[280px]`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UpdateStatusSummary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { status: UPDATE_STATUS_IDLE },
}

export const Unknown: Story = {
  name: '未取得',
  args: {
    status: { lastUpdatedAt: null, phase: 'idle' },
  },
}
