import { type Request, type Response, type NextFunction } from 'express'
import { ConfigService } from '../../../services/config.service.ts'

export class ConfigController {
    
    // Helper to dynamically isolate the service per request based on the user
    private static getServiceForRequest(req: Request): ConfigService {
        // For fallback, we can check headers, query params, or body. id - is user unique id from DB
        const userId = req.body?.id || req.query?.id || req.headers['x-id']
        
        if (!userId) {
            // Throw a clean, catchable error if the user context is missing
            throw new Error('User context missing from request.')
        }
        
        return new ConfigService(`config-${userId}`) // Passing name of user config folder and setting the prop from config service 
    }

    // GET /api/v1/configs/files
    static async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const configService = ConfigController.getServiceForRequest(req)
            const files = await configService.getFilesMetadata()
            res.json(files)
        } catch (error) {
            next(error)
        }
    }

    // POST /api/v1/configs/files
    static async createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body || Object.keys(req.body).length === 0) {
                res.status(400).json({ error: 'Request body cannot be empty.' })
                return
            }

            const configService = ConfigController.getServiceForRequest(req)
            const newFile = await configService.createNewFile(req.body.data)
            
            res.status(201).json({
                fileName: newFile.fileName,
                version: newFile.nextVersion
            })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/v1/configs/files/:filename
    static async getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const configService = ConfigController.getServiceForRequest(req)
            const data = await configService.readFileContent(String(req.params.filename))
            res.json(data)
        } catch (error) {
            next(error)
        }
    }

    // PATCH /api/v1/configs/files/:filename
    static async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const configService = ConfigController.getServiceForRequest(req)
            await configService.updateFileContent(String(req.params.filename), req.body.data)
            res.json(req.body)
        } catch (error) {
            next(error)
        }
    }

    // DELETE /api/v1/configs/files/:filename
    static async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const configService = ConfigController.getServiceForRequest(req)
            await configService.deleteFile(String(req.params.filename))
            res.json({ success: true })
        } catch (error) {
            next(error)
        }
    }

    // GET /api/v1/configs/files/download/:filename
    static async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const configService = ConfigController.getServiceForRequest(req)
            
            // Re-verify the file belongs to this user before trying to read it
            const files = await configService.getFileNames()
            const targetFile = String(req.params.filename)

            if (!files.includes(targetFile)) {
                res.status(404).json({ error: 'File not found.' })
                return
            }

            // Let the instance safely resolve the isolated absolute path 
            // instead of doing path logic directly in the controller.
            // @ts-ignore - Assuming getSafePath is exposed or we handle download stream
            const filePath = configService['getSafePath'](targetFile) 

            res.download(filePath, targetFile, (err) => {
                if (err && !res.headersSent) {
                    next(err)
                }
            })
        } catch (error) {
            next(error)
        }
    }

    // POST /api/v1/configs/folder
    static async createFolder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.body || !req.body.userId) {
                res.status(400).json({ error: 'Request body must contain a userId.' })
                return
            }

            const configService = ConfigController.getServiceForRequest(req)
            const newFolder = await configService.makeFolder()
            
            res.status(201).json({
                folderName: newFolder.folderName,
            })
        } catch (error) {
            next(error)
        }
    }
}