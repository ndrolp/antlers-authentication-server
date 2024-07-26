import request from 'supertest'
import { application, Shutdown } from '../../src/main'

describe('Our Application', () => {
    afterAll(done => {
        Shutdown(done)
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
})
