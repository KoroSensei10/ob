<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Header from './Header.svelte';

    const tapeName = 'Demo Tape';

    const { Story } = defineMeta({
    	title: 'Components/Header',
    	component: Header,
    	tags: ['autodocs'],
    });
</script>

<Story name="Default Header" parameters={{
	// https://storybook.js.org/docs/get-started/frameworks/sveltekit#how-to-mock
	sveltekit_experimental: {
		state: {
			page: {
				params: {
					tape: tapeName
				}
			}
		}
	}
}} />