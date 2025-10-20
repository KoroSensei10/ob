<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import FolderEntry from './FolderEntry.svelte';
    import { ActiveFileStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';
    import { setFoldStateContext } from '$stores/FoldState.svelte';

    const { Story } = defineMeta({
        title: 'Components/SideBar/FolderEntry',
        component: FolderEntry,
        tags: ['autodocs'],
        args: {
            entry: {
                name: 'exampleDir',
                type: 'dir',
                path: '/path/to/example',
                childs: [
                    {
                        name: 'child1.txt',
                        type: 'file',
                        path: '/path/to/example/child1.txt',
                        content: null,
                        childs: null
                    }
                ]
            }
        }
    });
</script>
<script lang="ts">
    const openFiles = new ActiveFileStore()
    setOpenFilesContext(openFiles);

    setFoldStateContext();
</script>

<Story name="Folder" />