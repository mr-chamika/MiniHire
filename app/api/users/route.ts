import { Database } from "@/db";
import { Student } from "@/models/Student";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import emailjs from "@emailjs/nodejs";
import jwt from "jsonwebtoken";
import { Company } from "@/models/Company";

export async function POST(req: Request) {

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    try {

        await Database();

        const formData = await req.formData();

        if (formData.has('degree')) {//start of sign up POST request for student


            const email = formData.get("email") as string;
            const firstName = formData.get("firstName");
            const lastName = formData.get("lastName");
            const role = formData.get("role");
            const linkedin = formData.get("linkedin");
            const portfolio = formData.get("portfolio");
            const resume = formData.get("resume") as File;
            const password = formData.get("password");
            const degree = formData.get("degree");
            const university = formData.get("university");
            if (!email || !firstName || !lastName || !linkedin || !portfolio || !resume || !password || !degree || !university) {

                return Response.json({ error: 'All fields are required' });

            }

            const isExists = await Student.findOne({ email: email.toLowerCase() });

            if (isExists && !isExists.verified) {

                await Student.deleteOne({ email: email.toLowerCase() })

            }

            const otp = generateOTP();

            //convert cv to byte sequence and save it in blob storage in vercel
            const buffer = Buffer.from(await resume.arrayBuffer());
            const blob = await put(resume.name, buffer, { access: 'public', addRandomSuffix: true, contentType: resume.type })

            //hashing raw password using bcryptjs
            const hashedPassword = await bcrypt.hash(password.toString(), 10);

            const newStudent = await Student.create({

                email,
                firstName,
                lastName,
                role,
                linkedin,
                portfolio,
                resume: blob.url,
                password: hashedPassword,
                degree,
                university,
                otp,
                expires: new Date(Date.now() + 1000 * 60 * 5)

            })

            if (newStudent) {


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
        } else if (formData.has('companyName')) {//starting signup logic for company


            const email = formData.get("email") as string;
            const name = formData.get("companyName");
            const role = formData.get("role");
            const linkedin = formData.get("linkedin");
            const website = formData.get("website");
            const logo = formData.get("logo") as File;
            const password = formData.get("password");
            const contactNumber = formData.get("contactNumber");
            if (!email || !name || !linkedin || !website || !logo || !password || !contactNumber) {

                return Response.json({ error: 'All fields are required' });

            }

            const isExists = await Company.findOne({ email: email.toLowerCase() });

            if (isExists && !isExists.verified) {

                await Company.deleteOne({ email: email.toLowerCase() })

            }

            const otp = generateOTP();

            //convert cv to byte sequence and save it in blob storage in vercel
            const buffer = Buffer.from(await logo.arrayBuffer());
            const blob = await put(logo.name, buffer, { access: 'public', addRandomSuffix: true, contentType: logo.type })

            if (!blob) {

                return Response.json({ message: 'Check your internet connection' });

            }

            //hashing raw password using bcryptjs
            const hashedPassword = await bcrypt.hash(password.toString(), 10);

            const newCompany = await Company.create({

                email,
                name,
                role,
                linkedin,
                website,
                logo: blob.url,
                password: hashedPassword,
                contactNumber,
                otp,
                expires: new Date(Date.now() + 1000 * 60 * 5)

            })

            if (newCompany) {


                if (!process.env.EMAILJS_SERVICEID || !process.env.EMAILJS_TEMPLATEID || !process.env.EMAILJS_PUBLICKEY || !process.env.EMAILJS_PRIVATEKEY) {

                    return Response.json({ message: 'Invalid emailjs credentials' });

                }

                const res = await emailjs.send(process.env.EMAILJS_SERVICEID, process.env.EMAILJS_TEMPLATEID, {

                    to_name: name,
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

        } else if (formData.has('email')) {//starting login logic

            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (!email || !password) {

                return Response.json({ message: `Enter both email and password` });

            }

            let user = null;

            user = await Student.findOne({ email: email.toLowerCase() })

            if (!user) {

                user = await Company.findOne({ email: email.toLowerCase() })


            }

            if (!user) {

                return Response.json({ message: `Sign Up First` });

            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {

                return Response.json({ message: `Wrong Password` });

            }

            if (!process.env.JWT_SECRET) {

                return Response.json({ message: `Check your .env file JWT_SECRET is there` });

            }

            //create jwt token
            const token = jwt.sign({
                userId: user._id,
                role: user.role,
                verified: user.verified,
                email: user.email
            }, process.env.JWT_SECRET, { expiresIn: '1d' })

            if (!token) {

                return Response.json({ message: `Your token is missing` });

            }

            return Response.json({ token });
        }

    } catch (err) {

        return Response.json(err);
    }

}

export async function GET(req: Request) {

    await Database();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (id) {

        let searchStudent = null;

        searchStudent = await Student.findOne({ _id: id });

        if (!searchStudent) {

            searchStudent = await Company.findOne({ _id: id });

        }

        return Response.json(searchStudent);

    } else if (email) {


        const company = await Company.findOne({ email }, "name contactNumber");

        if (!company) {

            return;

        }

        return Response.json(company);

    }

}