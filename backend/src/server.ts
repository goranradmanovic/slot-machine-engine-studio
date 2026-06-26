import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import v1Router from './src/v1/routes/index.ts'
import { configs } from './configs/config.ts'
import type { SlotMachineConfig } from './types/SlotMachineConfig.ts'
import type { ClientToServerEvents, ServerToClientEvents } from './types/SocketEvents.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Server setup
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors()) // Set up the CORS middleware
app.use(express.json()) // Read the POST body
app.use('/api/v1', v1Router) // User router

const httpServer = createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, { 
    cors: { origin: '*' }
})

io.on('connection', socket => {
    console.log('Client connected')

    socket.on('request-config', version => {
        console.log('Client requested config')
        const filename = configs[version]

        if (!filename) {
            socket.emit('config-error', { message: 'Config not found' })
            return
        }

        const filePath = path.join(__dirname, 'configs', filename)
        const config = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SlotMachineConfig

        socket.emit('config-response', config)
    })
})

// Start the server
httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`))