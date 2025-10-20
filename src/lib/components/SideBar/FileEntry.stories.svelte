<script module lang="ts">
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import FileEntry from './FileEntry.svelte';
    import { ActiveFileStore, setOpenFilesContext } from '$stores/OpenFiles.svelte';

    const { Story } = defineMeta({
        title: 'Components/SideBar/FileEntry/File',
        component: FileEntry,
        tags: ['autodocs'],
        args: {
            entry: {
                name: 'example.txt',
                type: 'file',
                path: '/path/to/example.txt',
                content: null,
                childs: null
            }
        }
    });

    const {Story: Entry2 } = defineMeta({
        title: 'Components/SideBar/FileEntry/File2',
        component: FileEntry,
        tags: ['autodocs'],
        args: {
            entry: {
                name: 'file2.md',
                type: 'file',
                path: '/path/to/file2.md',
                content: "# Example Markdown",
                childs: null
            }
        }
    });
</script>
<script lang="ts">
    const openFiles = new ActiveFileStore()
    setOpenFilesContext(openFiles);
</script>

<Story name="File" />

<Entry2 name="File 2" />