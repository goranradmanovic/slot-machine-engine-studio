import type { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/api-error.ts'
import type { ValidationSchema, ValidationRule } from '../types/validation.types.ts'

export function validate(schema: ValidationSchema) {

    return (req: Request, res: Response, next: NextFunction) => {

        const body = req.body

        for (const field in schema) {
            const rules: ValidationRule = schema[field]
            const value = body[field]

            // Required field
            if (rules.required && (value === undefined || value === null || value === '')) {
                return next(new ApiError(400, `${field} is required.`))
            }

            // Max length
            if (typeof value === 'string' && rules.minLength && value.length < rules.minLength) {
                return next(new ApiError(400, `${field} must contain at most ${rules.maxLength} characters`))
            }

            // Email
            if (rules.email && typeof value === 'string') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

                if (!emailRegex.test(value)) {
                    return next(new ApiError(400, 'Invalid email address.'))
                }
            }
        }

        next()
    }
}