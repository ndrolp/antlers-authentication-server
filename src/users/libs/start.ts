import { User } from 'users/models/user'
import logger from 'core/config/logger'

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
