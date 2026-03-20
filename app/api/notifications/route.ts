import { Database } from "@/db";
import { Notification } from "@/models/Notifications";
import { Student } from "@/models/Student";
import { URL } from "url";

export async function POST(req: Request) {


}

export async function GET(req: Request) {

    await Database();
    const { searchParams } = new URL(req.url);

    const user = searchParams.get("user");

    if (user) {

        const notifications = await Notification.find({ studentId: user });

        if (notifications.length == 0) {

            return Response.json({ message: "No Notifications yet." });

        }
        return Response.json(notifications);

    }


}

export async function PUT(req: Request) {


}

export async function DELETE(req: Request) {



}