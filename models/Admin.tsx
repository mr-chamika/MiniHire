import mongoose, { models, Schema } from "mongoose";

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' }
}, { timestamps: true });

export const Admin = models.Admin || mongoose.model("Admin", AdminSchema);