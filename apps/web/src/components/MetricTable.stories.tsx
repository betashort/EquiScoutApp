import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot } from '../ui/classes'
import { MetricTable } from './MetricTable'

const meta = {
  title: 'Components/MetricTable',
  component: MetricTable,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[480px]`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MetricTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '成績指標',
    data: {
      columns: ['1着率', '2着内率', '3着内率'],
      rows: [
        { label: '全体', values: ['12.3%', '24.5%', '35.1%'] },
        { label: '芝', values: ['14.0%', '28.2%', '38.4%'] },
        { label: 'ダ', values: ['10.1%', '20.8%', '31.6%'] },
      ],
    },
  },
}
