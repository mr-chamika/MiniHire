"use client"

import CompanyDashboard from "@/app/components/CompanyDashboard";
import StudentDashboard from "@/app/components/StudentDashboard";
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

            if (!tokenString) {

                router.replace(`/login?message=${encodeURIComponent("Token Expired")}`)
                return;
            }

            const token: Token = jwtDecode(tokenString);

            setEmail(token.email);
            setRole(token.role);

        }

        inside();

    }, [])

    return (
        <div>
            {role == "student" ?

                <StudentDashboard

                    email={email}
                    role={role}

                />

                :

                <CompanyDashboard

                    email={email}
                    role={role}

                />

            }
        </div>
    );

}