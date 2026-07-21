export interface UserDto {
    id: number;
    username: string;
    firstName: string | null,
    lastName: string | null,
    email: string,
    permissions: string[]
}