import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true
		},
		alias: {
			$components: 'src/components',
			$stores: 'src/stores',
			$types: 'src/types',
			$utils: 'src/utils',
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	},
};

export default config;
