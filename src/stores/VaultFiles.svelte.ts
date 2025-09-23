import { getContext, setContext } from "svelte";
import type { VaultFilesStore } from "$types/stores";

export function setVaultFilesContext(store: VaultFilesStore) {
    setContext<VaultFilesStore>('vaultFilesStore', store);
}

export function getVaultFilesContext(): VaultFilesStore {
    return getContext<VaultFilesStore>('vaultFilesStore');
}