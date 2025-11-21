import { Database } from "@/db";
import { Post } from "@/models/Post";

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

    const postSet = await Post.find({ createdBy: userId });

    if (!postSet) {

        return Response.json([]);

    }

    return Response.json(postSet);

}