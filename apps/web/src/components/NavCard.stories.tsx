import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { eqRoot } from '../ui/classes'
import { NavCard } from './NavCard'

const meta = {
  title: 'Components/NavCard',
  component: NavCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-80`}>
        <Story />
      </div>
    ),
  ],
  args: { onSelect: fn() },
} satisfies Meta<typeof NavCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'trainer',
    label: '調教師を調べる',
    description: '本線・実データ',
  },
}
