import z from 'zod';
import { existsSync } from 'node:fs';
import { writeFile, mkdir, readFile, rm, lstat } from 'node:fs/promises';
import { move } from 'fs-extra/esm';
import path, { dirname, join } from 'node:path';
import { command, form, getRequestEvent, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { createFileTree } from '$lib';
import { NOTE_DIR } from '../../server/consts';
import type { FileEntry, FileTree } from '$types/files';
import type { EntryModification } from '$types/modification';

export const getFileTree = query(async (): Promise<FileTree[]> => {
	const { params } = getRequestEvent();
	const tape = params.tape;
	if (!tape) {
		throw error(400, 'Tape parameter is missing');
	}

	try {
		// todo: validate tape to prevent directory traversal attacks
		const tree = await createFileTree(join(NOTE_DIR, tape));
		return tree;
	} catch (err) {
		if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
			throw error(404, 'Tape not found');
		}
		throw error(500, 'Failed to get file tree');
	}
});

export const getCurrentTape = query(async (): Promise<string> => {
	const { params } = getRequestEvent();
	const tape = params.tape;
	if (!tape) {
		throw error(400, 'Tape parameter is missing');
	}
	return tape;
});


export const getFileContent = query(z.string(), async (filePath): Promise<string> => {
	// TODO: Validate request.fileName to prevent directory traversal attacks
	const path = join(NOTE_DIR, await getCurrentTape(), filePath);
	const file = await readFile(path, {
		encoding: 'utf-8',
	});
	return file;
});

export const createFile = form(z.object({
	fileName: z.string()
}), async ( {fileName}, invalid): Promise<FileEntry> => {
	// TODO: Valider request.fileName pour prévenir les attaques de directory traversal
	const filePathParts: string[] = fileName.split('/');
	// On remplace les caractères non autorisés dans le nom de fichier
	const sanitizedParts = filePathParts.map((part) => part.replace(/[^a-zA-Z0-9._-]/g, '_').trim());
	const saneFilePath = sanitizedParts.join('/');
	const newFilename = sanitizedParts.pop();

	if (!newFilename) {
		return invalid(invalid.fileName(`Invalid file name: ${fileName}`));
	}

	if (fileName.trim() === '') {
		return invalid(invalid.fileName('File name cannot be empty'));
	}

	const {params} = getRequestEvent();
	if (!params.tape) {
		throw error(400, 'Tape parameter is missing');
	}

	const filePath = join(NOTE_DIR, params.tape, saneFilePath);
	if (existsSync(filePath)) {
		return invalid(invalid.fileName('File already exists'));
	}
	try {
		// Créer le dossier s'il n'existe pas
		await mkdir(dirname(filePath), { recursive: true });
		// Créer le fichier
		await writeFile(filePath, '', 'utf-8');
	} catch (err) {
		console.error('Error creating file:', err);
		return invalid(invalid.fileName('Error creating file'));
	}

	await getFileTree().refresh();

	return {
		name: newFilename,
		path: saneFilePath,
		type: 'file',
		content: '',
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

	console.log(`Writing content to ${path.join(NOTE_DIR, filePath)}`);
	await writeFile(path.join(NOTE_DIR, await getCurrentTape(), filePath), content.trim(), 'utf-8');
});

export const moveEntry = command(z.object({
	entryPath: z.string(),
	destFolder: z.string()
}), async ({ entryPath, destFolder }): Promise<EntryModification[]> => {
	const entryName = path.basename(entryPath);

	if (entryPath === destFolder) {
		return [];
	}

	const oldPath = path.resolve(NOTE_DIR, await getCurrentTape(), entryPath);
	const newPath = path.resolve(NOTE_DIR, await getCurrentTape(), destFolder, entryName);

	// Validate paths are within DATA_DIR
	const dataDir = path.resolve(NOTE_DIR);
	if (!oldPath.startsWith(dataDir) || !newPath.startsWith(dataDir)) {
		throw error(400, 'Invalid path');
	}

	if (oldPath === newPath) {
		return [];
	}

	await move(oldPath, newPath);
	getFileTree().refresh();

	const isFolder = await lstat(newPath).then(stats => stats.isDirectory()).catch(() => false);
	const modifications = [{
		type: 'moved',
		oldPath: isFolder ? path.join(entryPath, '/') : entryPath,
		newPath: isFolder ? path.join(destFolder, entryName, '/') : newPath,
		isFolder
	}] satisfies EntryModification[];
	console.log(modifications);

	return modifications;
});

export const renameEntry = command(z.object({
	entryPath: z.string(),
	newName: z.string()
}), async ({ entryPath, newName }): Promise<EntryModification[]> => {
	const sanitizedName = newName.replace(/[^a-zA-Z0-9._-]/g, '_').trim();

	if (!sanitizedName) {
		throw error(400, 'New name cannot be empty');
	}

	const oldPath = path.resolve(NOTE_DIR, await getCurrentTape(), entryPath);
	const targetFolder = path.dirname(entryPath);
	const newPath = path.resolve(NOTE_DIR, await getCurrentTape(), targetFolder, sanitizedName);

	if (oldPath === newPath) {
		return [];
	}

	await move(oldPath, newPath);
	await getFileTree().refresh();

	const isFolder = await lstat(newPath).then(stats => stats.isDirectory()).catch(() => false);
	const modifications = [{
		type: 'renamed', 
		oldPath: isFolder ? path.join(entryPath, '/') : entryPath,
		newPath: isFolder ? 
			path.join(targetFolder, sanitizedName, '/') :
			path.join(targetFolder, sanitizedName),
		isFolder
	}] satisfies EntryModification[];
	console.log(modifications);
	
	return modifications;
});

export const removeEntry = command(z.object({
	entryPath: z.string()
}), async ({ entryPath }): Promise<EntryModification[]> => {
	const fullPath = path.resolve(NOTE_DIR, await getCurrentTape(), entryPath);

	// Validate path is within DATA_DIR
	const dataDir = path.resolve(NOTE_DIR);
	if (!fullPath.startsWith(dataDir)) {
		throw error(400, 'Invalid path');
	}

	const isFolder = await lstat(fullPath).then(stats => stats.isDirectory()).catch(() => false);
	await rm(fullPath, { recursive: true, force: true });
	await getFileTree().refresh();

	const modifications = [{
		type: 'removed',
		oldPath: isFolder ? path.join(entryPath, '/') : entryPath,
		newPath: '',
		isFolder
	}] satisfies EntryModification[];
	console.log(modifications);

	return modifications;
});