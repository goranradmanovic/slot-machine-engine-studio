import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApiError } from '../utils/api-error.ts'
import type { FileMetadata } from '../types/config.types.ts'
import { defaultConfig } from '../config/default.config.ts'

export class ConfigService {
    // Shared base configuration roots
    private static readonly dirname = path.dirname(fileURLToPath(import.meta.url))
    private static readonly baseConfigDir = path.resolve(ConfigService.dirname, '../', 'slot_configs')

    // Instance-specific paths
    private readonly userFolder: string
    private readonly userConfigDir: string

    constructor(folderName: string) {
        this.userFolder = folderName
        // Automatically resolves to slot_configs/folderName safely across OS platforms
        this.userConfigDir = path.resolve(ConfigService.baseConfigDir, folderName)
    }

    // Resolves a safe, absolute path to a file and validates against directory traversal.
    private getSafePath(fileName: string): string {
        const resolvedPath = path.resolve(this.userConfigDir, fileName)
        
        // Strict guard: Enforce that the file actually lives inside the user's allocated directory
        if (!resolvedPath.startsWith(this.userConfigDir)) {
            throw new ApiError(403, 'Access denied.')
        }
        return resolvedPath
    }

    // Reads all file names in the target directory
    async getFileNames(): Promise<string[]> {
        try {
            return await fs.readdir(this.userConfigDir)
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new ApiError(404, 'Configuration directory not found.')
            }
            throw error
        }
    }

    // Returns metadata for all configuration files in the folder
    async getFilesMetadata(): Promise<FileMetadata[]> {
        const files = await this.getFileNames()

        const fileMetadata = await Promise.all(
            files.map(async (fileName) => {
                const absolutePath = this.getSafePath(fileName)
                const stats = await fs.stat(absolutePath)

                // Standardize path relative to project root, keeping forward slashes
                const parentDir = path.resolve(ConfigService.baseConfigDir, '..')
                let relativePath = path.relative(parentDir, absolutePath)
                relativePath = relativePath.replace(/\\/g, '/')

                return {
                    name: fileName,
                    path: `.../${relativePath}`,
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

        return fileMetadata.filter(file => file.isFile)
    }

    // Automatically increments the version suffix and writes a new file
    async createNewFile(fileContent: Record<string, any>): Promise<{ fileName: string, nextVersion: number }> {
        const baseName = 'reels'
        const files = await this.getFileNames()

        const versions = files
            .filter(f => f.startsWith(baseName))
            .map(f => {
                const match = f.match(/_v(\d+)\.json$/)
                return match ? Number(match[1]) : 0
            })

        const nextVersion = versions.length ? Math.max(...versions) + 1 : 1
        const fileName = `${baseName}_v${nextVersion}.json`
        const filePath = this.getSafePath(fileName)

        await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), 'utf8')

        return { fileName, nextVersion }
    }

    // Reads and parses a specific configuration file
    async readFileContent(fileName: string): Promise<Record<string, any>> {
        const filePath = this.getSafePath(fileName)
        
        try {
            const rawData = await fs.readFile(filePath, 'utf8')
            return JSON.parse(rawData)
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new ApiError(404, `Config file "${fileName}" not found.`)
            }
            if (error instanceof SyntaxError) {
                throw new ApiError(500, `Config file "${fileName}" contains invalid JSON.`)
            }
            throw error
        }
    }

    // Overwrites the content of a target file
    async updateFileContent(fileName: string, fileContent: Record<string, any>): Promise<void> {
        const filePath = this.getSafePath(fileName)

        try {
            await fs.access(filePath)
            await fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), 'utf8')
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new ApiError(404, `Config file "${fileName}" not found.`)
            }
            throw error
        }
    }

    // Deletes a config file
    async deleteFile(fileName: string): Promise<void> {
        const filePath = this.getSafePath(fileName)

        try {
            await fs.unlink(filePath)
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                throw new ApiError(404, `Config file "${fileName}" not found.`)
            }
            throw error
        }
    }

    // Create a new user config folder and default config file
    async makeFolder(): Promise<{ folderName: string }> {
        try {
            await fs.mkdir(this.userConfigDir, { recursive: true })
            await this.createNewFile(defaultConfig)
            
            return { folderName: this.userFolder }
        } catch (err) {
            console.error('Error creating folder:', err)
            throw err
        }
    }

    // Delete user config folder with content
    async deleteFolder(): Promise<void> {
        try {
            // Extra safety guard check before running recursive removals
            if (this.userConfigDir === ConfigService.baseConfigDir) {
                throw new ApiError(400, 'Cannot delete base configurations root directory.')
            }
            await fs.rm(this.userConfigDir, { recursive: true, force: true })
        } catch (err: any) {
            console.error(`Error deleting folder: ${err.message}`)
            throw err
        }
    }
}