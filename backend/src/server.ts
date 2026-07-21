import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import { initializeDatabase } from './database/schema.ts'
import v1Router from './src/v1/index.ts'
import type { SlotMachineConfig } from './types/slot-machine-config.types.ts'
import type { ClientToServerEvents, ServerToClientEvents } from './types/socket-events.types.ts'
import { notFoundMiddleware } from './middlewares/not-found.middleware.ts'
import { errorMiddleware } from './middlewares/error.middleware.ts'
import { CleanupService } from './services/cleanup.service.ts'
import { appConfig } from './config/app.config.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Server setup
const app = express()
const PORT = appConfig.port || 3000

app.use(cors()) // Set up the CORS middleware
app.use(express.json()) // Read the POST body
app.use(cookieParser())
app.use('/api/v1', v1Router) // User router
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const interval = appConfig.cleanupIntervalMinutes * 60 * 1000
const httpServer = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, { 
    cors: { origin: '*' }
})

io.on('connection', socket => {
    console.log('Client connected')

    socket.on('request-config', async (version: string | unknown) => {
        console.log('Client requested config')
        const filename = version

        if (!filename) {
            socket.emit('config-error', { message: 'Config not found' })
            return
        }

        const filePath = path.join(__dirname, 'configs', filename)
        const config = JSON.parse(await fs.readFile(filePath, 'utf-8')) as SlotMachineConfig

        socket.emit('config-response', config)
    })
})

const databaseCleanup = () => {
    setInterval(async () => {
        try {
            await CleanupService.run()
        } catch (error) {
            console.error('Cleanup failed: ', error)
        }
    }, interval)
}

async function bootstrap() {
    await initializeDatabase()
    databaseCleanup()

    // Start the server
    httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

bootstrap()