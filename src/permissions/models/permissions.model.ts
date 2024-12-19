import { model, Schema, Types } from 'mongoose'

interface IPermission extends Document {
    action: string // e.g., 'read', 'write', 'delete'
    resource: Types.ObjectId // Reference to Resource
    application: Types.ObjectId // Reference to Application
}

const PermissionSchema = new Schema<IPermission>({
    action: { type: String, required: true },
    resource: { type: Schema.Types.ObjectId, ref: 'Resource', required: true },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
    },
})

export const Permission = model<IPermission>('Permission', PermissionSchema)
