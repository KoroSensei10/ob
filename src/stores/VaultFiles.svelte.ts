import type { TapeFileStore } from '$types/stores';
import { getContext, setContext } from 'svelte';

export function setVaultFilesContext(store: TapeFileStore) {
	setContext<TapeFileStore>('vaultFilesStore', store);
}

export function getVaultFilesContext(): TapeFileStore {
	return getContext<TapeFileStore>('vaultFilesStore');
}