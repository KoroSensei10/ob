<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Tabs from './Tabs.svelte';
    import { openFilesStore } from '$stores/OpenFiles.svelte';

    const { Story } = defineMeta({
    	title: 'Components/Main/Tabs/Tabs',
    	component: Tabs,
    	tags: ['autodocs'],
    });
</script>
<script lang="ts">
</script>

<Story name="No Tabs" />

<Story name="Single Tab" args={{
}} play={() => {
	// Simulate opening a file
	openFilesStore.openFile({
		name: 'file1.txt',
		type: 'file',
		path: '/file1.txt',
		content: 'Content of file 1',
		childs: null
	});
}} />

<Story name="Multiple Tabs" />

<Story name="Multiple Tabs With Same Name" />