export interface RegisterFormValues {
    username: string;
    email: string;
    password: string;
}

export interface FormSubmitEvent {
    valid: boolean;
    values: Record<string, any>;
    errors: Record<string, any>;
    reset: unknown;
}

export interface FullNameFormValues {
    firstName: string;
    lastName: string;
    id: number;
}