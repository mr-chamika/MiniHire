'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import Image from "next/image";

import Profile from '../../public/assets/profile.jpg'
import { jwtDecode } from "jwt-decode";

interface Token {

    userId: string;
    role: string;
    verified: boolean;
    email: string;

}

export default function AuthTopbarLogged() {

    const route = useRouter();

    const [modal, setModal] = useState(false);

    const logout = async () => {

        localStorage.removeItem("token");
        setModal(false);
        route.replace('/login');

    }

    const toProfile = async () => {

        const tokenString = localStorage.getItem("token");

        if (!tokenString) { alert('token not found'); return; };

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

                <div onClick={redirect} className="items-center h-full flex">

                    <p className="bg-blue-600 p-3 rounded-lg text-white font-serif">MiniHire</p>

                </div>

                <div className="flex items-center gap-4">

                    <button className="hover:cursor-pointer" onClick={toProfile}><Image className="rounded-full w-10 h-10" src={Profile} alt="Profile picture" /></button>
                    <button className="bg-red-500 text-white font-bold px-3 pb-2 pt-1 rounded-md hover:cursor-pointer" onClick={() => setModal(true)}>Logout</button>

                </div>

            </div>

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

        </>
    )

}