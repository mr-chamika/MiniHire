'use client'

import Link from "next/link";
import { useState } from "react";

import Unhide from '../../../public/assets/eye.png'
import Hide from '../../../public/assets/hidden.png'
import Image from "next/image";
import axios from "axios";
import Modal from "@/app/components/Modal";
import { useRouter } from "next/navigation";

export default function CompanySignup() {

    const router = useRouter();

    const sizes = [

        { label: "1-9 members", value: "1-9" },
        { label: "10-49 members", value: "10-49" },
        { label: "50-249 members", value: "50-249" },
        { label: "250+ members", value: "250+" },

    ]

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hide, setHide] = useState(true);
    const [companyName, setCompanyName] = useState('');
    const [contact, setContact] = useState('');
    const [started, setStarted] = useState(Number(new Date().getFullYear()) - 10);
    const [size, setSize] = useState(sizes[0].value);
    const [linkedin, setLinkedin] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [errorE, setErrorE] = useState('');
    const [errorCP, setErrorCP] = useState('');
    const [modal, setModal] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [message, setMessage] = useState("");
    const [role, setRole] = useState("");

    const confirmPw = (e: any) => {

        const entered = e.target.value;
        setConfirmPassword(entered);

        if (entered != password) {

            setErrorCP('Not matches with above');
            return;

        }

        setErrorCP('');
        return;

    }

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 5) {
                const nextInput = document.querySelector(
                    `input[data-index='${index + 1}']`
                ) as HTMLInputElement | null;
                nextInput?.focus();
            }

        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.querySelector(
                `input[data-index='${index - 1}']`
            ) as HTMLInputElement | null;
            prevInput?.focus();
        }
    };


    const handle = async (e: any) => {
        e.preventDefault();
        try {

            const finalOtp = otp.join("");
            if (finalOtp.length < 6) {
                setMessage("Please enter all 6 digits");
                return;
            }

            const formData = new FormData();

            formData.append("email", email.toLowerCase());
            formData.append("otp", finalOtp);
            formData.append("role", role);

            const res = await axios.post('/api/users/verify', formData)

            if (res.status == 200 && res.data.message == "Verified") {
                setMessage("✅ OTP verified successfully!");
                setOtp(Array(6).fill(""));
                setModal(false);

                //router.replace(`/profile/${res.data.user._id}`);
                router.replace(`/login`);

            } else {
                setMessage("❌ Invalid OTP. Please try again.");
            }

        } catch (err) {

            console.log('Error from load profile page: ' + error);

        }
    };


    const handleSubmit = async (e: any) => {

        e.preventDefault();

        try {

            if (email.trim().length !== 0 &&
                companyName.trim().length !== 0 &&
                contact.trim().length !== 0 &&
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

                const formData = new FormData();

                formData.append("companyName", companyName);
                formData.append("email", email.toLocaleLowerCase());
                formData.append("role", "company");
                formData.append("linkedin", linkedin.toLocaleLowerCase());
                formData.append("website", portfolio.toLocaleLowerCase());
                formData.append("logo", file);
                formData.append("password", password);
                formData.append("contactNumber", contact);


                const res = await axios.post('/api/users', formData);
                //automatically set headers to {'Content-Type':'multipart/form-data'} 

                const data = res.data;

                if (data.message) {

                    if (res.status != 200) {

                        console.log('Error from sending otp: ' + data.message);

                    }
                    console.log('From Server : ' + data.message);


                }

                if (data.error) {

                    console.log('Error from server: ' + data.error);
                    alert(data.error)
                    return;

                }

                if (data.errorResponse && data.errorResponse.errmsg.includes(`E11000 duplicate key error collection: MiniHire.students index: email_1 dup key:`)) {

                    setErrorE('Email already exists');
                    return;

                }

                setErrorE('');

                console.log('Signup Successed');

                setRole(formData.get("role") as string);
                setModal(true);

            }

        } catch (err) {

            alert('Error Signing Up: ' + err);

        }

    }

    return (

        <div className='min-h-screen w-full flex items-center justify-center'>
            <div className="w-[70%] min-w-[500px] gap-12 flex-col flex items-center p-5">

                <div className="w-full flex justify-center">
                    <h1 className='md:text-5xl text-3xl font-semibold'>Welcome to MiniHire</h1>
                </div>
                <form onSubmit={handleSubmit} className="w-[82%] shadow-xl px-10 pt-10 pb-2 rounded-3xl flex flex-col justify-between items-center bg-gray-50">
                    <div className=" gap-5 flex flex-col sm:flex-row space-x-0 sm:space-x-10 w-full">
                        <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Company Name</label>
                                <input required type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Contact Number</label>
                                <input required inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="07xxxxxxxx" value={contact} onChange={(e) => setContact(e.target.value.replace(/[^0-9]/g, ''))} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Email</label>
                                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${errorE === '' ? 'opacity-0' : 'opacity-100'}`}>{errorE}</span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Password</label>
                                <div className="flex bg-blue-100 border border-blue-200 flex-row items-center rounded-lg">

                                    <input required minLength={8} type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="outline-none  px-2 py-1 w-full bg-blue-100" />
                                    <Image onClick={() => setShow(!show)} src={show ? Unhide : Hide} alt="" width={20} className="mr-2 hover:cursor-pointer" />

                                </div>
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">Confirm Password</label>
                                <div className="flex bg-blue-100 border border-blue-200 flex-row items-center rounded-lg">

                                    <input required minLength={8} type={!hide ? "text" : "password"} value={confirmPassword} onChange={(e) => confirmPw(e)} className="outline-none  px-2 py-1 w-full bg-blue-100" />
                                    <Image onClick={() => setHide(!hide)} src={!hide ? Unhide : Hide} alt="" width={20} className="mr-2 hover:cursor-pointer" />

                                </div>
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${errorCP === '' ? 'opacity-0' : 'opacity-100'}`}>{errorCP}</span>
                                </div>
                            </div>
                        </div>
                        <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Started Year</label>
                                <input max={Number(new Date().getFullYear())} type="number" value={started} onChange={(e) => setStarted(Number(e.target.value))} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" />

                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Company size</label>
                                <select value={size} onChange={(e) => setSize(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                    {sizes.map((size) => (

                                        <option key={size.value} value={size.value}>{size.label}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Website</label>
                                <input required type="url" value={portfolio} placeholder="https://www.google.com" onChange={(e) => setPortfolio(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />


                            </div>
                            <div className="w-full flex flex-col">

                                <label className="text-lg text-gray-500">LinkedIn</label>
                                <input pattern="https://www.linkedin.com/.*" required type="url" placeholder="https://www.linkedin.com/" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                <div className="w-full h-2">
                                    <span className={` text-red-400 text-sm italic ${error === '' ? 'opacity-0' : 'opacity-100'}`}></span>
                                </div>
                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Company Logo</label>
                                <input required type="file" accept="image/jpeg" onChange={(e) => { e.target.files && e.target.files.length > 0 && setFile(e.target.files[0]) }} className="file:border-none file:bg-transparent file:font-bold file:text-blue-500 file:bg-gray-200 file:rounded-md file:shadow-sm file:cursor-pointer outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                            </div>
                        </div>
                    </div>
                    <input type="submit" value='Sign Up As a Company' className="outline-none bg-green-500 text-white sm:w-[60%] w-full py-1 mt-5 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />
                    <p className="py-2">Have an account? <Link href='/login' className="text-blue-500">Login Here</Link></p>
                </form>
            </div>
            {modal &&

                <Modal show={modal} setShow={setModal}>

                    <div className="w-full flex flex-col items-center justify-center min-h-screen">
                        <form
                            onSubmit={handle}
                            className="bg-white p-6 rounded-xl shadow-md w-80 text-center"
                        >
                            <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
                            <p>Sent to {email}</p>

                            <div className="flex justify-between mb-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        data-index={index}
                                        type="text"
                                        value={digit}
                                        maxLength={1}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        className="w-10 h-10 text-center border border-gray-300 rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                ))}
                            </div>

                            <input
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                                value="Verify"
                            />

                            {message && (
                                <p className="text-sm mt-3 text-gray-700">{message}</p>
                            )}
                        </form>
                    </div>

                </Modal>

            }
        </div>

    )

}