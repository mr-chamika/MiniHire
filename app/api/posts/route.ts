import { Application } from "@/models/Application";
import { Database } from "@/db";
import { Post } from "@/models/Post";
import { Student } from "@/models/Student";
import { put } from "@vercel/blob";

export async function POST(req: Request) {

    await Database();
    const formData = await req.formData()

    if (formData.has("creatorName")) {//job post creating logic

        const createdBy = formData.get("createdBy");
        const companyName = formData.get("companyName");
        const contactNumber = formData.get("contactNumber");
        const companyAddress = formData.get("companyAddress");
        const creatorName = formData.get("creatorName");
        const vacancies = formData.get("vacancies");
        const role = formData.get("role");
        const type = formData.get("type");
        const period = formData.get("period");
        const file = formData.get("jd") as File;
        const description = formData.get("description");

        if (!createdBy || !companyName || !contactNumber || !companyAddress || !creatorName || !vacancies || !role || !type || !period || !file || !description) {

            return Response.json({ error: 'All fields are required' });

        }

        //convert cv to byte sequence and save it in blob storage in vercel
        const buffer = Buffer.from(await file.arrayBuffer());
        const blob = await put(file.name, buffer, { access: 'public', addRandomSuffix: true, contentType: file.type })

        const newpost = await Post.create({

            createdBy,
            companyName,
            contactNumber,
            companyAddress,
            creatorName,
            vacancies,
            role,
            type,
            period,
            jd: blob.url,
            description

        })

        if (!newpost) {

            return Response.json({ message: "Check your connnection. Failed to create Job Post." });

        }

        return Response.json({ message: "Job Post Created Successfully" });


    }

}

export async function GET(req: Request) {

    await Database();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("by");
    const to = searchParams.get("to");
    const email = searchParams.get("saved");
    const _id = searchParams.get("id");

    if (userId) {

        const postSet = await Post.find({ createdBy: userId });

        if (!postSet) {

            return Response.json([]);

        }

        return Response.json(postSet);

    } else if (to?.includes("toStudents")) {

        const email = to.split(" ")[1];

        const rejected = await Application.find({ $and: [{ email: email }, { status: "rejected" }] }).distinct("post_id");

        const postSet = await Post.find({ _id: { $nin: rejected }, $expr: { $ne: ["$vacancies", "$recruited"] }, status: "show" }, "_id companyName contactNumber role type period description createdAt");

        if (!postSet) {

            return Response.json([]);

        }

        return Response.json(postSet);

    } else if (email) {

        const student = await Student.findOne({ email });

        const postSet = await Post.find({ _id: { $in: student.saved } });

        if (!postSet) {

            return Response.json([]);

        }

        return Response.json({ postSet, saved: student.saved });

    } else if (_id) {

        const post = await Post.findOne({ _id });

        if (!post) {

            return Response.json({ message: 'No such post exists' });

        }


        return Response.json({ jd: post.jd });

    }
}

export async function PUT(req: Request) {

    await Database();

    const formData = await req.formData();

    const _id = formData.get("id");
    const email = formData.get("email");

    if (_id && email) {

        const student = await Student.findOne({ email });

        if (!student) {

            return Response.json({ message: 'No such student exists' });

        }

        const post = await Post.findOne({ _id });

        if (!post) {

            return Response.json({ message: 'No such post exists' });

        }

        const isExists = student.saved.includes(_id);

        if (isExists) {

            student.saved.pull(_id);

        } else {

            student.saved.addToSet(_id);

        }


        await student.save();


        return Response.json({ done: 'true' });

    } else if (formData.has("action") && formData.get("action") === "update") {

        const post = await Post.findOne({ _id: formData.get("_id") });

        if (!post) {
            return Response.json({ error: 'Post not found' });
        }

        if (formData.has("companyAddress") && formData.get("companyAddress") !== post.companyAddress) post.companyAddress = formData.get("companyAddress");
        if (formData.has("creatorName") && formData.get("creatorName") !== post.creatorName) post.creatorName = formData.get("creatorName");
        if (formData.has("role") && formData.get("role") !== post.role) post.role = formData.get("role");
        if (formData.has("type") && formData.get("type") !== post.type) post.type = formData.get("type");
        if (formData.has("period") && formData.get("period") !== post.period) post.period = formData.get("period");
        if (formData.has("vacancies") && Number(formData.get("vacancies")) !== post.vacancies) post.vacancies = Number(formData.get("vacancies"));
        if (formData.has("description") && formData.get("description") !== post.description) post.description = formData.get("description");

        if (formData.has("jd")) {
            const file = formData.get("jd") as File;

            const currentJdFilename = post.jd ? post.jd.split('/').pop()?.split('?')[0] : null;
            if (!currentJdFilename || file.name !== currentJdFilename) {

                const buffer = Buffer.from(await file.arrayBuffer());
                const blob = await put(file.name, buffer, { access: 'public', addRandomSuffix: true, contentType: file.type });
                post.jd = blob.url;

            }
        }

        await post.save();
        return Response.json({ message: 'Post updated successfully' });

    } else if (formData.has("action") && formData.get("action") === "toggle_hide") {

        const post = await Post.findOne({ _id: formData.get("_id") });

        if (!post) {
            return Response.json({ error: 'Post not found' });
        }

        post.status = post.status === "show" ? "hidden" : "show";
        await post.save();
        return Response.json({ message: `Post ${post.status} successfully` });

    }

}