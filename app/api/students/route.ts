import { Database } from "@/db";
import { Student } from "@/models/Student";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import emailjs from "@emailjs/nodejs"
interface OtpStore {

    [email: string]: { otp: string; expires: number }

}

export const saved: OtpStore = {};

export async function POST(req: Request) {

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    try {

        await Database();

        const formData = await req.formData();

        const email = formData.get("email") as string;
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const linkedin = formData.get("linkedin");
        const portfolio = formData.get("portfolio");
        const resume = formData.get("resume") as File;
        const password = formData.get("password");
        const degree = formData.get("degree");
        const university = formData.get("university");
        if (!email || !firstName || !lastName || !linkedin || !portfolio || !resume || !password || !degree || !university) {

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

        if (newStudent) {

            const otp = generateOTP();

            saved[email.toLowerCase()] = { otp, expires: Date.now() + 1000 * 60 * 5 };

            if (!process.env.EMAILJS_SERVICEID || !process.env.EMAILJS_TEMPLATEID || !process.env.EMAILJS_PUBLICKEY || !process.env.EMAILJS_PRIVATEKEY) {

                return Response.json({ message: 'Invalid emailjs credentials' });

            }

            const res = await emailjs.send(process.env.EMAILJS_SERVICEID, process.env.EMAILJS_TEMPLATEID, {

                to_name: firstName + " " + lastName,
                otp_code: otp,
                email: email

            }, {
                publicKey: process.env.EMAILJS_PUBLICKEY,
                privateKey: process.env.EMAILJS_PRIVATEKEY
            })

            if (res.status != 200) {

                return Response.json({ message: 'OTP not sent' });

            }

            return Response.json({ message: `OTP sent to ${email}` });
        }

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