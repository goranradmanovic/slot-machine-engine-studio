import type { Permission } from '../enums/permission.enum.ts'

export function parsePermissions(permissions: string | Permission[] | null | undefined): Permission[] {
    if (!permissions) return []

    if (Array.isArray(permissions)) return permissions

    try {
        const parsed = JSON.parse(permissions) as Permission[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export function stringifyPermissions(permissions: Permission[]): string {
    return JSON.stringify(permissions)
}

export function hasPermission(userPermissions: Permission[], permission: Permission): boolean {
    return userPermissions.includes(permission)
}

export function hasAnyPermission(userPermissions: Permission[], permissions: Permission[]): boolean {
    return permissions.some(permission => userPermissions.includes(permission))
}

export function hasAllPermissions(userPermissions: Permission[], permissions: Permission[]): boolean {
    return permissions.every(permission => userPermissions.includes(permission))
}

/*
    mergePermissions()
    removePermission()
*/