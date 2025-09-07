import { json, type RequestHandler } from "@sveltejs/kit";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export const POST: RequestHandler = async (data) => {
    try {
        const request = await data.request.json();
        
        // Validation des données d'entrée
        if (!request.fileName || typeof request.fileName !== 'string') {
            return json(
                { error: 'fileName is required and must be a string' },
                { status: 400 }
            );
        }

        if (request.content === undefined || request.content === null) {
            return json(
                { error: 'content is required' },
                { status: 400 }
            );
        }

        // TODO: Valider request.fileName pour prévenir les attaques de directory traversal
        const filePath = request.fileName;
        const content = request.content;
        
        // Créer le dossier parent s'il n'existe pas
        await mkdir(dirname(filePath), { recursive: true });
        
        // Écrire le contenu dans le fichier
        await writeFile(filePath, content, 'utf-8');
        
        return json(
            { 
                success: true, 
                message: `File ${filePath} updated successfully`
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Error writing file:', error);
        return json(
            { 
                error: 'Failed to write file',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
};