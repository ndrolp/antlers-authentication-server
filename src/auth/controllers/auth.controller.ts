// import { Authenticate } from 'auth/decorators/authenticate'
import logging from 'core/config/logger'
import { Controller } from 'core/decorators/controller'
import { Route } from 'core/decorators/route'
import { Validate } from 'core/decorators/validate'
import { Request, Response } from 'express'
import Joi from 'joi'
import { User } from 'users/models/user'
import jwt from 'jsonwebtoken'

const loginCreateValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})

@Controller('/auth')
export class AuthController {
    @Route('post', '/login')
    @Validate(loginCreateValidation)
    // @Authenticate()
    async login(
        req: Request<object, object, { username: string; password: string }>,
        res: Response,
    ) {
        try {
            const user = await User.findOne({ username: req.body.username })
            if (!user)
                return res.status(401).json({ msg: 'Invalid credentials' })
            const valid = await user?.validatePassword(req.body.password)
            if (!valid)
                return res.status(401).json({ msg: 'Invalid credentials' })

            const token = jwt.sign({ user: user?.username }, 'ASD', {
                expiresIn: '15min',
            })
            const refresh = jwt.sign({ user }, 'ASD', { expiresIn: '7d' })

            return res.status(200).json({ token, refresh })
        } catch (error) {
            logging.error(error)
            return res.status(400).json(error)
        }
    }
}
