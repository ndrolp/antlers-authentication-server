import { Schema, model, Document, Types } from 'mongoose'

interface IApplication extends Document {
    name: string
    owner: Types.ObjectId // Reference to User (owner of the application)
}

const ApplicationSchema = new Schema<IApplication>({
    name: { type: String, required: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

export const Application = model<IApplication>('Application', ApplicationSchema)
