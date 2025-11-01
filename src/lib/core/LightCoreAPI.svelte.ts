import { type CoreAPI } from './CoreAPI.svelte';

class LightCoreAPI {
	readonly files: {
		getActiveFile: CoreAPI['files']['getActiveFile'];
		openFile: CoreAPI['files']['openFile'];
		getOpenFiles: CoreAPI['files']['getOpenFiles'];
		writeFileContent: CoreAPI['files']['writeFileContent'];
		closeFile: CoreAPI['files']['closeFile'];
	};

	constructor(coreAPI: CoreAPI) {
		this.files = {
			getActiveFile: coreAPI.files.getActiveFile,
			openFile: coreAPI.files.openFile,
			getOpenFiles: coreAPI.files.getOpenFiles,
			writeFileContent: coreAPI.files.writeFileContent,
			closeFile: coreAPI.files.closeFile
		};
	}
}

export { LightCoreAPI };