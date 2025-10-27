import '../src/app.css';
import type { Preview } from '@storybook/sveltekit';

// * Wait for a Storybook fix for remote functions
// import { sb } from 'storybook/test';
// sb.mock(import('../src/lib/remotes/files.remote.ts'));

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;