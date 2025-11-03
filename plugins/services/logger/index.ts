import { ServicePlugin } from '../../../src/lib/core/Plugin';
import LoggerSideBar from '../../../src/lib/plugins/Services/Logger/LoggerSideBar.svelte';
import LoggerView from '../../../src/lib/plugins/Services/Logger/LoggerView.svelte';
import type { PluginHooks } from '../../../src/lib/core/HookManager';
import type { CoreAPI } from '../../../src/lib/core/CoreAPI.svelte';

/**
 * Logger service plugin
 * Provides logging functionality and UI components
 */
class LoggerServicePlugin extends ServicePlugin {
	readonly id = 'logger-service';
	readonly name = 'Logger Service';

	async init(coreAPI: CoreAPI): Promise<void> {
		await super.init(coreAPI);
		coreAPI.ui.registerViewComponent('logger-service', LoggerView);
		coreAPI.ui.registerSideBarComponent('logger-service', LoggerSideBar);
	}

	getHooks(): Partial<PluginHooks> {
		return {
			async onFileOpen(file) {
				console.log(`File opened: ${file.name}`);
			},
			async onFileSave(file) {
				console.log(`File saved: ${file.name}`);
			}
		};
	}
}

export default LoggerServicePlugin;
