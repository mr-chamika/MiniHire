export default function StudentDashboard({ email, role }: { email: string, role: string }) {

    return (

        <div>
            This is the student dashboard

            <p>Your email : {email}</p>
            <p>Your are : {role}</p>

        </div>

    );

}