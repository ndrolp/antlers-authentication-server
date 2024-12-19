import { Application } from '../src/features/applications/models/application'
import { connectDatabase, DatabaseOptions } from '../src/core/config/database'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { User } from 'features/users/models/user'
export async function setupDatabase() {
    const dotenvFile = path.join(__dirname, '..', '.test.env')
    dotenv.configDotenv({ path: dotenvFile })
    const MONGO_USER = process.env.MONGO_USER
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD
    const MONGO_URL = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}`
    const MONGO_DATABASE = process.env.MONGO_DATABASE
    const MONGO_OPTIONS: mongoose.ConnectOptions = {
        retryWrites: true,
        w: 'majority',
        authSource: 'admin',
    }
    const mongo: DatabaseOptions = {
        MONGO_USER,
        MONGO_PASSWORD,
        MONGO_URL,
        MONGO_DATABASE,
        MONGO_OPTIONS,
        MONGO_CONNECTION: `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}`,
    }
    await connectDatabase(mongo)
}

export async function cleanDatabase() {
    await User.deleteMany()
    await Application.deleteMany()
}
