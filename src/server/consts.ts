import { env } from '$env/dynamic/private';
import { DEFAULTS } from './defaults';

export const NOTE_DIR = env.NOTE_DIR || DEFAULTS.NOTE_DIR;