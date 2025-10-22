import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

class FoldState {
	private foldStates: SvelteMap<string, boolean> = new SvelteMap<string, boolean>();

	init() {
		const folderState = JSON.parse(window.localStorage.getItem('folderState') || '{}');
		for (const [key, value] of Object.entries(folderState)) {
			this.foldStates.set(key, Boolean(value));
		}
	}

	isFolded(path: string): boolean {
		return this.foldStates.get(path) ?? false;
	}

	toggleFold(path: string): void {
		const currentState = this.foldStates.get(path) ?? false;
		this.setFoldState(path, !currentState);
	}

	setFoldState(path: string, state: boolean): void {
		this.foldStates.set(path, state);
		const folderState = JSON.parse(window.localStorage.getItem('folderState') || '{}');
		folderState[path] = state;
		window.localStorage.setItem('folderState', JSON.stringify(folderState));
	}

	clear(): void {
		this.foldStates.clear();
	}
}

const sym = Symbol('foldState');
export function setFoldStateContext() {
	const foldStates = new FoldState();
	setContext(sym, foldStates);
}

export function getFoldStateContext(): FoldState {
	const foldStates = getContext(sym);
	if (!foldStates) {
		throw new Error('FoldState context not found');
	}
	return foldStates as FoldState;
}