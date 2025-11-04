<script lang="ts">
	import Breadcrumb from '$components/Breadcrumb.svelte';
	import Tabs from '$components/Main/Tabs/Tabs.svelte';
	import View from '$components/Main/View.svelte';
	import Bottom from '$components/SideBar/Bottom.svelte';
	import Header from '$components/SideBar/Header.svelte';
	import SideBar from '$components/SideBar/SideBar.svelte';
	import * as Resizable from '$components/ui/resizable';

	let paneSize: number = $state(25);
	let isCollapsed: boolean = $derived(paneSize <= 0);

	let sidebarPane: ReturnType<typeof Resizable.Pane>;
</script>

{#if isCollapsed}
	<button
		class="fixed top-2 text-sm shadow-lg left-0 z-50 bg-gray-700 text-white p-1 rounded-r
		hover:bg-gray-600 transition-opacity cursor-pointer"
		onclick={() => sidebarPane.expand()}
	>
		&#x25B6;
	</button>
{/if}

<Resizable.PaneGroup class="hidden md:block" direction="horizontal">
	<Resizable.Pane
		bind:this={sidebarPane}
		collapsible={true}
		collapsedSize={0}
		class="hidden md:block"
		minSize={20}
		maxSize={50}
		onResize={(size) => {
			paneSize = size;
		}}
	>
		<div class="hidden md:flex md:flex-col h-full">
			<!-- Desktop Only-->
			<SideBar className="h-full bg-gray-800">
				{#snippet header()}
					<div class="flex justify-between">
						<Header />
						<button
							class="text-sm text-white p-4
						hover:bg-gray-700 transition-opacity cursor-pointer"
							onclick={() => sidebarPane.collapse()}
						>
							&#x25C0;
						</button>
					</div>
				{/snippet}
				{#snippet bottom()}
					<Bottom />
				{/snippet}
			</SideBar>
		</div>
	</Resizable.Pane>
	<Resizable.Handle class="hidden md:block opacity-0" />
	<Resizable.Pane class="" defaultSize={75} minSize={50}>
		<div class="w-full h-full flex flex-col">
			<Tabs />
			<Breadcrumb />
			<View />
		</div>
	</Resizable.Pane>
</Resizable.PaneGroup>
