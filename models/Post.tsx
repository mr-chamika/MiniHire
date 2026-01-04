import mongoose, { models, Schema } from "mongoose";

const PostSchema = new Schema({

    createdBy: { type: String, required: true },
    companyName: { type: String, required: true },
    companyAddress: String,
    creatorName: { type: String, required: true },
    role: { type: String, required: true },//SE or QA or etc
    contactNumber: { type: String, required: true },
    vacancies: { type: Number, required: true },//number of vacancies offering
    recruited: { type: Number, default: 0 },
    type: { type: String, required: true },//onsite,hybrid,remote
    period: { type: String, required: true },//6 months or 1 year
    description: String,
    jd: { type: String, required: true },//job description image
    status: { type: String, default: "show" }//is post hidden or not

}, { timestamps: true })

export const Post = models.Post || mongoose.model("Post", PostSchema);