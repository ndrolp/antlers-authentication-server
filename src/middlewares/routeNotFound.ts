import { Request, Response } from 'express'
import logging from '../config/logger'

export function routeNotFound(_req: Request, res: Response) {
    const err = new Error('Route Not Found')

    logging.error(err.message)

    return res.status(404).json({ err: err.message })
}
