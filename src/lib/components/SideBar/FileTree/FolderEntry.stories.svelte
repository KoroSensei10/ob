<script module lang="ts">
    import { onMount } from 'svelte';
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import FolderEntry from './FolderEntry.svelte';
    import { ActiveFileStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';
    import { getFoldStateContext, setFoldStateContext } from '$stores/FoldState.svelte';

    const { Story } = defineMeta({
    	title: 'Components/SideBar/FolderEntry',
    	component: FolderEntry,
    	tags: ['autodocs'],
    });
</script>
<script lang="ts">
    const openFiles = new ActiveFileStore();
    setOpenFilesContext(openFiles);
    setFoldStateContext();
    const foldState = getFoldStateContext();
    onMount(() => {
    	foldState.init();
    });
</script>

<Story name="Empty Folder" args={{
	entry: {
		name: 'emptyFolder',
		type: 'dir',
		path: '/path/to/emptyFolder',
		childs: []
	}
}} />

<Story name="Folder with Children" args={{
	entry: {
		name: 'docs',
		type: 'dir',
		path: '/path/to/docs',
		childs: [
			{
				name: 'file1.txt',
				type: 'file',
				path: '/path/to/docs/file1.txt',
				content: null,
				childs: null
			},
			{
				name: 'file2.md',
				type: 'file',
				path: '/path/to/docs/file2.md',
				content: '# Example Markdown',
				childs: null
			}
		]
	}
}} />

<Story name="Nested Folders" args={{
	entry: {
		name: 'projects',
		type: 'dir',
		path: '/path/to/projects',
		childs: [
			{
				name: 'project1',
				type: 'dir',
				path: '/path/to/projects/project1',
				childs: [
					{
						name: 'file1.txt',
						type: 'file',
						path: '/path/to/projects/project1/file1.txt',
						content: null,
						childs: null
					}
				]
			},
			{
				name: 'project2',
				type: 'dir',
				path: '/path/to/projects/project2',
				childs: [
					{
						name: 'file2.md',
						type: 'file',
						path: '/path/to/projects/project2/file2.md',
						content: '# Example Markdown',
						childs: null
					}
				]
			}
		]
	}
}} />
