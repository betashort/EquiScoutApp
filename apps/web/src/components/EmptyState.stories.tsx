import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot } from '../ui/classes'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[360px]`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '調教師が未選択です',
    body: '名前で検索して候補から選ぶと、成績指標を表示します。',
  },
}
