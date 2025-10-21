import type { FileEntry, FileTree } from '$types/files';

export type VaultFilesStore = () => {
    vaultEntries: FileTree[];
    vaultFiles: FileEntry[];
}