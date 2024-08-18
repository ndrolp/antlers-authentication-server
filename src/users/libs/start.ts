import { User } from 'users/models/user'
import logger from 'core/config/logger'

export async function createAdminUser(): Promise<boolean> {
    try {
        const currentAdmin = await User.findOne({ username: 'admin' })
        if (currentAdmin) {
            logger.info('Admin user already exists')
            return true
        }

        const newAdmin = new User({
            name: 'Admin',
            username: 'admin',
            email: 'admin@admin.com',
        })

        await newAdmin.setPassword('admin')
        await newAdmin.save()
        logger.info('Admin User Created')

        return true
    } catch (error) {
        logger.error(error)
        return false
    }
}
