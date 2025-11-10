"use client"

import Modal from "@/app/components/Modal";
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
                <Modal show={show} setShow={setShow}>

                    <iframe
                        src={user?.resume}
                        className="w-full flex-grow h-[93vh]"
                        title="Hasith Wijesinghe CV"
                    />

                </Modal>
            }

        </div>

    );

}