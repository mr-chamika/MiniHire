import { Database } from "@/db";
import { Student } from "@/models/Student";

export async function POST(req: Request) {

    try {

        await Database();

        const { email, firstName, lastName, linkedin, portfolio, resume, password, university, degree } = await req.json();

        const newStudent = await Student.create({

            email,
            firstName,
            lastName,
            linkedin,
            portfolio,
            resume,
            password,
            degree,
            university

        })

        return Response.json(newStudent);

    } catch (err) {

        return Response.json(err);

    }

}