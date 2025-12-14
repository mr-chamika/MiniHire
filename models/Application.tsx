import mongoose, { models, Schema } from "mongoose";

const ApplicationSchema = new Schema({

    firstName: { type: String, required: true },
    marks: Number,
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    university: { type: String, required: true },
    degree: { type: String, required: true },
    portfolio: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    resume: { type: String, required: true },
    post_id: { type: String, required: true },
    status: { type: String, default: 'pending' }

}, { timestamps: true })

export const Application = models.Application || mongoose.model("Application", ApplicationSchema);