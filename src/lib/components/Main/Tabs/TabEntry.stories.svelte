<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import TabEntry from './TabEntry.svelte';
    import { ActiveFileStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';

    const { Story } = defineMeta({
    	title: 'Components/Main/Tabs/TabEntry',
    	component: TabEntry,
    	tags: ['autodocs'],
    });
</script>

<script lang="ts">
    setOpenFilesContext(new ActiveFileStore());
</script>

<Story name="Default Tab Entry" args={{
	entry: { name: 'file1.txt', type: 'file', path: '/file1.txt', content: 'Content of file 1', childs: null },
	openFiles: [
		{ name: 'file1.txt', type: 'file', path: '/file1.txt', content: 'Content of file 1', childs: null },
		{ name: 'file2.txt', type: 'file', path: '/file2.txt', content: 'Content of file 2', childs: null },
	],
	activeFileStore: new ActiveFileStore(),
}} />