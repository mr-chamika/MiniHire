'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthTopbar() {

    const route = useRouter();

    return (

        <div className="bg-green-300 fixed h-20 w-full px-4 flex-row justify-between flex">

            <div className="items-center h-full flex">

                <Link href="/" className="bg-blue-600 p-3 rounded-lg text-white font-serif">MiniHelp</Link>

            </div>

            <div className="flex items-center gap-4">

                <button className="bg-cyan-900 text-white font-bold px-3 pb-2 pt-1 rounded-md hover:cursor-pointer" onClick={() => route.push('/login')}>Login</button>
                <button className="bg-cyan-900 text-white font-bold px-3 pb-2 pt-1 rounded-md hover:cursor-pointer" onClick={() => route.push('/signup')}>Sign Up</button>

            </div>

        </div>

    )

}