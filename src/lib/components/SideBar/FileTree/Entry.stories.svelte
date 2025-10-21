<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { fn } from 'storybook/test';
    import Entry from './Entry.svelte';

    const { Story } = defineMeta({
    	title: 'Components/SideBar/Entry',
    	component: Entry,
    	tags: ['autodocs'],
    	argTypes: {
    		title: { control: 'text' },
    	},
    	args: {
    		onclick: fn(),
    	},
    });
</script>

<Story name="File Entry">Bijour !</Story>
