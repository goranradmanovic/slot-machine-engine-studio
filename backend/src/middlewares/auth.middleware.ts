import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/api-error.ts'
import { verifyAccessToken } from '../utils/jwt.ts'


export function authenticate(req: Request, res: Response, next: NextFunction) {
    
    const authorization = req.headers.authorization
    
    if (!authorization) {
        return next(new ApiError(401, 'Authorization header missing.'))
    }
        
    const [type, token] = authorization.split(' ')

    if (type !== 'Bearer' || !token) {
        return next(new ApiError(401, 'Invalid authorization header.'))
    }

    try {
        req.user = verifyAccessToken(token)
        next()
    } catch {
        next(new ApiError(401, 'Invalid access token.'))
    }
}