import { json, type RequestHandler } from "@sveltejs/kit";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

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

        // TODO: Valider request.fileName pour prévenir les attaques de directory traversal
        // Pour l'instant, on force le dossier ./data/
        // On remplace les caractères non autorisés dans le nom de fichier
        // TODO: On ajoute l'extension .md
        // TODO: split les / pour créé les dossiers automatiquement
        const fileName = request.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = join('./data/', fileName);

        // Contenu du fichier (vide par défaut ou contenu fourni)
        const content = request.content || '';
        
        // Créer le dossier data s'il n'existe pas
        await mkdir(dirname(filePath), { recursive: true });
        
        // Créer le fichier
        await writeFile(filePath, content, 'utf-8');
        
        return json(
            { 
                success: true, 
                message: `File ${fileName} created successfully`,
                fileName: fileName
            },
            { status: 201 }
        );
        
    } catch (error) {
        console.error('Error creating file:', error);
        return json(
            { 
                error: 'Failed to create file',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
};
