import mongoose, { models, Schema } from "mongoose";

const CompanySchema = new Schema({

    name: { type: String, required: true },
    role: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    website: { type: String, required: true },
    linkedin: { type: String, required: true },
    logo: { type: String, required: true },
    otp: String,
    expires: Date,
    verified: { type: Boolean, default: false }

}, { timestamps: true })

export const Company = models.Company || mongoose.model("Company", CompanySchema);