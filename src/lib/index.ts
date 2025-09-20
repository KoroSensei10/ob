import type { FileTree } from "$types/files";
import { readdir } from "node:fs/promises";
import path from "node:path";

export async function createFileTree(parentPath: string): Promise<FileTree[]> {
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
        childs: null,
        content: null
      })
    } else if (e.isDirectory()) {
      const dirpath = path.join(parentPath, e.name);
      childs.push({
        name: e.name,
        path: filePath,
        type: "dir",
        childs: await createFileTree(dirpath)
      })
    }
  }
  return childs
}