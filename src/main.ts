import http from 'http'
import 'dotenv/config'
import express from 'express'
import { corsHandler } from './middlewares/corsHandler'
import { routeNotFound } from './middlewares/routeNotFound'
import logging from './config/logger'
import loggingHandler from './middlewares/loggingHandler'

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
    logging.info('Logging & Configuration')
    logging.info('-----------------------------------------')

    application.get('/main/healthcheck', (_req, res) => {
        return res.json({ hello: 'world' })
    })

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
