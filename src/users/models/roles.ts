import mongoose, { Schema } from 'mongoose'
// import { IUser } from './user'

export interface IRole extends Document {
    // users: IUser[]
    name: string
    label: string
    description: string
}

export const roleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: false },
    description: { type: String, required: true, unique: false },
})

export const Roles = mongoose.model<IRole>('roles', roleSchema)
