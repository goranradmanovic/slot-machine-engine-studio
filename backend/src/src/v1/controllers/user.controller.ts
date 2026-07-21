import type { Request, Response } from 'express'
import { Permission } from '../../../enums/permission.enum.ts'
import { UserService } from '../../../services/user.service.ts'
import type { UpdateUserPermissionsDto } from '../../../types/user.types.ts'
import { ApiResponse } from '../../../utils/api-response.ts'

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

    static async updateUserFullName(req: Request, res: Response): Promise<void>  {
        const userId = Number(req.body.id)
        const firstName = String(req.body.firstName)
        const lastName = String(req.body.lastName)

        const user = await UserService.updateUserFullName(userId, firstName, lastName)

        res.json(
            new ApiResponse(true, 'User full name updated.', user)
        )
    }
}