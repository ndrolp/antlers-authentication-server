import request from 'supertest'
import { application, Shutdown } from '../../src/main'
import {
    connectDatabase,
    DatabaseOptions,
} from '../../src/core/config/database'
import dotenv from 'dotenv'
import path from 'path'
import mongoose from 'mongoose'

describe('Our Application', () => {
    beforeAll(async () => {
        const dotenvFile = path.join(__dirname, '..', '..', '.test.env')
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
    })

    afterAll(done => {
        Shutdown(done)
        mongoose.disconnect()
    })

    it('Starts and has the proper test environment', async () => {
        expect(process.env.NODE_ENV).toBe('test')
        expect(application).toBeDefined()
    }, 10000)

    it('Returns all options allowed to be called by users (http methods)', async () => {
        const response = await request(application).options('/')

        expect(response.status).toBe(200)
    }, 10000)

    it('The healthcheck route is working', async () => {
        const response = await request(application).get('/healthcheck')

        expect(response.status).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body['hello']).toBe('world')
    })

    it('The routeNotFound middleware is working', async () => {
        const response = await request(application).get(
            '/this/route/does/not/Exists',
        )

        expect(response.status).toBe(404)
        expect(response.body).toBeDefined()
        expect(response.body['error']).toBe('Route Not Found')
    })

    it('Test the post healthcheck route', async () => {
        let payload: { name: string; lastName?: string } = {
            name: 'Alejandro',
            lastName: 'prueba@email.com',
        }

        let response = await request(application)
            .post('/healthcheck')
            .send(payload)

        expect(response.body).toBeDefined()
        expect(response.body['hello']).toBe(payload.name)

        payload = { name: 'Otro' }

        response = await request(application).post('/healthcheck').send(payload)

        expect(response.body).toBeDefined()
        expect(response.body['hello']).toBe(payload.name)

        response = await request(application).post('/healthcheck')
        expect(response.status).toBe(422)
        expect(response.body['_original']).toBeDefined()
        expect(response.body.details).toBeDefined()
    }, 10000)
})
