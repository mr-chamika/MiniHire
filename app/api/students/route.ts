import { Database } from "@/db";
import { Student } from "@/models/Student";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {

    try {

        await Database();

        const formData = await req.formData();

        const email = formData.get("email");
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const linkedin = formData.get("linkedin");
        const portfolio = formData.get("portfolio");
        const resume = formData.get("resume") as File;
        const password = formData.get("password");
        const degree = formData.get("degree");
        const university = formData.get("university");
        if (!firstName || !lastName || !linkedin || !portfolio || !resume || !password || !degree || !university) {

            return Response.json({ error: 'All fields are required' });

        }

        //convert cv to byte sequence and save it in blob storage in vercel
        const buffer = Buffer.from(await resume.arrayBuffer());
        const blob = await put(resume.name, buffer, { access: 'public', addRandomSuffix: true, contentType: resume.type })

        //hashing raw password using bcryptjs
        const hashedPassword = await bcrypt.hash(password.toString(), 10);

        const newStudent = await Student.create({

            email,
            firstName,
            lastName,
            linkedin,
            portfolio,
            resume: blob.url,
            password: hashedPassword,
            degree,
            university

        })

        return Response.json(newStudent);

    } catch (err) {

        return Response.json(err);

    }

}

export async function GET(req: Request) {

    await Database();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const searchStudent = await Student.findOne({ _id: id });

    return Response.json(searchStudent);

}