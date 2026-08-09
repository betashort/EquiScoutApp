import type { Meta, StoryObj } from '@storybook/react-vite'
import { eqRoot, input } from '../ui/classes'
import { FormField } from './FormField'

const meta = {
  title: 'Components/FormField',
  component: FormField,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} p-6 w-80`}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: '調教師名',
    htmlFor: 'trainer-name',
    children: (
      <input
        id="trainer-name"
        type="text"
        className={input}
        placeholder="名前で検索"
      />
    ),
  },
}
