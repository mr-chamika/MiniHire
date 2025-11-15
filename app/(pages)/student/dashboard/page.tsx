"use client"

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
            This is the dashboard

            <p>Your email : {email}</p>
            <p>Your are : {role}</p>

        </div>

    );

}