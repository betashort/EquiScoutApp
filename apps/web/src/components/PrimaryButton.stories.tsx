import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { eqRoot } from '../ui/classes'
import { PrimaryButton } from './PrimaryButton'

const meta = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6`}>
        <Story />
      </div>
    ),
  ],
  args: { onClick: fn() },
} satisfies Meta<typeof PrimaryButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'データを更新' },
}

export const Disabled: Story = {
  args: { label: 'データを更新', disabled: true },
}
