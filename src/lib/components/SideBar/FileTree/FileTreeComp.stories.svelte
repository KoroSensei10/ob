<script module lang="ts">
    import { setFoldStateContext } from '$stores/FoldState.svelte';
    import { OpenFilesStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';
    import { setVaultFilesContext } from '$stores/VaultFiles.svelte';
    import type { TapeFileStore } from '$types/stores';
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

<script>
    const vaultFiles: TapeFileStore = () => {
    	return {
    		tapeEntries: [
    			{
    				name: 'docs',
    				type: 'dir',
    				path: '/docs',
    				childs: [
    					{
    						name: 'readme.md',
    						type: 'file',
    						path: '/docs/readme.md',
    						content: '# Welcome to the docs',
    						childs: null,
    					},
    				],
    			},
    			{
    				name: 'todo.txt',
    				type: 'file',
    				path: '/todo.txt',
    				content: ' - [ ] Buy groceries\n - [ ] Walk the dog',
    				childs: null,
    			},
    		],
    		tapeFiles: [
    			{
    				name: 'docs/readme.md',
    				type: 'file',
    				path: '/docs/readme.md',
    				content: '# Welcome to the docs',
    				childs: null,
    			},
    			{
    				name: 'todo.txt',
    				type: 'file',
    				path: '/todo.txt',
    				content: ' - [ ] Buy groceries\n - [ ] Walk the dog',
    				childs: null,
    			},
    		],
    	};
    };
    setVaultFilesContext(vaultFiles);

    setFoldStateContext();

    setOpenFilesContext(new OpenFilesStore());
</script>

<Story name="File Tree" />
