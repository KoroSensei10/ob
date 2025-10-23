export type EntryModification = {
		type: 'moved' | 'renamed';
		oldPath: string;
		newPath: string;
};