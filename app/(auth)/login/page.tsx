'use client'

import { Suspense } from "react";
import LoginPage from "@/app/components/LoginPage";

export default function Login() {

    return (
        <Suspense>
            <LoginPage />
        </Suspense>
    )

}