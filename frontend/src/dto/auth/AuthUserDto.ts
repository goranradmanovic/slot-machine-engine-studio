export interface AuthUserDto {
    id: number;
    username: string;
    email: string;
    roles: string[];
    permissions: string[];
}