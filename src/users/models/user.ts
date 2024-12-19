import { hash, verify } from 'argon2'
import { Schema, model, Document, Types } from 'mongoose'

// The schema for each application a user belongs to
export interface IUserApplication {
    application: Types.ObjectId // Reference to Application
    roles: Types.ObjectId[] // Array of Roles within that application
}

export interface IUser extends Document {
    username: string
    email: string
    name: string
    password: string
    applications: IUserApplication[]
    validatePassword(password: string): Promise<boolean>
    setPassword(password: string): Promise<void>
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    applications: [
        {
            application: {
                type: Schema.Types.ObjectId,
                ref: 'Application',
                required: true,
            },
            roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
        },
    ],
})

UserSchema.methods.validatePassword = async function (
    password: string,
): Promise<boolean> {
    return await verify(this.password, password)
}

UserSchema.methods.setPassword = async function (
    password: string,
): Promise<void> {
    this.password = await hash(password)
}

UserSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password
        return ret
    },
})

export const User = model<IUser>('User', UserSchema)
