import type { Preview } from '@storybook/react-vite'
import '../src/styles/equiscout.css'
import {
  DEFAULT_VIEWPORT_ID,
  EQUISCOUT_VIEWPORTS,
  viewportGlobals,
} from '../src/storybook/viewports'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    backgrounds: {
      options: {
        light: { name: 'light', value: '#f2f4f7' },
        dark: { name: 'dark', value: '#1a1f2a' },
      },
    },
    viewport: {
      options: EQUISCOUT_VIEWPORTS,
    },
  },
  initialGlobals: {
    backgrounds: { value: 'light' },
    ...viewportGlobals(DEFAULT_VIEWPORT_ID),
  },
}

export default preview
