import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { FileEntry } from '$types/files';
import type { Component } from 'svelte';
import type { ViewComponentProps } from '../UIAPI.svelte';

export type TabKind = 'file' | 'plugin';

interface BaseTabEntry {
  id: string; // unique
  kind: TabKind;
  title: string;
}

export type TabEntry =
	| (BaseTabEntry & {
		kind: 'file';
		file: FileEntry;
	})
	| (BaseTabEntry & {
		kind: 'plugin';
		component: Component<ViewComponentProps>;
	})


export class TabStore {
	tabs: TabEntry[] = $state([]);
	activeTabId: string | null = $state(null);
	activeTab: TabEntry | null = $derived.by(() => {
		if (this.activeTabId) {
			return this.tabs.find(t => t.id === this.activeTabId) || null;
		}
		return null;
	});
	
	constructor(private core: CoreAPI) {}

	async openTab(tab: TabEntry) {
		if (!this.tabs.find(t => t.id === tab.id)) {
			this.tabs.push(tab);
		}
		this.activeTabId = tab.id;
	}
	async closeTab(tabId: string) {
		const afterTabs = this.tabs.filter(t => t.id !== tabId);
		if (this.activeTabId === tabId) {
			const newActiveTab = afterTabs.length > 0 ? afterTabs[0] : null;
			if (newActiveTab) {
				this.core.activateTab(newActiveTab.id);
			}
		}
		this.tabs = afterTabs;
	}
}