<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Entry from './Entry.svelte';
    import { fn } from 'storybook/test';
    import { createRawSnippet } from 'svelte';

    const { Story } = defineMeta({
        title: 'Components/SideBar/Entry',
        component: Entry,
        tags: ['autodocs'],
        argTypes: {
            title: { control: 'text' },
        },
        args: {
            onclick: fn(),
            children: createRawSnippet(() => 
                ({render: () => 'Sidebar Entry'})
            ),
        }
    });
</script>

<Story name="Default" />