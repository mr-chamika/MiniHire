import mongoose, { models, Schema } from "mongoose";

const StudentSchema = new Schema({

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    university: { type: String, required: true },
    degree: { type: String, required: true },
    portfolio: { type: String, required: true },
    linkedin: { type: String, required: true },
    resume: { type: String, required: true },
    otp: String,
    expires: Date,
    verified: { type: Boolean, default: false }

}, { timestamps: true })

export const Student = models.Student || mongoose.model("Student", StudentSchema);