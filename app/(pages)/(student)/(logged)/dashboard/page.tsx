"use client"

import CompanyDashboard from "@/app/components/CompanyDashboard";
import StudentDashboard from "@/app/components/StudentDashboard";
import AdminDashboard from "../../../../components/AdminDashboard";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Token {

    userId: string;
    role: string;
    verified: boolean;
    email: string;

}

export default function Dashboard() {

    const router = useRouter();

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {

        const inside = async () => {

            const tokenString = localStorage.getItem("token");

            if (!tokenString || tokenString.split('.').length !== 3) {
                router.replace(`/login?message=${encodeURIComponent("Token Expired or Invalid")}`)
                return;
            }

            let token: Token;
            try {
                token = jwtDecode(tokenString);
            } catch (err) {
                localStorage.removeItem("token");
                router.replace(`/login?message=${encodeURIComponent("Token Expired or Invalid")}`)
                return;
            }
            setEmail(token.email);
            setRole(token.role);

        }

        inside();

    }, [])

    return (
        <div>
            {!role ?

                <p>Loading...</p> :

                role === "student" ?

                    <StudentDashboard

                        email={email}

                    />

                    :

                    role === "company" ?

                        <CompanyDashboard

                            email={email}

                        />

                        :

                        role === "admin" ?

                            <AdminDashboard

                                email={email}

                            />

                            :

                            <p>Unknown role</p>

            }
        </div>
    );

}