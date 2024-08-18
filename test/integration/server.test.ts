import request from 'supertest'
import { application, Shutdown } from '../../src/main'
import mongoose from 'mongoose'
import { setupDatabase } from '../setup'

describe('Server', () => {
    beforeAll(async () => {
        await setupDatabase()
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
        const response = await request(application).get('/api/healthcheck')

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
            .post('/api/healthcheck')
            .send(payload)

        expect(response.body).toBeDefined()
        expect(response.body['hello']).toBe(payload.name)

        payload = { name: 'Otro' }

        response = await request(application)
            .post('/api/healthcheck')
            .send(payload)

        expect(response.body).toBeDefined()
        expect(response.body['hello']).toBe(payload.name)

        response = await request(application).post('/api/healthcheck')
        expect(response.status).toBe(422)
        expect(response.body['_original']).toBeDefined()
        expect(response.body.details).toBeDefined()
    }, 10000)
})
