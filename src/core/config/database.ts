import mongoose, { Mongoose } from 'mongoose'
import logging from './logger'

export const MONGO_USER = process.env.MONGO_USER
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD
export const MONGO_URL = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}`
export const MONGO_DATABASE = process.env.MONGO_DATABASE
export const MONGO_OPTIONS: mongoose.ConnectOptions = {
    retryWrites: true,
    w: 'majority',
    authSource: 'admin',
}

export const mongo = {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_URL,
    MONGO_DATABASE,
    MONGO_OPTIONS,
    MONGO_CONNECTION: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}`,
}

//admin@localhost:27017/

export const connectDatabase = async (): Promise<Mongoose | undefined> => {
    try {
        const connection = await mongoose.connect(
            mongo.MONGO_CONNECTION,
            mongo.MONGO_OPTIONS,
        )
        logging.info(`Mongo Database Connected: v${connection.version}`)
        return connection
    } catch (error) {
        logging.error('Database error')
        logging.error(error)
        return
    }
}
