'use client'

import Link from "next/link";
import { useState } from "react";

import Unhide from '../../../public/assets/eye.png'
import Hide from '../../../public/assets/hidden.png'
import Image from "next/image";
import { setEnvironmentData } from "node:worker_threads";

export default function StudentSignup() {

    const uniOptions = [
        { label: "University of Colombo", value: "UOC" },
        { label: "University of Peradeniya", value: "UOP" },
        { label: "University of Sri Jayewardenepura", value: "USJ" },
        { label: "University of Kelaniya", value: "UOK" },
        { label: "University of Moratuwa", value: "UOM" },
        { label: "University of Jaffna", value: "UOJ" },
        { label: "University of Ruhuna", value: "UOR" },
        { label: "The Open University", value: "OUSL" },
        { label: "Eastern University, Sri Lanka", value: "EUSL" },
        { label: "South Eastern University", value: "SEUSL" },
        { label: "Rajarata University", value: "RUSL" },
        { label: "Sabaragamuwa University", value: "SUSL" },
        { label: "Wayamba University", value: "WUSL" },
        { label: "Uva Wellassa University", value: "UWU" },
        //{ label: "University of the Visual & Performing Arts", value: "UVPA" },
        { label: "University of Indigenous Medicine", value: "GWUIM" },
        { label: "University of Vavuniya", value: "UOV" },
        //{ label: "Buddhist and Pali University", value: "BPU" },
        //{ label: "Bhiksu University", value: "BUSL" },
        // Add other state universities/institutions as needed (e.g., KDU, Ocean University)
    ];

    const roleOptions = [
        { label: "Company", value: "company" },
        { label: "Student", value: "student" },
    ]

    const degreeOptions = [
        { label: "BSc (Hons) in Software Engineering.", value: "SE (Hons)" },
        { label: "BSc in Software Engineering.", value: "SE" },
        { label: "BSc (Hons) in Computer Science.", value: "CS (Hons)" },
        { label: "BSc in Computer Science.", value: "CS" },
    ]
    const [email, setEmail] = useState('hasithchamika2001@gmail.com');
    const [password, setPassword] = useState('1234');
    const [show, setShow] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('1234');
    const [hide, setHide] = useState(true);
    const [firstName, setFirstName] = useState('Hasith');
    const [lastName, setLastName] = useState('Wijesinghe');
    const [university, setUniveristy] = useState(uniOptions[0].value);
    const [degree, setDegree] = useState(degreeOptions[0].value);
    const [linkedin, setLinkedin] = useState('https://www.linkedin.com/in/hasith-wijesinghe-3394062a2/');
    const [portfolio, setPortfolio] = useState('https://www.linkedin.com/in/hasith-wijesinghe-3394062a2/');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [errorCP, setErrorCP] = useState('');


    const handleSubmit = async (e: any) => {

        e.preventDefault();


        if (email.trim().length !== 0 &&
            firstName.trim().length !== 0 &&
            lastName.trim().length !== 0 &&
            linkedin.trim().length !== 0 &&
            portfolio.trim().length !== 0 &&
            file &&
            password.trim().length !== 0 &&
            confirmPassword.trim().length !== 0) {

            if (password.trim().length < 8) {

                setError('Password must contains at least 8 characters');
                setErrorCP('')
                return;

            }
            if (password.trim() !== confirmPassword.trim()) {
                setError('')
                setErrorCP('Password must matches with above entered');
                return;

            }

            setError('');
            setErrorCP('');

            console.log(email)
            console.log(firstName)
            console.log(lastName)
            console.log(linkedin)
            console.log(portfolio)
            console.log(file)
            console.log(password)
            console.log(confirmPassword)


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

            //setError('* Wrong email or password');

        }

    }

    return (

        <div className='min-h-screen w-full flex items-center justify-center'>
            <div className="w-[70%] min-w-[500px] gap-12 flex-col flex items-center">

                <div className="w-full flex justify-center">
                    <h1 className='md:text-5xl text-3xl font-semibold'>Welcome to MiniHelp</h1>
                </div>
                <form onSubmit={handleSubmit} className="w-[90%] shadow-xl px-10 pt-10 pb-2 rounded-3xl flex flex-col justify-between items-center bg-gray-50">
                    <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-10 w-full">
                        <div className="sm:w-[50%] space-y-5">
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">First Name</label>
                                <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Last Name</label>
                                <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Email</label>
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Password</label>
                                <div className="flex bg-blue-100 border border-blue-200 flex-row items-center rounded-lg">

                                    <input required type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none  px-2 py-1 w-full bg-blue-100" />
                                    <Image onClick={() => setShow(!show)} src={show ? Unhide : Hide} alt="" width={20} className="mr-2 hover:cursor-pointer" />

                                </div>
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Confirm Password</label>
                                <div className="flex bg-blue-100 border border-blue-200 flex-row items-center rounded-lg">

                                    <input required type={!hide ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="outline-none  px-2 py-1 w-full bg-blue-100" />
                                    <Image onClick={() => setHide(!hide)} src={!hide ? Unhide : Hide} alt="" width={20} className="mr-2 hover:cursor-pointer" />

                                </div>
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${errorCP === '' ? 'opacity-0' : 'opacity-100'}`}>{errorCP}</span>
                                </div>
                            </div>
                        </div>
                        <div className="sm:w-[50%] space-y-5">
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">University</label>
                                <select value={university} onChange={(e) => setUniveristy(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                    {uniOptions.map((uni) => (

                                        <option key={uni.value} value={uni.value}>{uni.label}</option>
                                    ))}

                                </select>
                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Degree</label>
                                <select value={degree} onChange={(e) => setDegree(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                    {degreeOptions.map((degree) => (

                                        <option key={degree.value} value={degree.value}>{degree.label}</option>
                                    ))}

                                </select>
                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Your Portfolio</label>
                                <input required type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">LinkedIn Profile</label>
                                <input pattern="https://www.linkedin.com/.*" required type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}></span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Your Resume</label>
                                <input required type="file" accept="application/pdf" onChange={(e) => { e.target.files && e.target.files.length > 0 && setFile(e.target.files[0]) }} className="file:border-none file:bg-transparent file:font-bold file:text-blue-500 file:bg-gray-200 file:rounded-md file:shadow-sm file:cursor-pointer outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                {/* <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <input type="submit" value='Sign Up As a Student' className="outline-none bg-green-500 text-white sm:w-[60%] w-full py-1 mt-5 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />
                    <p className="py-2">Have an account? <Link href='/login' className="text-blue-500">Login Here</Link></p>
                </form>
            </div>
        </div>

    )

}