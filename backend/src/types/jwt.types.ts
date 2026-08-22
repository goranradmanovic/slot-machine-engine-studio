import type { Permission } from "../enums/permission.enum.ts"

export interface JWTPayload {
    sub: number; // sub -> subject - It's the official JWT standard.
    sid: string; // sid -> Session ID
    username: string;
    email: string;
    permissions: Permission[]
}