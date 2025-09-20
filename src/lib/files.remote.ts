import z from "zod";
import path, { dirname, join } from "node:path";
import { command, form, query } from "$app/server";
import { error } from "@sveltejs/kit";
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { move } from "fs-extra/esm";
import { createFileTree } from "$lib";
import type { FileEntry, FileTree } from "$types/files";


const DATA_DIR = './data';


export const getVaultFiles = query(z.string(), async (vaultPath): Promise<FileTree[]> => {
    console.log(`Fetching files from vault: ${vaultPath}`);
    // Ensure data directory exists
    // TODO: handle custom vault inside data folder
    console.time('generate file tree');
    await mkdir(DATA_DIR, { recursive: true });
    const tree = await createFileTree(DATA_DIR);
    console.timeEnd('generate file tree');
    return tree
});

export const getFileContent = query(z.string(), async (filePath): Promise<string> => {
    // TODO: Validate request.fileName to prevent directory traversal attacks
    const file = await readFile(filePath, {
        encoding: 'utf-8',
    });
    return file;
});

export const createFile = form(async (data): Promise<FileEntry> => {
    const fileName = data.get('fileName');

    // Validation des données d'entrée
    if (!fileName || typeof fileName !== 'string') {
        throw error(400, 'fileName is required and must be a string');
    }

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

    // Créer le dossier data s'il n'existe pas
    await mkdir(dirname(filePath), { recursive: true });

    // Créer le fichier
    await writeFile(filePath, content, 'utf-8');

    return {
        name: saneFileName,
        path: filePath,
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
    
    await writeFile(path.join(DATA_DIR, filePath), content, 'utf-8');
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