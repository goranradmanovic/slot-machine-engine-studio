import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../types/auth.types.ts'
import { Permission } from '../enums/permission.enum.ts'
import { ApiError } from '../utils/api-error.ts'
import { hasAnyPermission } from '../utils/permission.ts'

export function authorize(...permissions: Permission[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {

        if (!req.user) throw new ApiError(401, 'Unauthorized.')

        const allowed = hasAnyPermission(req.user.permissions, permissions)

        if (!allowed) throw new ApiError(403, 'You do not have permission to access this resource.')

        next()
    }
}