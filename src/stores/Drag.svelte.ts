class DragStore {
	draggedItem: any | null = $state(null)

	drag(item: any) {
		this.draggedItem = $state.snapshot(item);
	}

	drop(): any {
		return $state.snapshot(this.draggedItem);
	}
}

export const dragStore = new DragStore();