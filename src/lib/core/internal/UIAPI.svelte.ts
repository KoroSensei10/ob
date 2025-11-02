import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginDefinition } from '$core/types';
import type { Component } from 'svelte';
import type { TabEntry } from './stores/TabStore.svelte';

export type SideBarComponentProps = {
	coreAPI: CoreAPI;
	plugin: PluginDefinition
}

export type ViewComponentProps = {
	coreAPI: CoreAPI;
	plugin: PluginDefinition;
	tab: TabEntry;
}

export class UIAPI {
	sideBarItems: Record<string, Component<SideBarComponentProps>> = $state({});
	viewItems: Record<string, Component<ViewComponentProps>> = $state({});
	constructor(private coreAPI: CoreAPI) {}

	registerSideBarComponent(id: string, comp: Component<SideBarComponentProps>) {
		this.sideBarItems[id] = comp;
	}

	registerViewComponent(id: string, comp: Component<ViewComponentProps>) {
		this.viewItems[id] = comp;
	}
}