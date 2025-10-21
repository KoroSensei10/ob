<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FileTreeComp from "./FileTreeComp.svelte";
    import { setVaultFilesContext } from "$stores/VaultFiles.svelte";
    import { setFoldStateContext } from "$stores/FoldState.svelte";
    import { ActiveFileStore, setOpenFilesContext } from "$stores/OpenFiles.svelte";
    import type { VaultFilesStore } from "$types/stores";

    const { Story } = defineMeta({
        title: "Components/SideBar/FileTreeComp",
        component: FileTreeComp,
        tags: ["autodocs"],
        args: {
            handleDblClick: undefined,
        },
    });
</script>

<script>
    const vaultFiles: VaultFilesStore = () => {
        return {
            vaultEntries: [
                {
                    name: "docs",
                    type: "dir",
                    path: "/docs",
                    childs: [
                        {
                            name: "readme.md",
                            type: "file",
                            path: "/docs/readme.md",
                            content: "# Welcome to the docs",
                            childs: null,
                        },
                    ],
                },
                {
                    name: "todo.txt",
                    type: "file",
                    path: "/todo.txt",
                    content: " - [ ] Buy groceries\n - [ ] Walk the dog",
                    childs: null,
                },
            ],
            vaultFiles: [
                {
                    name: "docs/readme.md",
                    type: "file",
                    path: "/docs/readme.md",
                    content: "# Welcome to the docs",
                    childs: null,
                },
                {
                    name: "todo.txt",
                    type: "file",
                    path: "/todo.txt",
                    content: " - [ ] Buy groceries\n - [ ] Walk the dog",
                    childs: null,
                },
            ],
        };
    };
    setVaultFilesContext(vaultFiles);

    setFoldStateContext();

    setOpenFilesContext(new ActiveFileStore());
</script>

<Story name="File Tree" />
