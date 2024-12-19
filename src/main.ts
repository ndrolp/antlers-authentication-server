import http from 'http'
import 'dotenv/config'
import express from 'express'
import { corsHandler } from './core/middlewares/corsHandler'
import { routeNotFound } from './core//middlewares/routeNotFound'
import logger from './core/config/logger'
import loggingHandler from './core/middlewares/loggingHandler'
import 'reflect-metadata'
import { defineRoutes } from './modules/routes'
import MainController from './core/controllers/MainController'
import { connectDatabase } from './core/config/database'
import UserController from 'features/users/controllers/user.controller'
import { AuthController } from 'auth/controllers/auth.controller'
import {
    // bindSkullToAdmin,
    createAdminUser,
    // createSkullApplication,
} from 'features/users/libs/start'
import { server } from 'core/config/general'

export const application = express()
export let httpServer: ReturnType<typeof http.createServer>

export const Main = async () => {
    logger.info('-----------------------------------------')
    logger.info('Initializing API')
    logger.info('-----------------------------------------')

    application.use(express.json())
    application.use(express.urlencoded({ extended: true }))

    logger.info('-----------------------------------------')
    logger.info('Connect to Database')
    logger.info('-----------------------------------------')
    await connectDatabase()

    logger.info('-----------------------------------------')
    logger.info('Logging & Configuration')
    logger.info('-----------------------------------------')

    application.use(loggingHandler)
    application.use(corsHandler)
    await createAdminUser()
    // await createSkullApplication()
    // await bindSkullToAdmin()

    logger.info('-----------------------------------------')
    logger.info('Setup Routes')
    logger.info('-----------------------------------------')

    defineRoutes([UserController, AuthController], application)
    defineRoutes([MainController], application, true, 0)

    application.use(routeNotFound)
    httpServer = http.createServer(application)
    httpServer.listen(server.SERVER_HOST_PORT ?? 5000, () => {
        logger.info(`SERVER STARTED ON ${server.SERVER_HOST_PORT}`)
    })
}

export const Shutdown = (callback: (error?: Error) => void) =>
    httpServer && httpServer.close(callback)

Main()
