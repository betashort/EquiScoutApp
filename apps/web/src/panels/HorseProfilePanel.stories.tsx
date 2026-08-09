import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  EMPTY_HORSE_ENTRY,
  FILLED_HORSE_ENTRY,
} from '../domain/mocks'
import { eqRoot, panel } from '../ui/classes'
import { HorseProfilePanel } from './HorseProfilePanel'

const meta = {
  title: 'Panels/HorseProfile',
  component: HorseProfilePanel,
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className={`${eqRoot} mx-auto max-w-3xl p-6`}>
        <div className={panel}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof HorseProfilePanel>

export default meta
type Story = StoryObj<typeof meta>

export const Filled: Story = {
  name: '入力あり',
  args: {
    values: FILLED_HORSE_ENTRY,
  },
}

export const Empty: Story = {
  name: '未入力（欠損表示）',
  args: {
    values: EMPTY_HORSE_ENTRY,
  },
}
