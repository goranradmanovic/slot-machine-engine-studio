export interface RegisterFormValues {
    username: string;
    //firstName: string;
    //lastName: string;
    email: string;
    password: string;
}

export interface FormSubmitEvent {
    valid: boolean;
    values: Record<string, any>;
    errors: Record<string, any>;
}