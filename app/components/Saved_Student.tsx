
import Clock from '../../public/assets/clock.png';
import Vacancy from '../../public/assets/male.png';
import Contact from '../../public/assets/contact.png';
import Image from 'next/image';
import On from '../../public/assets/yes.png';
import Off from '../../public/assets/no.png';
import { useState } from 'react';

export default function Saved_Student({ _id, role, type, description, createdAt, mark, showJd }: { _id: string, role: string, type: string, description: string, createdAt: string, mark: () => void, showJd: () => void }) {

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (

        <div key={_id} className=" border min-w-[200px] sm:min-w-[290px] mx-4 my-4 pb-3 px-2 bg-black/10 rounded-xl hover:bg-black/30 hover:text-white hover:cursor-pointer">

            <div className="text-sm sm:text-[14px] flex flex-row justify-between pt-2">

                <p>{role == "SE" ? "Software Engineering Intern" : role == "QA" ? "Quality Assuarance Intern" : "N/A"} | {type == "remote" ? "Remote" : type == "hybrid" ? "Hybrid" : "Onsite"}</p>
                <div className="flex flex-row justify-between gap-2">

                    <button className="px-2 rounded-lg text-white"><Image onClick={mark} className='w-6' src={On} alt="fav icon" width={22} /></button>

                </div>

            </div>

            <p className="italic text-sm px-5 min-w-[50%] text-justify py-2 break-words">{description.slice(0, 70)}...</p>

            <div className="px-4 w-full flex flex-row justify-between items-center">
                <div className='flex flex-row sm:gap-2 gap-0 justify-between sm:justify-normal w-[83%] text-sm sm:text-lg'>

                    <button onClick={showJd} className="w-full bg-green-400 px-2 rounded-lg text-white pb-[2px] hover:border-b-green-600 hover:border">View Now</button>

                </div>
                <div className="flex flex-row w-full h-4 items-center justify-end">
                    <p className=" text-sm items-start">{days[new Date(createdAt).getDay()]},</p>
                    <p className=" text-sm items-start">{new Date(createdAt).getDate()} {months[new Date(createdAt).getMonth()]}</p>
                </div>

            </div>

        </div>

    );

}