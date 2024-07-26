import { Request, Response } from 'express'
import logging from '../config/logger'
import Controller from '../decorators/controller'
import { Route } from '../decorators/route'

@Controller('')
class MainController {
    @Route('get', '/healthcheck')
    getHealthCheck(_req: Request, res: Response) {
        logging.info('Healthcheck called successfully')
        return res.json({ hello: 'world' })
    }
}

export default MainController
