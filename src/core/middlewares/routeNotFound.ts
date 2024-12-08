import { Request, Response } from 'express'
import logger from '../config/logger'

export function routeNotFound(_req: Request, res: Response) {
    const err = new Error('Route Not Found')

    logger.error(err.message)

    return res.status(404).json({ error: err.message })
}
