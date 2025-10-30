<script lang="ts" module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import Breadcrumb from './Breadcrumb.svelte';
    import { coreAPI } from '$core/CoreAPI.svelte';

    const { Story } = defineMeta({
    	title: 'Components/Breadcrumb',
    	component: Breadcrumb,
    	tags: ['autodocs']
    });
</script>

<Story name="With Active File" play={() => {
	coreAPI.files.openFile({
		name: 'readme.md',
		type: 'file',
		path: 'home/user/project/readme.md',
		content: 'Content of readme.md',
		childs: null
	});
}}/>

<Story name="No Active File" play={() => {
	coreAPI.files.closeFile({ path: 'home/user/project/readme.md' });
}} />

<Story name="No Active File" play={() => {
	coreAPI.files.closeFile({ path: 'home/user/project/readme.md' });
}} />