import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DESTINATION_CARDS } from '../domain/navigation'
import { eqRoot } from '../ui/classes'
import { NavCard } from './NavCard'

const meta = {
  title: 'Components/NavCard',
  component: NavCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} w-80 p-6`}>
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

export const AllDestinations: Story = {
  name: '全遷移カード',
  args: {
    id: 'horse',
    label: '募集馬を分析する',
    description: '入力→ダッシュボード（調教師・牧場・血統を共用）',
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} mx-auto max-w-3xl p-6`}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {DESTINATION_CARDS.map((item) => (
        <NavCard
          key={item.id}
          id={item.id}
          label={item.label}
          description={item.description}
          onSelect={fn()}
        />
      ))}
    </div>
  ),
}
