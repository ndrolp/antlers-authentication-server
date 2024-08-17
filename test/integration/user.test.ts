import mongoose from 'mongoose'
import { setupDatabase } from '../setup'

describe('Users', () => {
    beforeAll(async () => await setupDatabase())
    afterAll(async () => await mongoose.disconnect())

    it('Test file', () => {
        expect(2).toBe(2)
    })
})
