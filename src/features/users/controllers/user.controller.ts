import { Request, Response } from 'express'
import { Controller } from 'core/decorators/controller'
import { Route } from 'core/decorators/route'
import { Validate } from 'core/decorators/validate'
import { IUser, User } from 'features/users/models/user'
import { createUserValidation } from '../validators/users'
import { CreateUserBody } from '../dtos/users'
import { hash } from 'argon2'
import logger from 'core/config/logger'
import { Authenticate } from 'auth/decorators/authenticate'

export interface IUserFilter extends IUser {
    page: number
    limit: number
}

@Controller('/users')
export class UserController {
    @Route('post', '/')
    @Authenticate()
    @Validate(createUserValidation)
    async createUser(
        req: Request<object, object, CreateUserBody>,
        res: Response,
    ) {
        try {
            const password = await hash(req.body.password)
            req.body.password = password
            const newUser = new User(req.body)
            await newUser.save()
            logger.log(`User created: ${newUser.name}`)
            return res.status(201).json(newUser)
        } catch (error) {
            logger.error(error)
            return res.status(400).json(error)
        }
    }

    @Route('get', '/')
    @Authenticate()
    async getAllUsers(
        req: Request<object, object, object, { limit: string; page: string }>,
        res: Response,
    ) {
        try {
            const limit = parseInt(req.query.limit ?? 20)
            const skip = (parseInt(req.query.page ?? 1) - 1) * limit

            const count = await User.countDocuments()
            const users = await User.find()
                .sort('username')
                .limit(limit)
                .skip(skip)
                .populate({
                    path: 'applications.application', // Populate the application itself (reference to Application model)
                })
                .populate({
                    path: 'applications.roles', // Populate roles for each application
                    select: 'name permissions', // You can specify which fields to return from Role
                    populate: {
                        path: 'permissions', // Populate the permissions for each role
                    },
                })
            return res.json({ data: users, count })
        } catch (error) {
            logger.error(error)

            return res.status(400).json(error)
        }
    }
}

export default UserController
