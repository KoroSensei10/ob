import { json, type RequestHandler } from "@sveltejs/kit";
import { readFile } from "node:fs/promises";

export const POST: RequestHandler = async (data) => {
    const request = await data.request.json();
    // TODO: Validate request.fileName to prevent directory traversal attacks
    const file = await readFile(request.fileName, {
        encoding: 'utf-8',
    });
    return json(file, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8'
        }
    });
};