import { Database } from "@/db";
import { Application } from "@/models/Application";
import { Post } from "@/models/Post";
import { Student } from "@/models/Student";
import { URL } from "url";

export async function POST(req: Request) {

    await Database();
    const formData = await req.formData()

    if (formData.has("post_id")) {

        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const university = formData.get("university");
        const degree = formData.get("degree");
        const portfolio = formData.get("portfolio");
        const linkedin = formData.get("linkedin");
        const resume = formData.get("resume");
        const post_id = formData.get("post_id");
        const email = formData.get("email");

        if (!firstName || !lastName || !university || !degree || !portfolio || !linkedin || !resume || !post_id || !email) {

            return Response.json({ message: 'Missing some data to save...' });

        }

        const student = await Student.findOne({ email });

        if (student.role != 'student' || student.verified != true) {

            return Response.json({ message: 'Verify Account First...' });

        }

        const application = await Application.create({

            firstName,
            lastName,
            email,
            university,
            degree,
            portfolio,
            linkedin,
            resume,
            post_id

        })

        if (!application) {

            return Response.json({ message: 'Failed to send your application...' });

        }

        return Response.json({ done: 'true' });

    }

}

export async function GET(req: Request) {

    await Database();

    const { searchParams } = new URL(req.url);
    const fo = searchParams.get("fo");

    if (fo) {

        const applications = await Application.find({ email: fo }, "createdAt status post_id _id");
        //const postSet = await Application.find({$and:[{email:fo},{ $expr: { $ne: ["$vacancies", "$recruited"] } }]}, "contactNumber role type period jd");

        if (!applications) {

            return Response.json([]);

        }

        let toReturn = [];

        for (const app of applications) {

            let post = await Post.findOne({ _id: app.post_id }, "role contactNumber jd period type");

            toReturn.push({

                _id: app._id,
                role: post.role,
                contactNumber: post.contactNumber,
                period: post.period,
                type: post.type,
                createdAt: app.createdAt,
                status: app.status,
                post_id: app.post_id

            })

        }

        return Response.json(toReturn);

    }

}

export async function PUT(req: Request) {

    await Database();

    const formData = await req.formData();

    if (!formData) {

        return Response.json({ message: 'Invalid request from frontend' });

    }
    if (!formData) {

        return Response.json({ message: 'Invalid request from frontend' });

    }

    const id = formData.get("id");
    const operation = formData.get("operation");

    console.log(id)

    const application = await Application.findOne({ _id: id });

    if (!operation) {

        return Response.json({ message: 'Invalid operation...' });

    }

    if (!application) {

        return Response.json({ message: 'Invalid application...' });

    }


    if (operation == "cancel") {

        application.status = "cancelled";
        application.save();
        return Response.json({ done: 'true' });

    }
    return Response.json({ done: 'false' });

}