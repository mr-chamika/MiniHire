import mongoose, { models, Schema } from "mongoose";

const PostSchema = new Schema({

    companyName: { type: String, required: true },
    companyAddress: String,
    creatorName: { type: String, required: true },
    role: { type: String, required: true },//SE or QA or etc
    contactNumber: { type: String, required: true },
    vacancies: { type: Number, required: true },//number of vacancies offering
    type: { type: String, required: true },//onsite,hybrid,remote
    period: { type: String, required: true },//6 months or 1 year
    description: String,
    country: { type: String, required: true },//which country's interns looking for?

}, { timestamps: true })

export const Post = models.Post || mongoose.model("Post", PostSchema);