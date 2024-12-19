import mongoose from 'mongoose'
import { Shutdown } from '../../src/main'
import { setupDatabase, cleanDatabase } from '../setup'
import {
    createAdminUser,
    // createSkullApplication,
} from 'features/users/libs/start'
import { User } from 'features/users/models/user'
import { Application } from 'features/applications/models/application'

describe('Startup Server', () => {
    beforeAll(async () => {
        await setupDatabase()
        await cleanDatabase()
    })

    afterAll(done => {
        Shutdown(done)
        mongoose.disconnect()
    })

    it('Create Admin User', async () => {
        const created = await createAdminUser()
        const user = await User.findOne({ username: 'admin' })

        expect(created.status).toBe(true)
        expect(created.message).toBe('CREATED')
        expect(user).toBeDefined()
        expect(user?.password).toBeDefined()
        expect(user?.username).toBe('admin')
    })

    it('Create After Existing', async () => {
        const created = await createAdminUser()
        const user = await User.findOne({ username: 'admin' })

        expect(created.status).toBe(true)
        expect(created.message).toBe('EXISTENT')
        expect(user).toBeDefined()
        expect(user?.password).toBeDefined()
        expect(user?.username).toBe('admin')
    })

    // it('Create skull application', async () => {
    //     const created = await createSkullApplication()
    //     const application = await Application.findOne({ name: 'Skull' })
    //
    //     expect(created.status).toBe(true)
    //     expect(created.message).toBe('CREATED')
    //     expect(application).toBeDefined()
    // })

    it('Create existent skull application', async () => {
        const created = await createAdminUser()
        const application = await Application.findOne({ name: 'Skull' })

        expect(created.status).toBe(true)
        expect(created.message).toBe('EXISTENT')
        expect(application).toBeDefined()
    })
})
