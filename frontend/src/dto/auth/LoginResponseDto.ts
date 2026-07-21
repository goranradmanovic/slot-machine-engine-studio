import type { UserDto } from '../users/UserDto.ts'

export interface LoginResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
}