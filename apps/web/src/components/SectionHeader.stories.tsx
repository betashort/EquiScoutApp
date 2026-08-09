import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot } from '../ui/classes'
import { SectionHeader } from './SectionHeader'

const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-[280px]`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SectionHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { title: 'データ更新' },
}
