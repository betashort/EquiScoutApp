import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot } from '../ui/classes'
import { PlaceholderPanel } from './PlaceholderPanel'

const meta = {
  title: 'Components/PlaceholderPanel',
  component: PlaceholderPanel,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[360px]`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PlaceholderPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '距離別成績',
    body: '調教師を選ぶと、芝・ダート別の距離帯ごとの成績を表示します。',
  },
}
