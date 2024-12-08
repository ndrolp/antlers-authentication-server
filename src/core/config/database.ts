import mongoose, { Mongoose } from 'mongoose'
import logger from './logger'

export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD
export const MONGO_URL = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}`
export const MONGO_DATABASE = process.env.MONGO_DATABASE
export const MONGO_OPTIONS: mongoose.ConnectOptions = {
    retryWrites: true,
    w: 'majority',
    authSource: 'admin',
}

export interface DatabaseOptions {
    MONGO_USER?: string
    MONGO_PASSWORD?: string
    MONGO_URL: string
    MONGO_DATABASE?: string
    MONGO_OPTIONS: mongoose.ConnectOptions
    MONGO_CONNECTION: string
}

export const mongo: DatabaseOptions = {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_URL,
    MONGO_DATABASE,
    MONGO_OPTIONS,
    MONGO_CONNECTION: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}`,
}

export const connectDatabase = async (
    options: DatabaseOptions = mongo,
): Promise<Mongoose | undefined> => {
    try {
        const connection = await mongoose.connect(
            options.MONGO_CONNECTION,
            options.MONGO_OPTIONS,
        )
        logger.info(`Mongo Database Connected: v${connection.version}`)
        return connection
    } catch (error) {
        logger.error('Database error')
        logger.error(error)
        return
    }
}
