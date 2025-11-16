'use client'

import AuthTopbarLogged from "@/app/components/AuthTopbarLogged"


export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <AuthTopbarLogged />
            <div className="pt-20">
                {children}
            </div>
        </div>
    )

}