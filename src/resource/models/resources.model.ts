import { model, Schema, Types } from 'mongoose'

interface IResource extends Document {
    name: string
    type: string
    application: Types.ObjectId // Reference to Application
}

const ResourceSchema = new Schema<IResource>({
    name: { type: String, required: true },
    type: { type: String, required: true },
    application: {
        type: Schema.Types.ObjectId,
        ref: 'Application',
        required: true,
    },
})

export const Resource = model<IResource>('Resource', ResourceSchema)
