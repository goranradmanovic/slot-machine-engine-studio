import { Permission } from '../enums/permission.enum.ts'

export class PermissionService {

    // Default permissions assigned to newly registered users.

    static getDefaultPermissions(): Permission[] {
        return [
            Permission.CONFIG_READ,
            Permission.CONFIG_WRITE
        ]
    }
}

/**
    getDefaultPermissions()
    hasPermission()
    canAccessFeature()
    grantPermission()
    revokePermission()
    getDeveloperPermissions()
    getDesignerPermissions()
    getAdminPermissions()
*/