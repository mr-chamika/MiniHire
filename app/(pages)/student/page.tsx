"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Unhide from '../../../public/assets/eye.png'
import Hide from '../../../public/assets/hidden.png'
import Image from "next/image";
import axios from "axios";
import Modal from "@/app/components/Modal";

export default function StudentSignup() {

    const router = useRouter();

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

    const degreeOptions = [
        { label: "BSc (Hons) in Software Engineering.", value: "SE (Hons)" },
        { label: "BSc in Software Engineering.", value: "SE" },
        { label: "BSc (Hons) in Computer Science.", value: "CS (Hons)" },
        { label: "BSc in Computer Science.", value: "CS" },
    ]
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [hide, setHide] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [university, setUniveristy] = useState(uniOptions[0].value);
    const [degree, setDegree] = useState(degreeOptions[0].value);
    const [linkedin, setLinkedin] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [github, setGithub] = useState('');
    const [resume, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [errorCP, setErrorCP] = useState('');
    const [errorE, setErrorE] = useState('');
    const [errorF, setErrorF] = useState('');
    const [modal, setModal] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [message, setMessage] = useState("");
    const [role, setRole] = useState("");
    const [contact, setContact] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);


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

            setVerifying(true);

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
                setVerifying(false);
                setMessage("❌ Invalid OTP. Please try again.");
            }

        } catch (err) {

            setVerifying(false);
            console.log('Error from load profile page: ' + err);

        }
    };

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        setError('');
        setErrorE('');
        setErrorF('');
        setErrorCP('');


        try {
            if (email.trim().length !== 0 &&
                firstName.trim().length !== 0 &&
                lastName.trim().length !== 0 &&
                linkedin.trim().length !== 0 &&
                portfolio.trim().length !== 0 &&
                resume && github && contact &&
                password.trim().length !== 0 &&
                confirmPassword.trim().length !== 0) {

                if (password.trim().length < 8) {

                    setError('Minimum length is 8');
                    setErrorCP('')
                    return;

                }
                if (password.trim() !== confirmPassword.trim()) {
                    setError('')
                    setErrorCP('Password must matches with above entered');
                    return;

                }

                const formData = new FormData();
                setLoading(true);

                formData.append("email", email.toLocaleLowerCase());
                formData.append("contactNumber", contact);
                formData.append("firstName", firstName.toLocaleLowerCase());
                formData.append("lastName", lastName.toLocaleLowerCase());
                formData.append("role", "student");
                formData.append("linkedin", linkedin.toLocaleLowerCase());
                formData.append("github", github);
                formData.append("portfolio", portfolio.toLocaleLowerCase());
                formData.append("resume", resume);
                formData.append("password", password);
                formData.append("degree", degree);
                formData.append("university", university);

                const res = await axios.post('/api/users', formData);
                //automatically set headers to {'Content-Type':'multipart/form-data'} 
                const data = res.data;

                if (data.message) {

                    if (res.status != 200) {

                        console.log('Error from sending otp: ' + data.message);
                        return;

                    }
                    console.log('From Server : ' + data.message);

                }

                if (data.error) {

                    console.log('Error from server: ' + data.error);
                    alert(data.error)
                    return;

                }

                if (data.errorResponse && data.errorResponse.errmsg.includes(`E11000 duplicate key error collection: MiniHire.students index: email_1 dup key:`)) {

                    setLoading(false);
                    setErrorE('Email already exists');
                    return;

                }

                setErrorE('');

                console.log('Signup Successed');

                setRole(formData.get("role") as string);

                setModal(true);

            } else {

                setLoading(false);

            }
        } catch (err) {
            setLoading(false);
            alert('Error Signing Up: ' + err);

        }

    }

    return (

        <div className='min-h-screen  w-full flex items-center justify-center'>
            <div className="w-[70%] min-w-[500px] gap-6 flex-col flex items-center py-2">

                <div className="w-full flex justify-center">
                    <h1 className='md:text-5xl text-3xl font-semibold'>Welcome to MiniHire</h1>
                </div>
                <form onSubmit={handleSubmit} className="min-w-[92%] shadow-xl px-10 pt-8 rounded-3xl flex flex-col justify-between items-center bg-gray-50">
                    <div className="gap-5 flex flex-col sm:flex-row space-x-0 sm:space-x-10 w-full ">
                        <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">First Name</label>
                                <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Last Name</label>
                                <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

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

                                    <input required type={show ? "text" : "password"} value={password} onChange={(e) => { e.target.value.length < 8 ? setError("Min length 8") : setError(''); setPassword(e.target.value) }} className="outline-none  px-2 py-1 w-full bg-blue-100" />
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
                        <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">University</label>
                                <select value={university} onChange={(e) => setUniveristy(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                    {uniOptions.map((uni) => (

                                        <option key={uni.value} value={uni.value}>{uni.label}</option>
                                    ))}

                                </select>
                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Degree</label>
                                <select value={degree} onChange={(e) => setDegree(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                    {degreeOptions.map((degree) => (

                                        <option key={degree.value} value={degree.value}>{degree.label}</option>
                                    ))}

                                </select>
                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">GitHub Profile</label>
                                <input required type="url" value={github} pattern="https://github.com/.*" onChange={(e) => setGithub(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                            </div>
                            <div className="w-full flex flex-col pb-2">

                                <label className="text-lg text-gray-500">Your Portfolio</label>
                                <input required type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
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
                                <input required type="file" accept="application/pdf" onChange={(e) => { const selectedFile = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null; if (selectedFile && selectedFile.type !== 'application/pdf') { setErrorF('Only PDF files are allowed.'); setFile(null); } else { setFile(selectedFile); setErrorF(''); } }} className="file:border-none file:bg-transparent file:font-bold file:text-blue-500 file:bg-gray-200 file:rounded-md file:shadow-sm file:cursor-pointer outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                <div className="w-full h-2">
                                    <span className={`text-red-400 text-sm italic ${errorF === '' ? 'opacity-0' : 'opacity-100'}`}>{errorF}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="submit" disabled={loading} value={loading ? 'Signing Up...' : 'Sign Up As a Student'} className="outline-none bg-green-500 text-white sm:w-[60%] w-full py-1 mt-5 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black disabled:opacity-50" />
                    <p className="py-2">Have an account? <Link href='/login' className="text-blue-500"><span>Login Here</span></Link></p>
                </form>
            </div>

            {modal &&

                <Modal show={modal} setShow={(modal) => { setModal(modal); setVerifying(false); setLoading(false); }}>

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
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                                value={verifying ? "Verifying" : "Verify"}
                                disabled={verifying}
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