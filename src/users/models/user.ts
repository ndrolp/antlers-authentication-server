import mongoose, { Schema, Document } from 'mongoose'
import { hash, verify } from 'argon2'

export interface IUser extends Document {
    username: string
    name: string
    lastName?: string
    email: string
    password: string
    validatePassword(password: string): Promise<boolean>
    setPassword(password: string): Promise<void>
}

export const userSchema = new Schema < IUser > (
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        lastName: { type: String, required: false },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    },
)

userSchema.methods.validatePassword = async function(
    password: string,
): Promise<boolean> {
    return await verify(this.password, password)
}

userSchema.methods.setPassword = async function(
    password: string,
): Promise<void> {
    this.password = await hash(password)
}

userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password
        return ret
    },
})

export const User = mongoose.model < IUser & Document > ('users', userSchema)
