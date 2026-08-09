import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { eqRoot } from '../ui/classes'
import { SecondaryButton } from './SecondaryButton'

const meta = {
  title: 'Components/SecondaryButton',
  component: SecondaryButton,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6`}>
        <Story />
      </div>
    ),
  ],
  args: { onClick: fn() },
} satisfies Meta<typeof SecondaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: '更新', compact: true },
}
