import { Database } from "@/db";
import { Application } from "@/models/Application";
import { Company } from "@/models/Company";
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

        const cancelledApplications = await Application.find({ post_id: post_id, status: 'cancelled' });

        if (cancelledApplications.length > 0) {

            for (const app of cancelledApplications) {

                await app.deleteOne();

            }

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

    } if (formData.has("invite")) {

        console.log(formData);

        return Response.json({ done: 'true' });
    }

}

export async function GET(req: Request) {

    await Database();

    const { searchParams } = new URL(req.url);
    const fo = searchParams.get("fo");
    const email = searchParams.get("toCompany");
    const id = searchParams.get("id");
    const selectedTo = searchParams.get("selectedTo");

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

    } else if (email) {

        const comapny = await Company.findOne({ email: email }, "name");

        if (!comapny) {

            return Response.json([]);

        }

        const posts = await Post.find({ companyName: comapny.name }).distinct("_id");

        if (!posts) {

            return Response.json([]);

        }


        const applications = await Application.find({ post_id: { $in: posts } });

        if (!applications) {

            return Response.json([]);

        }

        let toReturn = [];

        for (const app of applications) {

            let post = await Post.findOne({ _id: app.post_id }, "role contactNumber jd period type");

            toReturn.push({

                period: post.period,
                role: post.role,
                type: post.type,
                firstName: app.firstName,
                lastName: app.lastName,
                email: app.email,
                university: app.university,
                resume: app.resume,
                portfolio: app.portfolio,
                linkedin: app.linkedin,
                _id: app._id,
                degree: app.degree,
                createdAt: app.createdAt,
                status: app.status,
                post_id: app.post_id,

            })

        }

        return Response.json(toReturn);

    } else if (id) {

        //let application = await Application.findOne({ _id: id, $expr: { $ne: ["$status", 'cancelled'] } }, "firstName lastName university degree portfolio linkedin resume post_id");
        let application = await Application.findOne({ _id: id }, "firstName lastName university degree portfolio linkedin resume post_id status marks email");

        if (!application) {

            return Response.json({ message: "This application no longer exists." });

        }

        const post = await Post.findOne({ _id: application.post_id });

        const returnObj = { ...application, jd: post.jd }

        return Response.json(returnObj);

    } else if (selectedTo) {

        const comapny = await Company.findOne({ email: selectedTo }, "name");

        if (!comapny) {

            return Response.json([]);

        }

        const posts = await Post.find({ companyName: comapny.name }).distinct("_id");

        if (!posts) {

            return Response.json([]);

        }


        const applications = await Application.find({ status: "selected", post_id: { $in: posts } });

        if (!applications) {

            return Response.json([]);

        }

        let toReturn = [];

        for (const app of applications) {

            let post = await Post.findOne({ _id: app.post_id }, "role contactNumber jd period type");

            toReturn.push({

                period: post.period,
                role: post.role,
                type: post.type,
                firstName: app.firstName,
                lastName: app.lastName,
                email: app.email,
                university: app.university,
                resume: app.resume,
                portfolio: app.portfolio,
                linkedin: app.linkedin,
                _id: app._id,
                degree: app.degree,
                createdAt: app.createdAt,
                status: app.status,
                post_id: app.post_id,
                marks: app.marks

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
    const review = formData.get("review");
    const marks = formData.get("marks");


    if (operation == "cancel") {

        const application = await Application.findOne({ _id: id });

        if (application.status == 'selected') {//cv s that rejected by comapny or cancel by student after selected can not be reapply.

            application.status = "rejected";

            const student = await Student.findOne({ email: application.email })

            student.saved.pull(application.post_id);

            await student.save();

        } else {

            application.status = "cancelled";

        }

        application.save();

        return Response.json({ done: 'true' });

    } else if (review) {

        const application = await Application.findOne({ _id: id });

        if (!application) {

            return Response.json({ message: 'No such application exists...' })

        }

        application.status = review;

        application.save();

        return Response.json({ done: 'true' });

    } else if (marks && id) {

        let application = await Application.findOne({ _id: id });

        if (!application) {

            return Response.json({ message: "This application no longer exists." });

        }

        application.marks = marks;

        application.save()

        return Response.json({ done: 'true' });

    }

    return Response.json({ done: 'false' });

}

export async function DELETE(req: Request) {



}