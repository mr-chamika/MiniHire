import { Database } from "@/db";
import { Student } from "@/models/Student";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import emailjs from "@emailjs/nodejs";
import jwt from "jsonwebtoken";
import { Company } from "@/models/Company";
import { Admin } from "@/models/Admin";

export async function POST(req: Request) {

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    try {

        await Database();

        const formData = await req.formData();

        if (formData.has('degree')) {//start of sign up POST request for student


            const email = formData.get("email") as string;
            const contactNumber = formData.get("contactNumber");
            const firstName = formData.get("firstName");
            const lastName = formData.get("lastName");
            const role = formData.get("role");
            const linkedin = formData.get("linkedin");
            const portfolio = formData.get("portfolio");
            const github = formData.get("github");
            const resume = formData.get("resume") as File;
            const password = formData.get("password");
            const degree = formData.get("degree");
            const university = formData.get("university");
            if (!email || !firstName || !lastName || !linkedin || !contactNumber || !portfolio || !github || !resume || !password || !degree || !university) {

                return Response.json({ error: 'All fields are required' });

            }

            const isExists = await Student.findOne({ email: email.toLowerCase() });

            const taken = await Company.findOne({ email: email.toLocaleLowerCase() })//check whether email registered as a student

            if (isExists && !isExists.verified) {

                await Student.deleteOne({ email: email.toLowerCase() })

            } else if (taken || isExists) {

                return Response.json({ error: 'This email registered already' });

            }


            const otp = generateOTP();

            //convert cv to byte sequence and save it in blob storage in vercel
            const buffer = Buffer.from(await resume.arrayBuffer());
            const blob = await put(resume.name, buffer, { access: 'public', addRandomSuffix: true, contentType: resume.type })

            //hashing raw password using bcryptjs
            const hashedPassword = await bcrypt.hash(password.toString(), 10);

            const newStudent = await Student.create({

                email,
                contactNumber,
                firstName,
                lastName,
                role,
                linkedin,
                portfolio,
                github,
                resume: blob.url,
                password: hashedPassword,
                degree,
                university,
                otp,
                expires: new Date(Date.now() + 1000 * 60 * 5)

            })

            if (newStudent) {


                if (!process.env.EMAILJS_SERVICEID || !process.env.EMAILJS_TEMPLATEID || !process.env.EMAILJS_PUBLICKEY || !process.env.EMAILJS_PRIVATEKEY) {

                    return Response.json({ error: 'Invalid emailjs credentials' });

                }

                const body = `Hello ${firstName},<br>
Your one-time verification code is:
<h2 style="font-weight:bold">${otp}</h2>
This code will expire in 5 minutes.`;

                const subject = `Welcome to MiniHire`

                const res = await emailjs.send(process.env.EMAILJS_SERVICEID, process.env.EMAILJS_TEMPLATEID, {

                    body,
                    subject,
                    email

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

            const taken = await Student.findOne({ email: email.toLocaleLowerCase() })//check whether email registered as a student

            if (isExists && !isExists.verified) {

                await Company.deleteOne({ email: email.toLowerCase() })

            } else if (taken || isExists) {

                return Response.json({ error: 'This email registered already' });

            }


            const otp = generateOTP();

            //convert logo to byte sequence and save it in blob storage in vercel
            const buffer = Buffer.from(await logo.arrayBuffer());
            const blob = await put(logo.name, buffer, { access: 'public', addRandomSuffix: true, contentType: logo.type })

            if (!blob) {

                return Response.json({ error: 'Check your internet connection' });

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
                expires: new Date(Date.now() + 1000 * 60 * 5),
                verified: false

            })

            if (!process.env.EMAILJS_SERVICEID || !process.env.EMAILJS_TEMPLATEID || !process.env.EMAILJS_PUBLICKEY || !process.env.EMAILJS_PRIVATEKEY) {

                return Response.json({ error: 'Invalid emailjs credentials' });

            }

            const body = `Hello ${name},<br>
Your one-time verification code is:
<h2 style="font-weight:bold">${otp}</h2>
This code will expire in 5 minutes.`;

            const subject = `Welcome to MiniHire`

            const res = await emailjs.send(process.env.EMAILJS_SERVICEID, process.env.EMAILJS_TEMPLATEID, {

                body,
                subject,
                email

            }, {
                publicKey: process.env.EMAILJS_PUBLICKEY,
                privateKey: process.env.EMAILJS_PRIVATEKEY
            })

            if (res.status != 200) {

                return Response.json({ message: 'OTP not sent' });

            }

            if (newCompany) {
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

                user = await Admin.findOne({ email: email.toLowerCase() })

            }

            if (!user) {

                return Response.json({ message: `Sign Up First` });

            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {

                return Response.json({ message: `Wrong Password` });

            }

            // Check if company is verified
            if (user.role === 'company' && !user.verified) {
                return Response.json({ message: 'Account pending verification' });
            }

            if (!process.env.JWT_SECRET) {

                return Response.json({ message: `Check your .env file JWT_SECRET is there` });

            }

            //create jwt token
            const token = jwt.sign({
                userId: user._id,
                role: user.role,
                verified: user.verified,
                email: user.email,
                name: user.name || user.firstName,

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
    const email_toApply = searchParams.get("toApply");
    const operation = searchParams.get("operation");
    const approve = searchParams.get("approve");
    const unapprove = searchParams.get("unapprove");

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

    } else if (email_toApply) {

        const student = await Student.findOne({ email: email_toApply }, "firstName lastName university degree portfolio linkedin resume github contactNumber");

        if (!student) {

            return Response.json({ message: "No such student registered..." });

        }

        return Response.json(student);

    } else if (operation == "all") {

        try {
            const companies = await Company.find({}).select('-password -otp -expires');
            return Response.json(companies);
        } catch (err) {
            return Response.json({ error: 'Failed to fetch companies' }, { status: 500 });
        }

    } else if (approve) {

        try {
            await Company.findByIdAndUpdate(approve, { verified: true });
            return Response.json({ message: 'Company approved' });
        } catch (err) {
            return Response.json({ error: 'Failed to approve company' }, { status: 500 });
        }

    } else if (unapprove) {

        try {
            await Company.findByIdAndUpdate(unapprove, { verified: false });
            return Response.json({ message: 'Company unapproved' });
        } catch (err) {
            return Response.json({ error: 'Failed to unapprove company' }, { status: 500 });
        }

    }

}

export async function PUT(req: Request) {
    try {
        await Database();
        const formData = await req.formData();
        const id = formData.get("id") as string;

        if (!id) {
            return Response.json({ error: 'ID required' });
        }

        const student = await Student.findById(id);
        if (student) {
            // Update student
            if (formData.has("firstName")) student.firstName = formData.get("firstName") as string;
            if (formData.has("lastName")) student.lastName = formData.get("lastName") as string;
            if (formData.has("contactNumber")) student.contactNumber = formData.get("contactNumber") as string;
            if (formData.has("linkedin")) student.linkedin = formData.get("linkedin") as string;
            if (formData.has("portfolio")) student.portfolio = formData.get("portfolio") as string;
            if (formData.has("github")) student.github = formData.get("github") as string;
            if (formData.has("degree")) student.degree = formData.get("degree") as string;
            if (formData.has("university")) student.university = formData.get("university") as string;
            if (formData.has("resume")) {
                const resumeFile = formData.get("resume") as File;
                const buffer = Buffer.from(await resumeFile.arrayBuffer());
                const blob = await put(resumeFile.name, buffer, { access: 'public', addRandomSuffix: true, contentType: resumeFile.type });
                student.resume = blob.url;
            }
            await student.save();
            return Response.json({ message: 'Student profile updated' });
        }

        const company = await Company.findById(id);
        if (company) {
            // Update company
            if (formData.has("name")) company.name = formData.get("name") as string;
            if (formData.has("contactNumber")) company.contactNumber = formData.get("contactNumber") as string;
            if (formData.has("linkedin")) company.linkedin = formData.get("linkedin") as string;
            if (formData.has("website")) company.website = formData.get("website") as string;
            if (formData.has("logo")) {
                const logoFile = formData.get("logo") as File;
                const buffer = Buffer.from(await logoFile.arrayBuffer());
                const blob = await put(logoFile.name, buffer, { access: 'public', addRandomSuffix: true, contentType: logoFile.type });
                company.logo = blob.url;
            }
            await company.save();
            return Response.json({ message: 'Company profile updated' });
        }

        return Response.json({ error: 'User not found' });
    } catch (err) {
        console.error('Error updating profile:', err);
        return Response.json({ error: 'Failed to update profile' });
    }
}