"use client"

import Modal from "@/app/components/Modal";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    linkedin: string;
    portfolio: string;
    resume: string;
    degree: string;
    university: string;
    verified: boolean;

    logo: string;
}

export default function Profile({ params }: { params: Promise<{ id: string }> }) {

    const [id, setId] = useState('');
    const [user, setUser] = useState<User | null>(null)
    const [show, setShow] = useState(false);

    useEffect(() => {

        const inside = async () => {

            const { id } = await params;

            try {
                setId(id);

                const res = await axios.get(`/api/users?id=${id}`)

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
                <Modal show={show} setShow={setShow}>

                    {user?.resume?.endsWith('.pdf') ? <iframe
                        src={user?.resume}
                        className="w-full flex-grow h-[93vh]"
                        title="Hasith Wijesinghe CV"
                    />
                        : user?.logo?.endsWith('.jpg') ?
                            <div className="flex justify-center items-center h-screen">
                                <div className="flex items-center justify-center bg-white w-56 h-56">
                                    <Image src={user?.logo} alt="Your Logo" height={200} width={200} />
                                </div>
                            </div>
                            :
                            <div className="flex justify-center items-center h-screen">
                                <div className="flex items-center justify-center bg-white w-96 h-48">
                                    <p>Unsupported Format</p>
                                </div>
                            </div>
                    }

                </Modal>
            }

        </div>

    );

}