
import Clock from '../../public/assets/clock.png';
import Vacancy from '../../public/assets/male.png';
import Contact from '../../public/assets/contact.png';
import Image from 'next/image';
import On from '../../public/assets/yes.png';
import Off from '../../public/assets/no.png';
import { useState } from 'react';
import axios from 'axios';

export default function Post_Student({ _id, role, type, description, period, contactNumber, createdAt, companyName, mark, saved }: { _id: string, role: string, type: string, description: string, period: string, contactNumber: string, createdAt: string, companyName: string, mark: () => void, saved: string[] }) {

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


    return (

        <div key={_id} className="border min-w-[200px] sm:min-w-[430px] mx-4 my-4 pb-3 px-2 bg-black/10 rounded-xl hover:bg-black/30 hover:text-white hover:cursor-pointer">

            <div className="text-sm sm:text-lg flex flex-row justify-between pt-2">

                <p>{role == "SE" ? "Software Engineering Intern" : role == "QA" ? "Quality Assuarance Intern" : "N/A"} | {type == "remote" ? "Remote" : type == "hybrid" ? "Hybrid" : "Onsite"}</p>
                <div className="flex flex-row justify-between gap-2">

                    <button className="px-2 rounded-lg text-white" onClick={mark}><Image src={saved.includes(_id) ? On : Off} alt="fav icon" width={22} /></button>
                    <button className="bg-green-400 px-2 rounded-lg text-white pb-[2px] hover:border-b-green-600 hover:border">Apply</button>

                </div>

            </div>

            <p className="italic text-sm mr-16 ml-10 min-w-[50%] text-justify py-3">{description}</p>

            <div className="px-4 w-full flex flex-row justify-between pt-1">
                <div className='flex flex-row sm:gap-2 gap-0 justify-between sm:justify-normal w-[83%] text-sm sm:text-lg'>
                    <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                        <Image src={Clock} alt="period" width={16} />
                        <p className="font-bold flex items-center">{period[0]} {period.endsWith("m") ? "Months" : "Years"}</p>
                    </div>

                    <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                        <Image src={Vacancy} alt="company name" width={16} />
                        <p className="font-bold flex items-center">{companyName}</p>
                    </div>
                    <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                        <Image src={Contact} alt="contact no" width={16} />
                        <p className="font-bold flex items-center">{contactNumber}</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-0 sm:gap-1 h-4 items-center">
                    <p className=" text-sm items-start">{days[new Date(createdAt).getDay()]},</p>
                    <p className=" text-sm items-start">{new Date(createdAt).getDay()} {months[new Date(createdAt).getMonth()]}</p>
                </div>

            </div>

        </div>

    );

}