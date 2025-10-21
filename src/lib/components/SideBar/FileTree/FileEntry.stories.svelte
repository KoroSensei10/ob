<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import FileEntry from './FileEntry.svelte';
    import { ActiveFileStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';

    const { Story } = defineMeta({
    	title: 'Components/SideBar/FileEntry',
    	component: FileEntry,
    	tags: ['autodocs'],
    	argTypes: {
    		entry: {
    			control: 'object',
    			description: 'The file entry to display.',
    			table: {
    				type: { summary: 'FileEntry' },
    				defaultValue: { summary: '{}' },
    			},
    		},
    	}
    });
</script>
<script lang="ts">
    const openFiles = new ActiveFileStore();
    setOpenFilesContext(openFiles);
</script>

<Story name="File" args={{
	entry: {
		name: 'example.txt',
		type: 'file',
		path: '/path/to/example.txt',
		content: null,
		childs: null
	}
}} />

<Story name="File 2" args={{
	entry: {
		name: 'file2.md',
		type: 'file',
		path: '/path/to/file2.md',
		content: '# Example Markdown',
		childs: null
	}
}} />