import { ServicePlugin } from '../../../src/lib/core/Plugin';
import DailyNoteSideBar from '../../../src/lib/plugins/Services/DailyNote/DailyNoteSideBar.svelte';
import type { CoreAPI } from '../../../src/lib/core/CoreAPI.svelte';

/**
 * Daily Note service plugin
 * Provides daily note functionality
 */
class DailyNoteServicePlugin extends ServicePlugin {
	readonly id = 'daily-note-service';
	readonly name = 'Daily Note Service';

	async init(coreAPI: CoreAPI): Promise<void> {
		await super.init(coreAPI);
		coreAPI.ui.registerSideBarComponent('daily-note-service', DailyNoteSideBar);
	}
}

export default DailyNoteServicePlugin;
