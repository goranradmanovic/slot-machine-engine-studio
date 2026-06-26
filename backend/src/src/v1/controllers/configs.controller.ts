import { type Request, type Response, type NextFunction } from 'express'
import { configs } from '../../../configs/config.ts'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
type ConfigVersion = keyof typeof configs

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Targets the 'config' folder in your project root
const CONFIG_DIR = path.join(__dirname, '../../..', 'configs')

export class ConfigController {
    
    // GET /api/v1/configs
    // GET all available config versions v1, v2, v3 etc.
    static async getAllConfigVersions(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.json(Object.keys(configs) as ConfigVersion[])
        } catch (error) {
            next(error)
        }
    }

    // GET /api/v1/configs/:filename
    // GET config file and JSON data from it
    static async getConfigFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filePath = path.join(CONFIG_DIR, `${req.params.filename}.json`)
        
            // Security check: prevents directory traversal attacks (e.g., ../../etc/passwd)
            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' })
                return
            }
        
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        return res.status(404).json({ error: 'File not found' })
                    }
                    return res.status(500).json({ error: 'Failed to read file' })
                }
                res.json(JSON.parse(data))
            })
        } catch (error) {
            next(error)
        }
    }

    // PATCH /api/v1/configs/:filename
    // PATCH the config JSON data and update the config file
    static async updateConfigFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filePath = path.join(CONFIG_DIR, `${req.params.filename}.json`)
        
            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' })
                return
            }
        
            // Format with 2-space indentation before saving
            fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to save file' })
                }
                // SUCCESS: Return the exact parsed configuration back to the client!
                res.json(req.body)
            })
        } catch (error) {
            next(error)
        }
    }
}