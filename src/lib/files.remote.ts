import z from "zod";
import { existsSync } from "node:fs";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { move } from "fs-extra/esm";
import path, { dirname, join } from "node:path";
import { command, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { createFileTree } from "$lib";
import { DATA_DIR } from "./consts";
import type { FileEntry, FileTree } from "$types/files";

export const getFileTree = query(async (): Promise<FileTree[]> => {
    return createFileTree(DATA_DIR);
});


export const getFileContent = query(z.string(), async (filePath): Promise<string> => {
    // TODO: Validate request.fileName to prevent directory traversal attacks
    const file = await readFile(filePath, {
        encoding: 'utf-8',
    });
    return file;
});

export const createFile = command(z.string(), async (fileName): Promise<FileEntry> => {
    // TODO: Valider request.fileName pour prévenir les attaques de directory traversal
    // Pour l'instant, on force le dossier ./data/
    // On remplace les caractères non autorisés dans le nom de fichier
    // TODO: On ajoute l'extension .md
    // TODO: split les / pour créé les dossiers automatiquement
    const filePathParts: string[] = fileName.split('/');
    const sanitizedParts = filePathParts.map((part) => part.replace(/[^a-zA-Z0-9._-]/g, '_').trim());
    const saneFileName = sanitizedParts.join('/');

    // On empêche les noms de fichiers vides ou avec uniquement des espaces
    if (fileName.trim() === '') {
        throw error(400, 'fileName cannot be empty or only spaces');
    }
    const filePath = join('./data/', saneFileName);

    // Contenu du fichier (vide par défaut ou contenu fourni)
    const content = '';

    if (existsSync(filePath)) {
        throw error(400, 'File already exists');
    }

    // Créer le dossier s'il n'existe pas
    await mkdir(dirname(filePath), { recursive: true });
    // Créer le fichier
    await writeFile(filePath, content, 'utf-8');

    return {
        name: sanitizedParts.pop() || 'new_file',
        path: saneFileName,
        type: 'file',
        content: content,
        childs: null
    };
});

export const writeFileContent = command(z.object({
    filePath: z.string(),
    content: z.string()
}), async ({ filePath, content }) => {
    // Créer le dossier parent s'il n'existe pas
    // ? pas sûre
    // await mkdir(dirname(filePath), { recursive: true });

    console.log(`Writing content to ${path.join(DATA_DIR, filePath)}`);
    await writeFile(path.join(DATA_DIR, filePath), content.trim(), 'utf-8');
})

export const moveFile = command(z.object({
    entryPath: z.string(),
    destFolder: z.string()
}), async ({ entryPath, destFolder }) => {
    const entryName = path.basename(entryPath);

    if (entryPath === destFolder) {
        return;
    }

    const oldPath = path.resolve(DATA_DIR, entryPath);
    const newPath = path.resolve(DATA_DIR, destFolder, entryName);

    // Validate paths are within DATA_DIR
    const dataDir = path.resolve(DATA_DIR);
    if (!oldPath.startsWith(dataDir) || !newPath.startsWith(dataDir)) {
        throw error(400, 'Invalid path');
    }

    if (oldPath === newPath) {
        return;
    }

    console.log(`Moving entry from ${oldPath} to ${newPath}`);
    await move(oldPath, newPath);
});

export const renameFile = command(z.object({
    entryPath: z.string(),
    newName: z.string(),
    destFolder: z.string().optional()
}), async ({ entryPath, newName, destFolder }) => {
    const sanitizedName = newName.replace(/[^a-zA-Z0-9._-]/g, '_').trim();

    if (!sanitizedName) {
        throw error(400, 'New name cannot be empty');
    }

    const oldPath = path.resolve(DATA_DIR, entryPath);
    const targetFolder = destFolder || path.dirname(entryPath);
    const newPath = path.resolve(DATA_DIR, targetFolder, sanitizedName);

    // Validate paths are within DATA_DIR
    const dataDir = path.resolve(DATA_DIR);
    if (!oldPath.startsWith(dataDir) || !newPath.startsWith(dataDir)) {
        throw error(400, 'Invalid path');
    }

    if (oldPath === newPath) {
        return;
    }

    console.log(`Renaming entry from ${oldPath} to ${newPath}`);
    await move(oldPath, newPath);
});