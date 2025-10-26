import { NOTE_DIR as ENV_NOTE_DIR} from '$env/static/private';
import { DEFAULTS } from './defaults';

export const NOTE_DIR = ENV_NOTE_DIR || DEFAULTS.NOTE_DIR;