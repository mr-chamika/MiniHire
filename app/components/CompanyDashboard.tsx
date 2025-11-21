'use client'

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";

export default function CompanyDashboard({ email }: { email: string }) {

    const roles = [

        { label: "Software Engineering", value: "SE" },
        { label: "Quality Assuarance", value: "QA" },

    ]

    const types = [

        { label: "OnSite", value: "onsite" },
        { label: "Hybrid", value: "hybrid" },
        { label: "Remote", value: "remote" },

    ]

    const periods = [

        { label: "6 Months", value: "6m" },
        { label: "1 Year", value: "1y" }

    ]

    const countries = [

        { label: "Sri Lanka", value: "sl" },
        { label: "United States of America", value: "usa" }

    ]

    const [modal, setModal] = useState(false);
    const [companyName, setCompanyName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const [creator, setCreator] = useState('');
    const [role, setRole] = useState(roles[0].value);
    const [type, setType] = useState(types[0].value);
    const [period, setPeriod] = useState(periods[0].value);
    const [country, setCountry] = useState(countries[0].value);
    const [vacancies, setVacancies] = useState(1);
    const [desc, setDesc] = useState('');


    const handleSubmit = async (e: any) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("companyName", companyName);
            formData.append("contactNumber", contact);
            formData.append("companyAddress", address);
            formData.append("creatorName", creator);
            formData.append("vacancies", vacancies.toString());
            formData.append("role", role);
            formData.append("type", type);
            formData.append("period", period);
            formData.append("country", country);
            formData.append("description", desc);

            const res = await axios.post('/api/users', formData)

            if (res.status != 200) {

                alert('Job post creation faild.');
                return;

            }

            if (res.data.message) {

                alert(res.data.message);

            }

            setModal(false);
            setAddress('');
            setCreator('');
            setRole(roles[0].value);
            setType(types[0].value);
            setPeriod(periods[0].value);
            setCountry(countries[0].value);
            setVacancies(1);
            setDesc('');

        } catch (err) {

            alert('Creating Job Post Failed.');

        }

    }

    useEffect(() => {

        const getNameAndContact = async () => {

            try {

                const res = await axios.get(`/api/users?email=${email}`);

                if (res.status != 200) {

                    alert('No such registered company');
                    return;

                }

                const data = res.data;

                if (!data) {

                    alert('Check connection issues');
                    return;

                }

                setCompanyName(data.name);
                setContact(data.contactNumber);

            } catch (err) {

                alert("Error fetching company: " + err);

            }
        }

        getNameAndContact();

    }, [])

    return (

        <div className="w-full">

            <div className="mb-5 flex justify-end m-3">
                <div onClick={() => setModal(true)} className="flex-row flex gap-[3px] border px-2 pr-3 items-center pb-[2px] rounded-xl bg-black text-white  hover:cursor-pointer hover:shadow-md shadow-gray-400">
                    <p className="text-[19px] font-bold">+</p>
                    <h1 className="flex items-center font-bold">Create a Post</h1>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 px-2">

                <section className="sm:w-[30%] w-full bg-yellow-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Shortlist</p>
                </section>

                <section className=" sm:w-[70%] min-h-[79vh] w-full rounded-lg bg-blue-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">My Posts</p>
                </section>

                <section className="sm:w-[30%] w-full bg-yellow-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Applications</p>
                </section>

            </div>

            {modal &&

                <Modal show={modal} setShow={setModal}>
                    <div className="justify-center items-center flex h-[90vh]">
                        <form onSubmit={handleSubmit} className="w-[72%] shadow-xl px-10 py-10 rounded-lg flex flex-col justify-between items-center bg-gray-50">
                            <div className=" gap-5 flex flex-col sm:flex-row space-x-0 sm:space-x-10 w-full">
                                <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Company Name</label>
                                        <input readOnly type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Contact Number</label>
                                        <input readOnly inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="0786715765" value={contact} onChange={(e) => setContact(e.target.value.replace(/[^0-9]/g, ''))} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Address</label>
                                        <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Your Name</label>
                                        <input required type="text" value={creator} onChange={(e) => setCreator(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Number of Vacancies</label>
                                        <input type="number" min={1} value={vacancies} onChange={(e) => setVacancies(Number(e.target.value))} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" />

                                    </div>
                                </div>
                                <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Role of the vacancy</label>
                                        <select value={role} onChange={(e) => setRole(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                            {roles.map((role) => (

                                                <option key={role.value} value={role.value}>{role.label}</option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Type</label>
                                        <select value={type} onChange={(e) => setType(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                            {types.map((type) => (

                                                <option key={type.value} value={type.value}>{type.label}</option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Period</label>
                                        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                            {periods.map((period) => (

                                                <option key={period.value} value={period.value}>{period.label}</option>
                                            ))}
                                        </select>

                                    </div>
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Country of candidates</label>
                                        <select value={country} onChange={(e) => setCountry(e.target.value)} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200" >

                                            {countries.map((country) => (

                                                <option key={country.value} value={country.value}>{country.label}</option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Description {desc.length}/100</label>
                                        <input type="text" value={desc} maxLength={100} onChange={(e) => setDesc(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                </div>
                            </div>
                            <input type="submit" value='Create Job Post' className="outline-none bg-green-500 text-white sm:w-[40%] w-full py-1 mt-8 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />

                        </form>
                    </div>
                </Modal>

            }

        </div>

    );

}