import mongoose, { models, ObjectId, Schema } from "mongoose";

const ApplicationSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    university: { type: String, required: true },
    degree: { type: String, required: true },
    portfolio: { type: String, required: true },
    linkedin: { type: String, required: true },
    resume: { type: String, required: true },
    post_id: { type: String, required: true },
    status: { type: String, default: 'pending' }

}, { timestamps: true })

export const Application = models.Application || mongoose.model("Application", ApplicationSchema);