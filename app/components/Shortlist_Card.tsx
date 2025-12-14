import Image from "next/image";
import Student from '../../public/assets/students.png';
import Degree from '../../public/assets/degree.png';
import Star from '../../public/assets/stars.png';
import Linkedin from '../../public/assets/linkedins.png';
import Global from '../../public/assets/global.png';

export default function Shortlist_Card({ _id, marks, status, createdAt, firstName, degree, lastName, university, linkedin, portfolio, setShowInvite }: { _id: string, marks: number, status: string, createdAt: string, showJd: () => void, firstName: string, lastName: string, degree: string, university: string, linkedin: string, portfolio: string, setShowInvite: () => void }) {

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    /*sending a email to candidate by open a new tab*/
    // const handleEmailClick = () => {

    //     window.open(
    //         `https://mail.google.com/mail/?view=cm&to=${email}&su=Interview Invitation from ${companyName}&body=Hello ${firstName[0].toUpperCase() + firstName.slice(1)},`,
    //         "_blank"
    //     )

    // };

    return (

        <div key={_id} className=" border min-w-[200px] sm:min-w-[290px] mx-4 my-4 pb-3 px-2 bg-black/10 rounded-xl hover:bg-black/30 hover:text-white hover:cursor-pointer">

            <div className="text-sm sm:text-[13px] flex flex-row justify-between pt-2">

                {/* <p>{role == "SE" ? "Software Engineering Intern" : role == "QA" ? "Quality Assuarance Intern" : "N/A"}</p> */}
                <p className="text-[18px] font-bold font-[Montserrat]">{firstName[0].toUpperCase() + firstName.slice(1)} {lastName[0].toUpperCase() + lastName.slice(1)}</p>
                <p className="bg-blue-300 rounded-lg px-2 pb-[2px] font-semibold">{university}</p>
                {/* <div className="flex flex-row justify-between">

                    <button className={`px-1 pb-1 font-bold rounded-lg text-white ${status == 'pending' ? 'bg-yellow-400' : status == 'cancelled' ? 'bg-red-400' : status == 'rejected' ? 'bg-black' : 'bg-green-400'}`}>{status}</button>

                </div> */}

            </div>


            <div className="flex flex-row pb-3 py-2 gap-2">

                <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                    <Image src={Degree} alt="degree" width={16} />
                    <p className="font-bold flex items-center">{degree}</p>
                </div>

                <div className="flex flex-col items-center mb-3 sm:mb-0 sm:flex-row gap-1 h-4">
                    <Image src={Star} alt="company name" width={16} className=" bg-black pb-[1px]" />
                    <p className="font-bold flex items-center">{marks}/10</p>
                </div>

            </div>

            <div className="w-full flex flex-row justify-between items-center mt-1">
                <div className='flex flex-row sm:gap-1 gap-0 justify-between sm:justify-normal w-[90%] text-sm sm:text-[15px]'>

                    {/* <button onClick={showJd} className="w-[60%] bg-green-400 rounded-lg mr-3 text-white pb-[2px] hover:border-b-green-600 hover:border">{["cancelled", "rejected"].includes(status) ? 'View' : 'Interview Mail'}</button> */}
                    <button onClick={setShowInvite} className="w-[60%] bg-green-400 rounded-lg mr-3 text-white pb-[2px] hover:border-b-green-600 hover:border">{["cancelled", "rejected"].includes(status) ? 'View' : 'Interview Mail'}</button>
                    <a href={linkedin}><Image src={Linkedin} alt="degree" width={20} /></a>
                    <a href={portfolio}><Image src={Global} alt="degree" width={20} /></a>

                    {/* {!["cancelled", "rejected"].includes(status) && <button onClick={cancel} className="w-[50%] bg-red-400 rounded-lg text-white pb-[2px] hover:border-b-red-600 hover:border">Reject</button>} */}

                </div>
                <div className="flex flex-row w-[30%] h-4 items-start justify-end">
                    <p className=" text-sm items-start">{days[new Date(createdAt).getDay()]},</p>
                    <p className=" text-sm items-start">{new Date(createdAt).getDate()} {months[new Date(createdAt).getMonth()]}</p>
                </div>

            </div>

        </div>

    );

}