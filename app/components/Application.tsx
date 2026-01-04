import Image from "next/image";
import Clock from '../../public/assets/clock.png';
import Contact from '../../public/assets/contact.png';

export default function Application({ _id, role, type, status, createdAt, showJd, contact, period, cancel }: { _id: string, role: string, type: string, status: string, createdAt: string, showJd: () => void, contact: string, period: string, cancel: () => void }) {

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (

        <div key={_id} className=" border min-w-[200px] sm:min-w-[290px] mx-4 my-4 pb-3 px-2 bg-black/10 rounded-xl hover:bg-black/30 hover:text-white hover:cursor-pointer">

            <div className="text-sm sm:text-[13px] flex flex-row justify-between pt-2">

                <p>{role == "SE" ? "Software Engineering Intern" : role == "QA" ? "Quality Assuarance Intern" : "N/A"}</p>
                <p className="bg-blue-300 rounded-lg px-2 pb-[2px] font-semibold">{type == "remote" ? "Remote" : type == "hybrid" ? "Hybrid" : "Onsite"}</p>
                {/* <div className="flex flex-row justify-between">

                    <button className={`px-1 pb-1 font-bold rounded-lg text-white ${status == 'pending' ? 'bg-yellow-400' : status == 'cancelled' ? 'bg-red-400' : status == 'rejected' ? 'bg-black' : 'bg-green-400'}`}>{status}</button>

                </div> */}

            </div>


            <div className="flex flex-row pb-3 py-2 gap-2">

                <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                    <Image src={Clock} alt="period" width={16} />
                    <p className="font-bold flex items-center">{period[0]} {period.endsWith("m") ? "Months" : "Years"}</p>
                </div>

                <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                    <Image src={Contact} alt="company name" width={16} />
                    <p className="font-bold flex items-center">{contact}</p>
                </div>

            </div>

            <div className="w-full flex flex-row justify-between items-center mt-1">
                <div className='flex flex-row sm:gap-2 gap-0 justify-between sm:justify-normal w-[83%] text-sm sm:text-[15px]'>

                    <button onClick={showJd} className="w-[50%] bg-green-400 px-1 rounded-lg text-white pb-[2px] hover:border-b-green-600 hover:border">{status == 'cancelled' ? 'Reapply' : status == 'recruited' ? 'Confirm' : 'View'}</button>
                    {!["cancelled", "rejected", "recruited", "hired"].includes(status) && <button onClick={cancel} className="w-[50%] bg-red-400 rounded-lg text-white pb-[2px] hover:border-b-red-600 hover:border">Cancel</button>}
                    {status == "hired" && <p className="font-bold">Hired</p>}

                </div>
                <div className="flex flex-row w-full h-4 items-start justify-end">
                    <p className=" text-sm items-start">{days[new Date(createdAt).getDay()]},</p>
                    <p className=" text-sm items-start">{new Date(createdAt).getDate()} {months[new Date(createdAt).getMonth()]}</p>
                </div>

            </div>

        </div>

    );

}