'use client'

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Unhide from '../../../public/assets/eye.png'
import Hide from '../../../public/assets/hidden.png'

export default function Login() {

    const params = useSearchParams();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');


    useEffect(() => {

        const exp = params.get("message");

        if (exp) {

            setMessage(exp);

        }

    }, [])

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        try {

            if (email.length !== 0 && password.length !== 0) {

                setMessage('')
                setError('')
                const formData = new FormData();

                formData.append("email", email.toLowerCase());
                formData.append("password", password);

                const isTokenExists = localStorage.getItem("token") ? true : false;
                formData.append("isTokenExists", isTokenExists ? "true" : "false");

                const res = await axios.post('/api/students', formData);

                if (!res) {

                    setError('Check your connection');
                    return;

                }
                if (res.status != 200) {

                    setError('There is a login error');
                    return;

                }

                if (!res.data.token && res.data.message) {

                    setError(res.data.message);
                    return;

                }

                //saving token in localstorage

                localStorage.setItem("token", res.data.token);

                router.push('/student/dashboard');

            } else {

                setError('* Wrong email or password');

            }

        } catch (err) {

            console.log('Error from login : ' + err);
            setError('Failed to login');

        }
    }

    return (

        <div className='min-h-screen w-full flex items-center justify-center'>
            <div className="w-[70%] gap-12 flex-col flex items-center">

                <div className=" w-full flex justify-center mb-5">
                    <h1 className='text-6xl font-semibold'>Sign in to MiniHire</h1>
                </div>
                <form onSubmit={handleSubmit} className="shadow-xl rounded-3xl px-8 pt-8 h-[68%] w-96 flex flex-col justify-between items-center bg-gray-50">

                    <div className="w-full flex flex-col mb-5">

                        <label className="text-lg">Enter Your Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none text-gray-700 rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                    </div>
                    <div className="w-full flex flex-col mb-5">

                        <label className="text-lg">Enter Password</label>
                        <div className="flex bg-blue-100 border border-blue-200 flex-row items-center rounded-lg">

                            <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none text-gray-700 rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                            <Image onClick={() => setShow(!show)} src={show ? Unhide : Hide} alt="" width={20} className="mr-2 hover:cursor-pointer" />

                        </div>
                        <div className="w-full h-2 pt-1">
                            <span className={` text-red-400 text-sm italic ${!(error || message) ? 'opacity-0' : 'opacity-100'}`}>{error ? error : message}</span>
                        </div>
                    </div>
                    <input type="submit" value='Sign In' className="outline-none bg-green-500 text-white w-full py-1 mt-1 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />
                    <p className="py-4">Do not have account? <Link href='/signup' className="text-blue-500">Sign Up</Link></p>
                </form>
            </div>
        </div>

    )

}