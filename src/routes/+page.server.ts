import * as fs from 'node:fs';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ _locals }) => {
    const files = fs.readdirSync('./data/', {
        withFileTypes: true,
        recursive: true
    });

    return {
        files: files.map((file) => ({
            name: file.name,
            isFile: file.isFile(),
            isDirectory: file.isDirectory(),
            parentPath: file.parentPath,
            extension: file.isFile() ? file.name.split('.').pop() ?? '' : ''
        }))
    }
};