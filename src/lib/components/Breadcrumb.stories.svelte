<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Breadcrumb from './Breadcrumb.svelte';

    const { Story } = defineMeta({
        title: 'Components/Breadcrumb',
        component: Breadcrumb,
        tags: ['autodocs'],
        argTypes: {
            activeFile: {
                control: 'object',
                description: 'The currently active file or folder.',
                table: {
                    type: { summary: 'FileEntry | null' },
                    defaultValue: { summary: 'null' },
                },
            },
        }
    });
</script>

<Story name="With Active File" args={{
    activeFile: {
        name: 'readme.md',
        type: 'file',
        path: 'home/user/project/readme.md',
        content: null,
        childs: null
    },
}} />

<Story name="No Active File" args={{
    activeFile: null,
}} />