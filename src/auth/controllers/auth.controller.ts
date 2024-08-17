import logging from 'core/config/logger'
import { Controller } from 'core/decorators/controller'
import { Route } from 'core/decorators/route'
import { Validate } from 'core/decorators/validate'
import { Request, Response } from 'express'
import Joi from 'joi'
import { User } from 'users/models/user'

const loginCreateValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

@Controller('/auth')
export class AuthController {
    @Route('post', '/login')
    @Validate(loginCreateValidation)
    async login(
        req: Request<object, object, { username: string; password: string }>,
        res: Response,
    ) {
        try {
            const user = await User.findOne({ username: req.body.username })
            const valid = await user?.validatePassword(req.body.password)
            if (!valid)
                return res.status(401).json({ msg: 'Invalid credentials' })

            return res.status(200).json(user)
        } catch (error) {
            logging.error(error)
            return res.status(400).json(error)
        }
    }
}
