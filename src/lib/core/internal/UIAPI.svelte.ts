import { SvelteMap } from 'svelte/reactivity';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { Plugin } from '$core/Plugin';
import type { Component } from 'svelte';
import type { TabEntry } from './stores/TabStore.svelte';

export type SideBarComponentProps = {
	coreAPI: CoreAPI;
	plugin: Plugin;
}

export type ViewComponentProps = {
	coreAPI: CoreAPI;
	plugin: Plugin;
	tab: TabEntry;
}

export class UIAPI {
	sideBarItems: SvelteMap<string, Component<SideBarComponentProps>> = new SvelteMap();
	viewItems: SvelteMap<string, Component<ViewComponentProps>> = new SvelteMap();
	constructor(private coreAPI: CoreAPI) {}

	registerSideBarComponent(id: string, comp: Component<SideBarComponentProps>) {
		this.sideBarItems.set(id, comp);
	}

	registerViewComponent(id: string, comp: Component<ViewComponentProps>) {
		this.viewItems.set(id, comp);
	}
}