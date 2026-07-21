import type { UserPermission } from "../types/user-permission.types.ts"

export interface User {
    id: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    permissions: UserPermission;
    createdAt: string,
    updatedAt: string
}