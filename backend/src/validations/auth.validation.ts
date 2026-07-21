import type { ValidationSchema } from '../types/validation.types.ts'

export const registerSchema: ValidationSchema = {
    username: {
        required: true,
        minLength: 3,
        maxLength: 30
    },

    email: {
        required: true,
        email: true
    },

    password: {
        required: true,
        minLength: 8,
        maxLength: 100
    },

    /*firstName: {
        required: true,
        minLength: 3,
        maxLength: 30
    },

    lastName: {
        required: true,
        minLength: 3,
        maxLength: 30
    }*/
}

export const loginSchema: ValidationSchema = {
    email: {
        required: true,
        email: true
    },

    password: {
        required: true,
        minLength: 8
    },

    rememberMe: {
        required: false
    }
}

export const changePasswordSchema = {
    oldPassword: {
        required: true,
        minLength: 8
    },
    
    newPassword: {
        required: true,
        minLength: 8
    },

    confirmPassword: {
        required: true,
        equals: 'newPassword'
    }
}

export const forgotPasswordSchema = {
    email: {
        required: true,
        email: true
    }
}

export const resetPasswordSchema = {
    token: {
        required: true,
    },

    password: {
        required: true,
        minLength: 8
    },

    confirmPassword: {
        required: true,
        equals: 'password'
    }
}