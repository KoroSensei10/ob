import z from "zod";
import { type RequestHandler } from "@sveltejs/kit";
import { move } from "fs-extra";
import path from "node:path";

const DATADIR = "./data/";

const moveSchema = z.object({
    entryPath: z.string(),
    destFolder: z.string(),
});

export const POST: RequestHandler = async (data) => {
    const request = await data.request.json();
    const { entryPath, destFolder } = moveSchema.parse(request);

    const entryName = entryPath.split("/").pop();
    if (!entryName) {
        return Response.json({ error: "Invalid entry name" }, { status: 400 });
    }

    if (entryPath === destFolder) {
        return Response.json(200);
    }
    

    // TODO: strong validation of the paths to avoid errors or security issues
    const oldPath = path.resolve(DATADIR + entryPath);
    const newPath = path.resolve(path.join(DATADIR, destFolder, entryName));
    if (!oldPath.startsWith(path.resolve(DATADIR)) || !newPath.startsWith(path.resolve(DATADIR))) {
        return Response.json({ error: "Invalid path" }, { status: 400 });
    }
    if (oldPath === newPath) {
        return Response.json(200);
    }

    console.log(`Moving entry from ${oldPath} to ${newPath}`);
    // move the file
    await move(oldPath, newPath);

    return Response.json(200);
};