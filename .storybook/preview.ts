import '../src/app.css';
import type { Preview } from '@storybook/sveltekit';

// * Wait for a fix
// import { sb } from 'storybook/test';
// sb.mock(import('../src/lib/remotes/files.remote.ts'), {spy: true});

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