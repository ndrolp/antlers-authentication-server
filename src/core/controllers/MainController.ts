import { Request, Response } from 'express'
import logger from '../config/logger'
import Controller from '../decorators/controller'
import { Route } from '../decorators/route'
import Joi from 'joi'
import { Validate } from '../decorators/validate'

const postHealthCheckValidation = Joi.object({
    name: Joi.string().required(),
    lastName: Joi.string(),
})

@Controller('')
class MainController {
    @Route('get', '/healthcheck')
    getHealthCheck(_req: Request, res: Response) {
        logger.info('Healthcheck called successfully')
        return res.json({ hello: 'world' })
    }

    @Route('post', '/healthcheck')
    @Validate(postHealthCheckValidation)
    postHealthCheck(req: Request, res: Response) {
        logger.info('Healthcheck called successfully')
        return res.json({ hello: req.body.name, lastName: req.body.lastName })
    }
}

export default MainController
