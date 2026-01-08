'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import Image from "next/image";

import Profile from '../../public/assets/profile.png'
import { jwtDecode } from "jwt-decode";
import Alert from "./Alert";

interface Token {

    userId: string;
    role: string;
    verified: boolean;
    email: string;
    name: string;

}

interface Alert {

    show: boolean;
    close: () => void;
    message: string;
    type: 'success' | 'error';

}

export default function AuthTopbarLogged() {

    const route = useRouter();

    const [modal, setModal] = useState(false);
    const [toLanding, setToLanding] = useState(false);
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [isAlert, setIsAlert] = useState<Alert | null>(null);

    useEffect(() => {

        const tokenString = localStorage.getItem("token");

        if (!tokenString) { console.log('token not found'); setIsAlert({ show: true, close: close, message: "Token not found", type: "error" }); return; };

        const token: Token = jwtDecode(tokenString);

        setName(token.name);

        setRole(token.role);

    }, [])

    const logout = async () => {

        localStorage.removeItem("token");
        setModal(false);
        route.replace('/login');

    }

    const toProfile = async () => {

        const tokenString = localStorage.getItem("token");

        if (!tokenString) { console.log('token not found'); setIsAlert({ show: true, close: close, message: "Token not found", type: "error" }); return; };

        const token: Token = jwtDecode(tokenString);

        route.push(`/profile/${token.userId}`)

    }

    const redirect = async () => {

        localStorage.removeItem("token");
        route.replace('/');

    }

    return (
        <>
            <div className="bg-green-300 fixed h-20 w-full px-4 flex-row justify-between flex">

                <div title="Back to landing page" onClick={() => setToLanding(true)} className="items-center h-full flex hover:cursor-pointer">

                    <p className="bg-blue-600 p-3 rounded-lg text-white font-serif">MiniHire</p>

                </div>

                <div className="w-[80%] flex justify-center items-center">

                    <p className="text-sm sm:text-3xl font-bold font-[Montserrat]">Welcome {name.charAt(0).toUpperCase() + name.slice(1)} !</p>

                </div>

                <div className="flex items-center gap-4">

                    {role != "admin" && <button className="hover:cursor-pointer bg-white rounded-full px-1 pt-1" onClick={toProfile}><Image className="rounded-full max-w-10 h-10" src={Profile} alt="Profile picture" /></button>}
                    <button className="bg-red-500 text-white font-bold px-3 pb-2 pt-1 rounded-md hover:cursor-pointer" onClick={() => setModal(true)}>Logout</button>

                </div>

            </div>

            {toLanding &&

                <Modal show={toLanding} setShow={setToLanding}>

                    <div className="flex justify-center items-center h-screen">
                        <div className="bg-white w-96 h-52 rounded-[30px] flex flex-col justify-around">

                            <h1 className="text-center text-xl font-sans w-full">This action will automatically logout you from the application. Are you sure you want to allow this action ?</h1>

                            <div className="w-full justify-around flex">

                                <button onClick={redirect} className="border px-5 py-1 bg-green-500 border-green-300 text-white rounded-xl hover:bg-transparent hover:border-none hover:text-green-500 hover:font-bold">Confirm</button>
                                <button onClick={() => setToLanding(false)} className="border px-5 py-1 bg-red-500 border-red-300 text-white rounded-xl hover:bg-transparent hover:border-none hover:text-red-500 hover:font-bold">Cancel</button>

                            </div>

                        </div>
                    </div>

                </Modal>

            }

            {modal &&

                <Modal show={modal} setShow={setModal}>

                    <div className="flex justify-center items-center h-screen">
                        <div className="bg-white w-96 h-52 rounded-[30px] flex flex-col justify-around">

                            <h1 className="text-center text-xl font-sans w-full">Are you sure you want to Logout ?</h1>

                            <div className="w-full justify-around flex">

                                <button onClick={logout} className="border px-5 py-1 bg-green-500 border-green-300 text-white rounded-xl hover:bg-transparent hover:border-none hover:text-green-500 hover:font-bold">Confirm</button>
                                <button onClick={() => setModal(false)} className="border px-5 py-1 bg-red-500 border-red-300 text-white rounded-xl hover:bg-transparent hover:border-none hover:text-red-500 hover:font-bold">Cancel</button>

                            </div>

                        </div>
                    </div>

                </Modal>


            }

            {isAlert?.show &&

                <Alert show={isAlert.show} close={close} type={isAlert.type} message={isAlert.message} />

            }

        </>
    )

}