"use client"

import axios from "axios";
import { useEffect, useState } from "react";

interface Student {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    degree: string;
    university: string;
}

export default function Profile({ params }: { params: Promise<{ id: string }> }) {

    const [id, setId] = useState('');
    const [user, setUser] = useState<Student | null>(null)
    const [show, setShow] = useState(false);

    useEffect(() => {

        const inside = async () => {

            const { id } = await params;

            try {
                setId(id);

                const res = await axios.get(`/api/students?id=${id}`)

                if (res.status != 200) {

                    alert('Error');
                    return;

                }

                setUser(res.data);

            } catch (err) {

                console.log('Error from profile: ' + err);

            }


        }

        inside();

    }, [id])

    return (

        <div>

            <button onClick={() => setShow(true)}>Show CV</button>
            {show &&
                <div className='fixed z-50 top-0 w-full h-full bg-white'>
                    <div className="flex justify-end">

                        <button

                            className="bg-red-400 text-white rounded-full m-2 px-2 py-0.5 border-2 hover:cursor-pointer hover:bg-red-500"
                            onClick={() => setShow(false)}
                        >
                            X
                        </button>

                    </div>
                    <iframe
                        src={user?.resume}
                        className="w-full flex-grow h-[93vh]"
                        title="Hasith Wijesinghe CV"
                    >
                    </iframe>
                </div>
            }

        </div>

    );

}