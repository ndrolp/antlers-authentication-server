import { Request, Response } from 'express'
import { Controller } from 'core/decorators/controller'
import { Route } from 'core/decorators/route'
import { Validate } from 'core/decorators/validate'
import { User } from 'users/models/user'
import { createUserValidation } from '../validators/users'
import { CreateUserBody } from '../dtos/users'
import { hash } from 'argon2'
import logging from 'core/config/logger'
import { Authenticate } from 'auth/decorators/authenticate'

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
            logging.log(`User created: ${newUser.name}`)
            return res.status(201).json(newUser)
        } catch (error) {
            logging.error(error)
            return res.status(400).json(error)
        }
    }
}

export default UserController
