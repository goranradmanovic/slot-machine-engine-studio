import { getDatabase } from "../database/database.ts"
import type { User } from '../models/user.model.ts'
import { Permission } from "../enums/permission.enum.ts"
import { stringifyPermissions } from "../utils/permission.ts"
import { ApiError } from "../utils/api-error.ts"

export class UserRepository {

    static async findById(id: number): Promise<User | undefined> {
        const db = getDatabase()

        return db.get<User>('SELECT * FROM users WHERE id = ?', id)
    }

    static async findByEmail(email: string): Promise<User | undefined> {
        const db = getDatabase()

        return db.get<User>('SELECT * FROM users WHERE email = ?', email)
    }

    static async findByUsername(username: string): Promise<User | undefined> {
        const db = getDatabase()

        return db.get<User>('SELECT * FROM users WHERE username = ?', username)
    }

    static async create(user: { username: string,  email: string, password: string, permissions: string }): Promise<User> {
        const db = getDatabase()

        const result = await db.run(
            'INSERT INTO users (username, email, password, permissions) VALUES (?, ?, ?, ?)',
            user.username,
            user.email,
            user.password,
            user.permissions
        )

        const createdUser = await this.findById(result.lastID!)

        if (!createdUser) throw new Error('Failed to create user.')

        return createdUser
    }

    static async updateUserFullName(id: number, firstName: string, lastName: string): Promise<void> {
        const db = getDatabase()

        await db.run(
            'UPDATE users SET firstName = ?, lastName = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            id,
            firstName,
            lastName   
        )
    }

    static async updatePassword(id: number, password: string): Promise<void> {
        const db = getDatabase()

        await db.run(
            'UPDATE users SET password = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
            id,
            password,   
        )
    }

    static async updatePermissions(userId: number, permissions: Permission[]): Promise<void> {
        const db = getDatabase()

        await db.run(
            'UPDATE users SET permissions = ?, updateAt = CURRENT_TIMESTAMP WHERE id = ?',
            stringifyPermissions(permissions),
            userId
        )
    }

    static async getPermissions(userId: number): Promise<Permission[]> {
        const user = await this.findById(userId)

        if (!user) throw new ApiError(404, 'User not found.')

        return user.permissions
    }
}