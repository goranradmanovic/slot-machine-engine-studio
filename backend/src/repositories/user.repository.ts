import { getDatabase } from "../database/database.ts"
import type { User } from '../models/user.model.ts'
import { Permission } from "../enums/permission.enum.ts"
import { stringifyPermissions } from "../utils/permission.ts"
import { ApiError } from "../utils/api-error.ts"

export class UserRepository {

    static async findAll(): Promise<User[]> {
        const db = getDatabase()

        return db.all<User[]>('SELECT id, username, firstName, lastName, email, permissions, createdAt, updatedAt FROM users')
    }

    static async findById(id: number): Promise<User | undefined> {
        const db = getDatabase()

        return db.get<User>('SELECT id, username, firstName, lastName, email, permissions, createdAt, updatedAt FROM users WHERE id = ?', id)
    }

    static async findByEmail(email: string): Promise<User | undefined> {
        const db = getDatabase()

        return db.get<User>('SELECT * FROM users WHERE email = ?', email)
    }

    static async findByUsername(username: string): Promise<User | undefined> {
        const db = getDatabase()

        return db.get<User>('SELECT * FROM users WHERE username = ?', username)
    }

    static async create(user: { username: string,  email: string, password: string, firstName: string, lastName: string, permissions: string }): Promise<User> {
        const db = getDatabase()

        const result = await db.run(
            'INSERT INTO users (username, email, password, firstName, lastName, permissions) VALUES (?, ?, ?, ?, ?, ?)',
            user.username,
            user.email,
            user.password,
            user.firstName,
            user.lastName,
            user.permissions
        )

        const createdUser = await this.findById(result.lastID!)

        if (!createdUser) throw new Error('Failed to create user.')

        return createdUser
    }

    static async deleteById(id: number): Promise<void> {
        const db = getDatabase()

        await db.run('DELETE FROM users WHERE id = ?', id)
    }

    static async updateUser(id: number, fieldsToUpdate: {}): Promise<User> {
        const db = getDatabase()

        // Extract keys and filter out undefined values
        const entries = Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)

        // If the payload is empty, do nothing to prevent SQL errors
        if (entries.length === 0) return

        // Map entries to SQL "column = ?" strings
        const assignments = entries.map(([key]) => `${key} = ?`).join(', ')

        // Gather the values in the exact order of the columns
        const values = entries.map(([_, value]) => value)

        // Construct the final query text
        const query = `UPDATE users SET ${assignments}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`

        // Append the ID to the end of the values array for the WHERE clause
        values.push(id)

        // Execute the safe, parameterized query
        await db.run(query, ...values)

        const updatedUser = await this.findById(id)

        if (!updatedUser) throw new Error('Failed to update user.')

        return updatedUser
    }

    static async updatePassword(id: number, password: string): Promise<void> {
        const db = getDatabase()

        await db.run(
            'UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            password,
            id
        )
    }

    static async updatePermissions(id: number, permissions: Permission[]): Promise<void> {
        const db = getDatabase()

        await db.run(
            'UPDATE users SET permissions = ?, updateAt = CURRENT_TIMESTAMP WHERE id = ?',
            stringifyPermissions(permissions),
            id
        )
    }

    static async getPermissions(userId: number): Promise<Permission[]> {
        const user = await this.findById(userId)

        if (!user) throw new ApiError(404, 'User not found.')

        return user.permissions
    }
}