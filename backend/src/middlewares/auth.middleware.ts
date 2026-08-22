import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/api-error.ts'
import { verifyAccessToken } from '../utils/jwt.ts'
import { parsePermissions } from '../utils/permission.ts'

export function authenticate(req: Request, res: Response, next: NextFunction) {
    
    const authorization = req.headers.authorization
    
    if (!authorization) {
        return next(new ApiError(401, 'Unauthorized'))
    }
        
    const [type, token] = authorization.split(' ')

    if (type !== 'Bearer' || !token) {
        return next(new ApiError(401, 'Unauthorized'))
    }

    try {
        const payload = verifyAccessToken(token)
        req.user = {
            ...payload,
            permissions: parsePermissions(payload.permissions)
        }
        next()
    } catch {
        next(new ApiError(401, 'Unauthorized'))
    }
}