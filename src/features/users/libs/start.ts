import { User } from 'features/users/models/user'
import logger from 'core/config/logger'
import { Application } from 'features/applications/models/application'

interface CreateAdminReturn {
    status: boolean
    message: 'CREATED' | 'EXISTENT' | 'ERROR'
}

export async function createAdminUser(): Promise<CreateAdminReturn> {
    try {
        const currentAdmin = await User.findOne({ username: 'admin' })
        if (currentAdmin) {
            logger.info('Admin user already exists')
            return { status: true, message: 'EXISTENT' }
        }

        const newAdmin = new User({
            name: 'Admin',
            username: 'admin',
            email: 'admin@admin.com',
        })

        await newAdmin.setPassword('admin')
        await newAdmin.save()
        logger.info('Admin User Created')

        return { status: true, message: 'CREATED' }
    } catch (error) {
        logger.error(error)
        return { status: false, message: 'ERROR' }
    }
}

interface CreateAdminReturn {
    status: boolean
    message: 'CREATED' | 'EXISTENT' | 'ERROR'
}

export async function createSkullApplication(): Promise<CreateAdminReturn> {
    try {
        const currentApplication = await Application.findOne({
            name: 'Skull',
        })
        if (currentApplication) {
            logger.info('Application already exists')
            return { status: true, message: 'EXISTENT' }
        }

        const newApplication = new Application({
            name: 'Skull',
            description: 'The base skull application',
        })

        await newApplication.save()

        logger.info('Application Skull Created')

        return { status: true, message: 'CREATED' }
    } catch (error) {
        logger.error(error)
        return { status: false, message: 'ERROR' }
    }
}

export async function bindSkullToAdmin() {
    try {
        const app = await Application.findOne({ name: 'Skull' })
        const user = await User.findOne({ username: 'admin' })

        console.log({ app, user })
        if (!app || !user) return false

        console.log({ USER: user._id })
        app.save()

        return true
    } catch (error) {
        return false
    }
}
