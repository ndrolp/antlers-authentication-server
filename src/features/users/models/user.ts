import { hash, verify } from 'argon2'
import { Schema, model, Document, Types } from 'mongoose'

// The schema for each application a user belongs to
export interface IUserApplication {
    application: Types.ObjectId // Reference to Application
    roles: Types.ObjectId[] // References to Role
}

export interface IUser extends Document {
    email: string
    username: string // Added username field
    name: string
    password: string
    applications: IUserApplication[]
    validatePassword(password: string): Promise<boolean>
    setPassword(password: string): Promise<void>
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true }, // Username is unique
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
