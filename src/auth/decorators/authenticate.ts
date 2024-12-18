import { NextFunction, Request, Response } from 'express'
import logger from 'core/config/logger'
import { IUser, User } from 'features/users/models/user'
import jwt from 'jsonwebtoken'
import { TUser } from 'auth/controllers/auth.controller'

export type Roles = 'admin' | 'user' | 'manger'

declare global {
    namespace Express {
        interface Request {
            user: IUser | undefined
        }
    }
}

/**
 * Decorator for express routes that validates the auth token and adds the user of the token
 * to the **request.user**
 *
 */
export function Authenticate() {
    return function (
        _target: object,
        _propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value

        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction,
        ) {
            try {
                const authorization = req.headers.authorization
                if (!authorization)
                    return res
                        .status(401)
                        .json({ msg: 'No authorization token provided' })

                const data = jwt.verify(authorization.split(' ')[1], 'ASD') as {
                    user: TUser
                }
                logger.log(data.user)
                req.user =
                    (await User.findOne({ username: data.user.username })) ??
                    undefined
                if (!req.user)
                    return res.status(401).json({ msg: 'Invalid User' })
            } catch (error) {
                if (error.name?.startsWith('JsonWebToken'))
                    return res.status(401).json(error)
                logger.error(error)
                return res.status(400).json(error)
            }

            return originalMethod.call(this, req, res, next)
        }

        return descriptor
    }
}
