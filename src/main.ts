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

export const application = express()
export let httpServer: ReturnType<typeof http.createServer>

export const Main = () => {
    logging.info('-----------------------------------------')
    logging.info('Initializing API')
    logging.info('-----------------------------------------')

    application.use(express.urlencoded({ extended: true }))
    application.use(express.json())

    logging.info('-----------------------------------------')
    logging.info('Logging & Configuration')
    logging.info('-----------------------------------------')

    application.use(loggingHandler)
    application.use(corsHandler)

    logging.info('-----------------------------------------')
    logging.info('Define Routes')
    logging.info('-----------------------------------------')

    defineRoutes([MainController], application)

    logging.info('-----------------------------------------')
    logging.info('Logging & Configuration')
    logging.info('-----------------------------------------')
    application.use(routeNotFound)
    httpServer = http.createServer(application)
    httpServer.listen(5000, () => {
        logging.info('SERVER STARTED')
    })
}

export const Shutdown = (callback: (error?: Error) => void) =>
    httpServer && httpServer.close(callback)

Main()
