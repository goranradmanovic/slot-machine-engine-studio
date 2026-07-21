import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'
import { appConfig } from '../config/app.config.ts'

let db: Database

export async function connectDatabase(): Promise<Database> {

    if (db) return db


    db = await open({
        filename: appConfig.databasePath || 'database.sqlite',
        driver: sqlite3.Database
    })

    await db.exec('PRAGMA foreign_key = ON')

    console.log('SQLite connected')

    return db
}


export function getDatabase(): Database {
   
    if (!db) throw new Error('Database has not be initialized.')

    return db
}