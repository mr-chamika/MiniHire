import { Database } from "@/db";
import { Post } from "@/models/Post";
import { Student } from "@/models/Student";

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
        const country = formData.get("country");
        const description = formData.get("description");

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
            country,
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

    if (userId) {

        const postSet = await Post.find({ createdBy: userId });

        if (!postSet) {

            return Response.json([]);

        }

        return Response.json(postSet);

    } else if (to == "toStudents") {

        const postSet = await Post.find({ $expr: { $ne: ["$vacancies", "$recruited"] } }, "_id companyName contactNumber role type period description createdAt");

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

    }


}