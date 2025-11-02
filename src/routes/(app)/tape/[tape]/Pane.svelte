<script>
		import Breadcrumb from '$components/Breadcrumb.svelte';
    import Tabs from '$components/Main/Tabs/Tabs.svelte';
    import View from '$components/Main/View.svelte';
    import Bottom from '$components/SideBar/Bottom.svelte';
    import Header from '$components/SideBar/Header.svelte';
    import SideBar from '$components/SideBar/SideBar.svelte';
    import * as Resizable from '$components/ui/resizable';
</script>

<Resizable.PaneGroup class="hidden md:block" direction="horizontal">
	<Resizable.Pane
		collapsible={true}
		collapsedSize={0}
		class="hidden md:block"
		minSize={20}
		maxSize={50}
		defaultSize={25}
	>
		<div class="hidden md:flex md:flex-col h-full">
			<!-- Desktop Only-->
			<SideBar className="h-full bg-gray-800">
				{#snippet header()}
					<Header />
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
