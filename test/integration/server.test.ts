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
    })
})
