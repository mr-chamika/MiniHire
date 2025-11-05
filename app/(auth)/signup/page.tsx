'use client'

import Image from 'next/image'
import Company from '../../../public/assets/company.jpg'
import Student from '../../../public/assets/student.jpg'
import { useRouter } from 'next/navigation'

export default function Signup() {

    const router = useRouter();

    return (

        <div className="min-h-screen w-full px-10 py-3">

            <div className=" w-full flex justify-center mb-10">
                <h1 className='text-6xl font-semibold'>Choose Your Role First</h1>
            </div>
            <div className="space-x-10 flex flex-row justify-around w-full">


                <div className="items-center flex flex-col pt-5">

                    <Image src={Company} alt="company" className='w-[95%] h-[60%]' />
                    <p className="py-5 text-justify px-4">

                        MiniHelp simplifies the process for companies to find talented interns
                        by providing an easy-to-use dashboard for posting opportunities,
                        managing applications, and reviewing detailed student profiles.
                        Businesses can communicate directly with potential interns,
                        ensuring a smoother recruitment process. With verified applicants
                        and organized insights, companies can focus on building strong teams
                        while contributing to the growth of future professionals.

                    </p>
                    <button onClick={() => router.push('/company')} className="w-[75%] text-white bg-black rounded-lg px-2 pb-0.5 text-lg font-bold hover:cursor-pointer h-14 hover:shadow-xl">Sign Up as Company</button>


                </div>
                <div className="border-l-2 border-gray-200"></div>
                <div className="items-center flex flex-col pt-5">

                    <Image src={Student} alt="company" className='w-[95%] h-[60%]' />
                    <p className="py-5 text-justify px-4">

                        MiniHelp empowers students to easily discover and apply for
                        verified internship opportunities across various industries.
                        Applicants can build a professional profile that highlights their
                        skills, education, and goals — allowing companies to notice them
                        without needing to send resumes repeatedly. With real-time communication
                        tools, students can directly connect with employers, track their application
                        progress, and gain confidence knowing that all listings are verified and trustworthy.


                    </p>
                    <button onClick={() => router.push('/student')} className="w-[75%] text-white bg-black rounded-lg px-2 pb-0.5 text-lg font-bold hover:cursor-pointer h-14 hover:shadow-xl">Sign Up as Student</button>


                </div>

            </div>

        </div>

    )

}