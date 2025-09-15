import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import type { PageServerLoad } from './$types';


const DATA_DIR = './data';

export type FileTree = {
  name: string;
  path: string;
  type: "dir" | "file";
  childs: FileTree[] | null;
};

async function zed(parentPath: string): Promise<FileTree[]> {
  const entries = await readdir(parentPath, { withFileTypes: true });
  const childs: FileTree[] = [];

  for (const e of entries) {
    let filePath = path.join(parentPath, e.name);
    filePath = filePath.substring(filePath.indexOf('/') + 1);
    if (e.isFile()) {
      childs.push({
        name: e.name,
        path: filePath,
        type: "file",
        childs: null
      })
    } else if (e.isDirectory()) {
      const dirpath = path.join(parentPath, e.name);
      childs.push({
        name: e.name,
        path: filePath,
        type: "dir",
        childs: await zed(dirpath)
      })
    }
  }
  return childs
}

export const load: PageServerLoad = async () => {
    // Ensure data directory exists
    await mkdir(DATA_DIR, { recursive: true });

    // TODO: handle custom vault inside data folder
    const tree = await zed(DATA_DIR);

    return {
        files: tree
    };
};