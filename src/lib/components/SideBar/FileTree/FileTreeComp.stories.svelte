<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import FileTreeComp from './FileTreeComp.svelte';

    const { Story } = defineMeta({
    	title: 'Components/SideBar/FileTreeComp',
    	component: FileTreeComp,
    	tags: ['autodocs'],
    	args: {
    		handleDblClick: undefined,
    	},
    });
</script>


<Story name="File Tree" />
