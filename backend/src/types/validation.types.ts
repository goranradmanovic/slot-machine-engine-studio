export interface ValidationRule {
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    email?: boolean
}

export type ValidationSchema = Record<string, ValidationRule>