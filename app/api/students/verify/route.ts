import { Student } from "@/models/Student";
import { saved } from "../route";

export async function POST(req: Request) {

    const formData = await req.formData();

    const email = formData.get("email") as string;
    const otp = formData.get("otp");

    const store = saved[email];

    if (store.otp != otp) {

        return Response.json({ message: 'OTP does not match' });

    }
    if (Date.now() > store.expires) {

        return Response.json({ message: 'OTP expired' });

    }

    const user = await Student.findOne({ email }).select('-password');

    if (!user) {

        return Response.json({ message: 'Signup First !!!!!' });

    }

    user.verified = true;
    await user.save();

    delete saved[email.toLowerCase()];

    return Response.json({ message: 'Verified', user: user });

}