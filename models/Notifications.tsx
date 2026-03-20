import mongoose, { models, Schema } from "mongoose";

const NotificationSchema = new Schema({
    studentId: { type: String, required: true },
    companyId: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, default: 'unread' }
}, { timestamps: true });

export const Notification = models.Notification || mongoose.model("Notification", NotificationSchema);