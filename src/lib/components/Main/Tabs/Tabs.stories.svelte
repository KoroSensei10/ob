<script lang="ts" module>
    import { OpenFilesStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Tabs from './Tabs.svelte';

    const { Story } = defineMeta({
    	title: 'Components/Main/Tabs/Tabs',
    	component: Tabs,
    	tags: ['autodocs'],
    });
</script>
<script lang="ts">
    setOpenFilesContext(new OpenFilesStore());
</script>

<Story name="No Tabs" args={{
	openFiles: []
}} />

<Story name="Single Tab" args={{
	openFiles: [
		{ name: 'file1.txt', type: 'file', path: '/file1.txt', content: 'Content of file 1', childs: null }
	]
}} />

<Story name="Multiple Tabs" args={{
	openFiles: [
		{ name: 'file1.txt', type: 'file', path: '/file1.txt', content: 'Content of file 1', childs: null },
		{ name: 'file2.txt', type: 'file', path: '/file2.txt', content: 'Content of file 2', childs: null },
		{ name: 'notes.md', type: 'file', path: '/notes.md', content: '# Notes', childs: null },
	]
}} />

<Story name="Multiple Tabs With Same Name" args={{
	openFiles: [
		{ name: 'file1.txt', type: 'file', path: '/file1.txt', content: 'Content of file 1', childs: null },
		{ name: 'file2.txt', type: 'file', path: '/file2.txt', content: 'Content of file 2', childs: null },
		{ name: 'file1.txt', type: 'file', path: '/docs/file1.txt', content: 'Content of another file 1', childs: null },
	]
}} />