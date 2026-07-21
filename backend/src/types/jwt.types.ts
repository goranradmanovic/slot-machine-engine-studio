import type { UserPermission } from "./user-permission.types.ts"

export interface JWTPayload {
    sub: number; // sub -> subject - It's the official JWT standard.
    sid: string; // sid -> Session ID
    username: string;
    email: string;
    permissions: UserPermission
}