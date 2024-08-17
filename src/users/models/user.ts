import mongoose, { Schema, Document } from 'mongoose'
import { verify } from 'argon2'

interface IUser extends Document {
    username: string
    name: string
    lastName?: string
    email: string
    password: string
    validatePassword(password: string): Promise<boolean>
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

userSchema.set('toJSON', {
    transform: (_doc, ret) => {
        delete ret.password
        return ret
    },
})

export const User = mongoose.model < IUser & Document > ('users', userSchema)
