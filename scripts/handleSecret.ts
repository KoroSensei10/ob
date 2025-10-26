import crypto from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// This script handles the generation and retrieval of the BETTER_AUTH_SECRET
// In the future this will be used to setup a secret without thinking about it, the first
// time you run the app.
function getSecret(): string {
	let secret = readFileSync(path.resolve(process.cwd(), './data/better_auth_secret.txt'), 'utf-8')
		.split('\n')
		.find(line => line.startsWith('BETTER_AUTH_SECRET='))
		?.split('=')[1];
	if (!secret) {
		secret = crypto.randomBytes(32).toString('hex');
		writeFileSync(path.resolve(process.cwd(), './data/better_auth_secret.txt'), `BETTER_AUTH_SECRET=${secret}\n`, { flag: 'a' });
	}
	return secret;
}

getSecret();