import type { UserPermission } from "./user-permission.types.ts"
import { Permission } from "../enums/permission.enum.ts"

export interface User {
    id?: number;
    email: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
    refreshToken?: string | null;
    password: string;
    permissions: UserPermission;
    createdAt: string;
    updatedAt: string;
}

export interface TokenPayload {
    userId: number;
    email: string;
}

export interface UserResponseDto {
    id: number;
    username: string;
    email: string;
    permissions: UserPermission;
    createdAt: string;
}

export interface UpdateUserPermissionsDto {
    permissions: Permission[]
}