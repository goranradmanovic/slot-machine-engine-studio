import type { Request, Response } from 'express'
import { Permission } from '../../../enums/permission.enum.ts'
import { UserService } from '../../../services/user.service.ts'
import type { UpdateUserPermissionsDto, UpdateFirstLastNameDto, UserPatchPayloadDto } from '../../../types/user.types.ts'
import { ApiResponse } from '../../../utils/api-response.ts'
import { ApiError } from '../../../utils/api-error.ts'

export class UserController {

    static async getPermissions(req: Request, res: Response): Promise<void> {
        const userId = Number(req.params.id)

        const permissions = await UserService.getPermissions(userId)

        res.json(
            new ApiResponse(true, 'Available user permissions.', permissions)
        )
    }

    static async updatePermissions(req: Request, res: Response): Promise<void> {
        const userId = Number(req.params.id)

        const dto = req.body as UpdateUserPermissionsDto

        await UserService.updatePermissions(userId, dto.permissions)

        res.json(
            new ApiResponse(true, 'Permissions updated successfully.')
        )
    }

    static async getAvailablePermissions(req: Request, res: Response): Promise<void> {
        res.json(
            new ApiResponse(true, 'All available permissions.', Object.values(Permission))
        )
    }

    static async updateUser(req: Request, res: Response): Promise<void> {
        const dto = req.body as UserPatchPayloadDto

        if (!dto) throw new ApiError(400, 'First name and Last name are required.')
        
        const userId = Number(req.body.id)
        const { id, ...fieldsToUpdate } = dto

        const user = await UserService.updateUser(userId, fieldsToUpdate as UserPatchPayloadDto)

        res.json(
            new ApiResponse(true, 'User updated.', user)
        )
    }

    static async getUsers(req: Request, res: Response): Promise<void> {
        const users = await UserService.getUsers()

        res.json(
            new ApiResponse(true, 'All users retrieved.', users)
        )
    }

    static async deleteUserById(req: Request, res: Response): Promise<void> {
        const userId = Number(req.params.id)

        await UserService.deleteUserById(userId)

        res.json(
            new ApiResponse(true, 'User deleted successfully.')
        )
    }
}