import { connectDatabase } from "./database.ts"

export async function initializeDatabase(): Promise<void> {

    const db = await connectDatabase()

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            firstName TEXT NULL,
            lastName TEXT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            permissions TEXT NOT NULL DEFAULT [],
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )    
    `)

    await db.exec(`
        CREATE TABLE IF NOT EXISTS refresh_tokens(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sessionId TEXT NOT NULL UNIQUE,
            userId INTEGER NOT NULL,
            tokenHash TEXT NOT NULL,
            expiresAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            lastUsedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY(userId)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    `)

    await db.exec(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            resetTokenHash TEXT NOT NULL UNIQUE,
            expiresAt DATETIME NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            usedAt DATETIME,

            FOREIGN KEY(userId)
                REFERENCES users(id)
                ON DELETE CASCADE
        )
    `)

    console.log('Database initialized')
}