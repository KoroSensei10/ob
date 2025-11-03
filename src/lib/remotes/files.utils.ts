import path from 'node:path';
import { getRequestEvent } from '$app/server';
import { NOTE_DIR } from '../../server/consts';


export function sanitizeFileName(name: string): string {
	return name.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function sanitizeFilePath(p: string): string {
	const filePathParts: string[] = p.split('/');
	const sanitizedParts = filePathParts.map(sanitizeFileName);
	const saneFilePath = sanitizedParts.join('/');
	return saneFilePath;
}

export function isValidPath(p: string): boolean {
	// Disallow empty paths and paths with invalid characters
	if (!p || /[<>:"|?*]/.test(p)) {
		return false;
	}

	// Disallow paths that navigate outside the base directory
	const normalizedPath = path.normalize(p);
	if (normalizedPath.startsWith('..') || path.isAbsolute(normalizedPath)) {
		return false;
	}

	return true;
}

export function getFileExtension(fileName: string): string {
	const ext = path.extname(fileName);
	return ext.startsWith('.') ? ext.slice(1) : ext;
}

/**
 * @throws if no tape param is set
 * @throws if path is invalid
 * @returns in the form of "NOTE_DIR/tape_dir/sanitizedPath"
 */
export function getValidPathInTape(p: string): string {
	const { params } = getRequestEvent();
	if (!params.tape) {
		throw new Error('No Tape param');
	}
	const sanePath = path.join(NOTE_DIR, params.tape, sanitizeFilePath(p));
	if (!isValidPath(sanePath)) {
		throw new Error('Invalid path');
	}
	return sanePath;
}

export function getRelativePathFromTape(fullPath: string): string {
	const { params } = getRequestEvent();
	if (!params.tape) {
		throw new Error('No Tape param');
	}
	const tapePath = path.join(NOTE_DIR, params.tape);
	return path.relative(tapePath, fullPath);
}