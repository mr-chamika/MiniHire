export default function CompanyDashboard({ email, role }: { email: string, role: string }) {

    return (

        <div>
            This is the company dashboard

            <p>Your email : {email}</p>
            <p>Your are : {role}</p>

        </div>

    );

}