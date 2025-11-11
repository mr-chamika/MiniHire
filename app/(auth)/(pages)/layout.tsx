'use client'


import AuthTopbar from "../../components/AuthTopbar"

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    return (
        <div>
            <AuthTopbar />
            <div className="pt-20">
                {children}
            </div>
        </div>
    )

}