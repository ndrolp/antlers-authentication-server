import logger from 'core/config/logger'
import { Controller } from 'core/decorators/controller'
import { Route } from 'core/decorators/route'
import { Validate } from 'core/decorators/validate'
import { Request, Response } from 'express'
import Joi from 'joi'
import { User } from 'features/users/models/user'
import jwt from 'jsonwebtoken'

export type TUser = {
    _id: string
    username: string
    email: string
    name: string
}

export interface TokenData {
    iat: string
    exp: string
    user: TUser
}
const TOKEN_DURATION = '15min'

const loginCreateValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
})
const refreshValidation = Joi.object({
    refresh: Joi.string().required(),
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
            if (!user)
                return res.status(401).json({ msg: 'Invalid credentials' })
            const valid = await user?.validatePassword(req.body.password)
            if (!valid)
                return res.status(401).json({ msg: 'Invalid credentials' })

            //TODO: Implement PRIVATE and PUBLIC KEYS
            const token = jwt.sign({ user }, 'ASD', {
                expiresIn: TOKEN_DURATION,
            })
            const refresh = jwt.sign({ user }, 'ASD', { expiresIn: '7d' })

            return res.status(200).json({ token, refresh })
        } catch (error) {
            logger.error(error)
            return res.status(400).json(error)
        }
    }

    @Route('post', '/refresh')
    @Validate(refreshValidation)
    async refresh(
        req: Request<object, object, { refresh: string }>,
        res: Response,
    ) {
        try {
            const data = jwt.verify(req.body.refresh, 'ASD') as { user: TUser }
            logger.warn(data)
            const user = await User.findOne({ username: data.user.username })
            const token = jwt.sign({ user }, 'ASD', {
                expiresIn: TOKEN_DURATION,
            })
            return res.status(200).json({ token })
        } catch (error) {
            return res.status(400).json({ error, body: req.body })
        }
    }
}
