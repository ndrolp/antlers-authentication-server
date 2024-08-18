import http from 'http'
import 'dotenv/config'
import express from 'express'
import { corsHandler } from './core/middlewares/corsHandler'
import { routeNotFound } from './core//middlewares/routeNotFound'
import logging from './core/config/logger'
import loggingHandler from './core/middlewares/loggingHandler'
import 'reflect-metadata'
import { defineRoutes } from './modules/routes'
import MainController from './core/controllers/MainController'
import { connectDatabase } from './core/config/database'
import UserController from 'users/controllers/user.controller'
import { AuthController } from 'auth/controllers/auth.controller'
import { createAdminUser } from 'users/libs/start'

export const application = express()
export let httpServer: ReturnType<typeof http.createServer>

export const Main = async () => {
    logging.info('-----------------------------------------')
    logging.info('Initializing API')
    logging.info('-----------------------------------------')

    application.use(express.json())
    application.use(express.urlencoded({ extended: true }))

    logging.info('-----------------------------------------')
    logging.info('Connect to Database')
    logging.info('-----------------------------------------')
    await connectDatabase()

    logging.info('-----------------------------------------')
    logging.info('Logging & Configuration')
    logging.info('-----------------------------------------')

    application.use(loggingHandler)
    application.use(corsHandler)
    await createAdminUser()

    logging.info('-----------------------------------------')
    logging.info('Setup Routes')
    logging.info('-----------------------------------------')

    defineRoutes([UserController, AuthController], application)
    defineRoutes([MainController], application, true, 0)

    application.use(routeNotFound)
    httpServer = http.createServer(application)
    httpServer.listen(5000, () => {
        logging.info('SERVER STARTED')
    })
}

export const Shutdown = (callback: (error?: Error) => void) =>
    httpServer && httpServer.close(callback)

Main()
