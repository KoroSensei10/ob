import { definePlugin } from '../../../core/PluginRegistry';
import LoggerSideBar from './LoggerSideBar.svelte';
import LoggerView from './LoggerView.svelte';


export default definePlugin({
	id: 'logger-service',
	kind: 'service',
	name: 'Logger Service',
	async init({coreAPI}) {
		coreAPI.ui.registerSideBarComponent('logger-service', LoggerSideBar);
		coreAPI.ui.registerViewComponent('logger-service', LoggerView);
	},
	hooks: {
		async onFileOpen(file) {
			console.log(`File opened: ${file.name}`);
		},
		async onFileSave(file) {
			console.log(`File saved: ${file.name}`);
		}
	}
});