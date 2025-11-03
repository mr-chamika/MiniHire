'use client'

import Link from "next/link";
import { useState } from "react";


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        if (email.length !== 0 && password.length !== 0) {


            setError('')

            //   await fetch('http://localhost:5000/api/login', {

            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, password })

            //   })

            //     .then(res => res.json())
            //     .then(data => {

            //       if (data.message === 'done' && data.token) {

            //         window.location.href = `http://localhost:5000/admin?token=${data.token}`;

            //       } else {

            //         setError('* Wrong email or password');

            //       }
            //     })
            //     .catch(err => console.log(`Error from login : ${err}`))


        } else {

            setError('* Wrong email or password');

        }

    }

    return (

        <div className='min-h-screen w-full flex items-center justify-center'>
            <div className="w-[70%] gap-12 flex-col flex items-center">

                <div className=" w-full flex justify-center mb-5">
                    <h1 className='text-6xl font-semibold'>Sign in to MiniHelp</h1>
                </div>
                <form onSubmit={handleSubmit} className="shadow-xl rounded-3xl px-8 pt-8 h-[68%] w-96 flex flex-col justify-between items-center bg-gray-50">

                    <div className="w-full flex flex-col mb-5">

                        <label className="text-lg">Enter Your Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="company@gmail.com" className="outline-none text-gray-700 rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                    </div>
                    <div className="w-full flex flex-col mb-5">

                        <label className="text-lg">Enter Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" className="outline-none text-gray-700 rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                        <div className="w-full h-2">
                            <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                        </div>
                    </div>
                    <input type="submit" value='Sign In' className="outline-none bg-green-500 text-white w-full py-1 mt-1 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />
                    <p className="py-4">Do not have account? <Link href='/signup' className="text-blue-500">Sign Up</Link></p>
                </form>
            </div>
        </div>

    )

}