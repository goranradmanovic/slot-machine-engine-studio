import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/api-error.ts'

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ success: false, message: err.message })
    }

    console.log(err)

    return res.status(500).json({ success: false, messaage: 'Internal Server Error' })
}
