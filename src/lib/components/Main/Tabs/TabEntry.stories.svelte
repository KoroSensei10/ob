<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import TabEntry from './TabEntry.svelte';
    import { coreAPI } from '$core/CoreAPI.svelte';

    const { Story } = defineMeta({
    	title: 'Components/Main/Tabs/TabEntry',
    	component: TabEntry,
    	tags: ['autodocs'],
    });
</script>
<script lang="ts">
	coreAPI.files.openFile({
		name: 'file1.txt',
		type: 'file',
		path: '/file1.txt',
		content: 'Content of file 1',
		childs: null
	});
</script>

<Story name="Default Tab Entry" args={{
	entry: { name: 'file1.txt', type: 'file', path: '/file1.txt', content: 'Content of file 1', childs: null },
}} />