import { type Request, type Response, type NextFunction } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Targets the 'config' folder in your project root
const CONFIG_DIR = path.join(__dirname, '../../..', 'configs')

export class ConfigController {
    
    // Read all files from config folder
    static async getFileNames() {
        return await fs.readdir(CONFIG_DIR)
    }

    // Get config files metadata
    static async getFilesMetadata() {
        const files = await this.getFileNames()

        const fileMetadata = await Promise.all(
            files.map(async (fileName) => {
                const filePath = path.join(CONFIG_DIR, fileName)
                const stats = await fs.stat(filePath)

                return {
                    name: fileName,
                    path: filePath,
                    extension: path.extname(fileName),
                    sizeInBytes: stats.size,
                    isFile: stats.isFile(),
                    isDirectory: stats.isDirectory(),
                    createdAt: stats.birthtime,
                    updatedAt: stats.mtime,
                    lastAccessedAt: stats.atime
                }
            })
        )

        const onlyFiles = fileMetadata.filter(file => file.isFile)
        return onlyFiles
    }

    // GET /api/v1/configs/files
    // GET route to dynamically read all config files metadata in the configs directory
    static async listFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const files = await ConfigController.getFilesMetadata();
            res.json(files);
        } catch (error) {
            console.error('Failed to dynamically read config files metadata: ', error)
            next(error)
        }
    }

    // POST /api/v1/configs/files
    // POST the default config JSON data and create the new config file
    static async createFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const content = req.body;
            const baseName = 'reels'

            const files = await ConfigController.getFileNames()

            const versions = files
                .filter(f => f.startsWith(baseName))
                .map(f => {
                    const match = f.match(/_v(\d+)\.json$/);
                    return match ? Number(match[1]) : 0;
                })

            const nextVersion = versions.length
                ? Math.max(...versions) + 1
                : 1

            const fileName = `${baseName}_v${nextVersion}.json`
            const filePath = path.join(CONFIG_DIR, fileName)

            await fs.writeFile(filePath, JSON.stringify(content, null, 2))
            
            // SUCCESS: Return the exact parsed configuration back to the client!
            res.status(201).json({
                fileName,
                version: nextVersion
            });
        } catch (error) {
            // Any filesystem errors from writeFile or dynamicallyAppendConfig end up here safely
            next(error)
        }
    }

    // GET /api/v1/configs/files/:filename
    // GET config file and JSON data from it
    static async getFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filePath = path.join(CONFIG_DIR, req.params.filename)

            // Security check: prevents directory traversal attacks (e.g., ../../etc/passwd)
            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' })
                return
            }
        
            const data = await fs.readFile(filePath, 'utf8')

            res.json(JSON.parse(data))
        } catch (error) {
            next(error)
        }
    }

    // PATCH /api/v1/configs/files/:filename
    // Editing config files from configs directory
    static async updateFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filePath = path.join(CONFIG_DIR, req.params.filename)
        
            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' })
                return
            }
        
            // Format with 2-space indentation before saving
            await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf8')

            // SUCCESS: Return the exact parsed configuration back to the client!
            res.json(req.body)
        } catch (error) {
            next(error)
        }
    }

    // DELETE /api/v1/configs/files/:filename
    // Deleting config files from configs directory
    static async deleteFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filePath = path.join(CONFIG_DIR, req.params.filename)

            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' })
                return
            }

            await fs.unlink(filePath)
            res.json({ success: true })
        } catch (error) {
            console.error('Failed to delete config file: ', error)
            next(error)
        }
    }

    // GET /api/v1/configs/files/download/:filename
    // Download config file from configs directory
    static async downloadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filePath = path.join(CONFIG_DIR, req.params.filename)
        
            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' })
                return
            }

            const downloadName = req.params.filename

            res.download(filePath, downloadName, err => {
                if (err) {
                    console.error('Error downloading file: ', err)
                    res.status(500).send('Could not download the file.')
                }
            })
        } catch (error) {
            next(error)
        }
    }
}