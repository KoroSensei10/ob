import type { Options } from "$types/options";

const defaultOptions: Options = {
    autoSave: true,
    lineNumbers: true,
    theme: 'light',
    compactMode: false,
    unfoldTreeOnOpen: true,
};

function createOptionsStore() {
    let options: Options = $state(defaultOptions);

    return {
        get options() {
            return options;
        },
        init() {
            // override default options with saved options from the vault
            // then override options with saved options from localStorage
        },
        setOptions(newOptions: Partial<Options>) {
            options = { ...options, ...newOptions };
        }
    };
}

export const optionsStore = createOptionsStore();
