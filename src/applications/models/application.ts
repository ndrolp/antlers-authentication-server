import mongoose, { Document, Schema } from 'mongoose'
import { IRole } from 'users/models/roles'
import { IUser } from 'users/models/user'

export interface IApplication extends Document {
    name: string
    description: string
    roles: [IRole] | [string]
    users: [IUser] | [string]
}

export const applicationSchema = new Schema<IApplication>({
    users: [{ type: Schema.Types.ObjectId, ref: 'users', unique: false }],
    name: { type: String, required: true, unique: false },
    description: { type: String, required: false },
})

export const Application = mongoose.model<IApplication & Document>(
    'applications',
    applicationSchema,
)
