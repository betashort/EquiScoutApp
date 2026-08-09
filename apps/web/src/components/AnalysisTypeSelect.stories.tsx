import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { eqRoot } from '../ui/classes'
import { AnalysisTypeSelect } from './AnalysisTypeSelect'

const meta = {
  title: 'Components/AnalysisTypeSelect',
  component: AnalysisTypeSelect,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[280px]`}>
        <Story />
      </div>
    ),
  ],
  args: { onChange: fn() },
} satisfies Meta<typeof AnalysisTypeSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 'trainer',
  },
}
