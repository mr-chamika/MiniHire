import { Company } from "@/models/Company";
import { Student } from "@/models/Student";

export async function POST(req: Request) {

    const formData = await req.formData();

    const email = formData.get("email") as string;
    const otp = formData.get("otp");
    const role = formData.get("role");

    let user = null;

    if (role == "student") {

        user = await Student.findOne({ email }).select('-password');

    } else {

        user = await Company.findOne({ email }).select('-password');

    }

    if (!user) {

        return Response.json({ message: 'Signup again' });

    }
    console.log(user)
    if (Date.now() > user.expires) {

        return Response.json({ message: 'OTP expired' });

    }
    if (user.otp != otp) {

        return Response.json({ message: 'OTP does not match' });

    }

    user.otp = undefined;
    user.expires = undefined;
    user.verified = true;
    await user.save();

    return Response.json({ message: 'Verified', user: user });

}