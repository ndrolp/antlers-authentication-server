import { model, Schema } from 'mongoose'
// import { IUser } from './user'
interface IRole extends Document {
    name: string // Role name, e.g., 'admin', 'viewer'
    application: Schema.Types.ObjectId // Reference to Application
    permissions: Schema.Types.ObjectId[] // Array of Permissions within this role
}

const RoleSchema = new Schema<IRole>({
    name: { type: String, required: true },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
    },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
})

export const Role = model<IRole>('Role', RoleSchema)
