import { SvelteMap } from 'svelte/reactivity';
import type { CoreAPI } from '$core/CoreAPI.svelte';
import type { PluginDefinition } from '$core/types';

/**
 * ThemeAPI manages theme plugins and applies them to the application
 */
export class ThemeAPI {
	themes: SvelteMap<string, PluginDefinition> = new SvelteMap();
	#activeThemeId: string | null = $state(null);
	#styleElement: HTMLStyleElement | null = null;

	constructor(private coreAPI: CoreAPI) {}

	/**
	 * Register a theme plugin
	 */
	registerTheme(theme: PluginDefinition): void {
		if (theme.kind !== 'theme') {
			throw new Error('Only theme plugins can be registered with ThemeAPI');
		}
		this.themes.set(theme.id, theme);
	}

	/**
	 * Apply a theme by its ID
	 */
	applyTheme(themeId: string): void {
		const theme = this.themes.get(themeId);
		if (!theme || theme.kind !== 'theme') {
			console.warn(`Theme with id '${themeId}' not found`);
			return;
		}

		// Remove existing theme style element
		if (this.#styleElement) {
			this.#styleElement.remove();
		}

		// Create new style element with theme CSS
		this.#styleElement = document.createElement('style');
		this.#styleElement.setAttribute('data-theme-id', themeId);
		this.#styleElement.textContent = theme.theme.styles;
		document.head.appendChild(this.#styleElement);

		// Apply dark class if needed
		if (theme.theme.isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		this.#activeThemeId = themeId;
	}

	/**
	 * Get the currently active theme ID
	 */
	get activeThemeId(): string | null {
		return this.#activeThemeId;
	}

	/**
	 * Get all registered themes
	 */
	getAllThemes(): PluginDefinition[] {
		return Array.from(this.themes.values());
	}
}
