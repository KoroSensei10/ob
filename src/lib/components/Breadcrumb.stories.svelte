<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Breadcrumb from './Breadcrumb.svelte';
    import { openFilesStore } from '$stores/OpenFiles.svelte';

    const { Story } = defineMeta({
    	title: 'Components/Breadcrumb',
    	component: Breadcrumb,
    	tags: ['autodocs']
    });
</script>

<Story name="With Active File" play={() => {
	openFilesStore.openFiles = [
		{
			name: 'readme.md',
			type: 'file',
			path: 'home/user/project/readme.md',
			content: null,
			childs: null
		}
	];
	openFilesStore.activeFilePath = 'home/user/project/readme.md';
}}/>

<Story name="No Active File" play={() => {
	openFilesStore.openFiles = [];
	openFilesStore.activeFilePath = null;
}} />