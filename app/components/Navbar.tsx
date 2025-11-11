'use client'


import Image from "next/image";
import Link from "next/link";
import Linkedin from '../../public/assets/linkedin.png'
import Facebook from '../../public/assets/facebook.png'
import Github from '../../public/assets/github.png'

export default function Navbar() {

    return (

        <footer className="bg-black h-20 p-5 fixed w-full text-white bottom-0 left-0">

            <ul className="flex h-full items-center flex-row gap-8 w-full justify-center">

                <li><Link href='/about'>About</Link></li>
                <li><Link href='/contactus'>Contact Us</Link></li>
                <li><Link href='https://www.linkedin.com/in/hasith-wijesinghe-3394062a2/'><Image className="p-1" src={Linkedin} width="25" alt="linkedin" /></Link></li>
                <li><Link href='https://web.facebook.com/last.hista'><Image className="p-1" src={Facebook} width="30" alt="linkedin" /></Link></li>
                <li><Link href='https://github.com/mr-chamika'><Image className="p-1" src={Github} width="30" alt="linkedin" /></Link></li>

            </ul>

        </footer>

    )

}