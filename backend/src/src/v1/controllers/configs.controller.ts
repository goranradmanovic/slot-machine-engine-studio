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

    // POST /api/v1/configs/
    // POST the default config JSON data and create the new config file
    static async createConfigFile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filename = req.params.filename;
            const filePath = path.join(CONFIG_DIR, `${filename}.json`);
        
            if (!filePath.startsWith(CONFIG_DIR)) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }
        
            // Modernized approach: Avoid nested callback hell using await
            fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2), 'utf8')

            // Call the static helper method using 'ConfigController' or 'this'
            // We pass the filename string down to it dynamically
            await ConfigController.dynamicallyAppendConfig(filename);
            
            // SUCCESS: Return the exact parsed configuration back to the client!
            res.json({})
        } catch (error) {
            // Any filesystem errors from writeFile or dynamicallyAppendConfig end up here safely
            next(error);
        }
    }

    // Update the config.ts with new entry
    private static async dynamicallyAppendConfig(filename: string): Promise<void | object> {
        try {
            // 1. Read the config.ts file
            const content = fs.readFileSync(`${CONFIG_DIR}\\config.ts`, 'utf-8')

            // 2. Extract the key "v4" from "reels_v4"
            const versionMatch = filename.match(/v\d+/)
            const key = versionMatch ? versionMatch[0] : filename // Fallback to filename if "v" prefix isn't found

            // Prevent duplicate entries if "v4:" already exists in the file
            if (content.includes(`${key}:`)) {
                console.log(`Key "${key}" already exists in config.ts. Skipping append.`)
                return
            }

            // 3. RegEx to find all property declarations matching: key: 'value.json'
            const propRegex = /([a-zA-Z0-9_]+:\s*'[^']+\.json')(,?)/g
            const matches = [...content.matchAll(propRegex)]

            if (matches.length === 0) {
                throw new Error('Could not find any valid configuration lines inside config.ts')
            }

            // 4. Isolate the very last property line in the object array
            const lastMatch = matches[matches.length - 1]
            const fullMatchedLine = lastMatch[0] // e.g., "v3: 'reels_v3.json'" or "v4: 'reels_v4.json',"
            const hasComma = lastMatch[2] === ','

            // 5. Structure the replacement code string cleanly
            const cleanBaseLine = hasComma ? fullMatchedLine : `${fullMatchedLine},`
            const newLine = `\n    ${key}: '${filename}.json',`

            // 6. Replace only the last occurrence using string slice manipulation to avoid structural breaks
            const matchIndex = lastMatch.index!
            const updatedContent = 
                content.slice(0, matchIndex) + 
                cleanBaseLine + 
                newLine + 
                content.slice(matchIndex + fullMatchedLine.length)

            // 7. Save structural updates back to disk
            fs.writeFileSync(`${CONFIG_DIR}\\config.ts`, updatedContent, 'utf-8')
            console.log(`Successfully appended -> ${key}: '${filename}.json'`)
            return { success: true }
        } catch (error) {
            console.error('Failed to dynamically update config.ts:', error)
            throw error // Propagates up to your main try/catch block
        }
    }
}