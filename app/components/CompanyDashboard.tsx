'use client'

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Post_Company from "./Post_Company";
import Application_Company from "./Application_Company"
import Image from "next/image";

interface Token {

    userId: string;
    role: string;
    verified: boolean;
    email: string;

}

interface Post {

    _id: string;
    createdBy: string;
    companyName: string;
    companyAddress: string;
    creatorName: string;
    role: string;
    contactNumber: string;
    vacancies: Number;
    recruited: Number;
    type: string;
    period: string;
    description: string,
    country: string;
    createdAt: string;
    updatedAt: string;
}

interface Application {

    //details of post
    role: string;
    period: string;
    type: string;

    //details of application
    firstName: string;
    lastName: string;
    email: string;
    university: string;
    resume: string;
    portfolio: string;
    linkedin: string;
    post_id: string;
    _id: string;
    degree: string;
    createdAt: string;
    status: string;

}

interface Form {

    _id: string;
    firstName: string;
    lastName: string;
    university: string;
    degree: string;
    portfolio: string;
    linkedin: string;
    resume: string;
    post_id: string;
    jd: string;

}

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
    const [jd, setJd] = useState<File | null>(null);//input of job description when create a job post by company
    const [jdCompany, setJdCompany] = useState('');
    const [vacancies, setVacancies] = useState(1);
    const [desc, setDesc] = useState('');
    const [filter, setFilter] = useState("pending");
    const [showJd, setShowJd] = useState(false);
    const [hide, setHide] = useState(false);


    const [load, setLoad] = useState(false);

    const [myPosts, setMyPosts] = useState<Post[] | null>(null)
    const [applications, setApplications] = useState<Application[] | null>(null)

    const [data, setData] = useState<Form>(
        {
            _id: '',
            firstName: '',
            lastName: '',
            university: '',
            degree: '',
            portfolio: '',
            linkedin: '',
            resume: '',
            post_id: '',
            jd: ''
        }
    );

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

        const getMyPosts = async () => {

            try {

                const tokenString = localStorage.getItem("token");

                if (!tokenString) { alert('Token not found. Try again..'); return; }

                const token: Token = jwtDecode(tokenString);

                const encoded = encodeURIComponent(token.userId);

                const res = await axios.get(`/api/posts?by=${encoded}`);

                if (res.status != 200) {

                    alert('No such registered company');
                    return;

                }

                const data = res.data;

                if (!data) {

                    alert('Check connection issues');
                    setMyPosts([]);
                    return;

                }

                setMyPosts(data);

            } catch (err) {

                alert("Error fetching company: " + err);

            }
        }

        const getApplications = async () => {//to get applications sent by users to this company

            const encoded = encodeURIComponent(email);

            try {

                const res = await axios.get(`/api/applications?toCompany=${encoded}`);

                if (res.status != 200) {

                    alert('No applications sent');
                    return;

                }

                const data = res.data;
                console.log(data)
                if (!data) {

                    alert('Check connection issues');
                    setApplications([]);
                    return;

                }

                setApplications(data);

            } catch (err) {

                alert("Error fetching posts: " + err);
                setApplications([]);

            }

        }


        getNameAndContact();
        getMyPosts();
        getApplications();

    }, [modal, load])

    const handleSubmit = async (e: any) => {

        e.preventDefault();

        try {

            if (!jd) { alert('please upload your job description....'); return; }

            const tokenString = localStorage.getItem("token");

            if (!tokenString) { alert('Token not found. Try again..'); return; }

            const token: Token = jwtDecode(tokenString);

            const formData = new FormData();

            formData.append("createdBy", token.userId);
            formData.append("companyName", companyName);
            formData.append("contactNumber", contact);
            formData.append("companyAddress", address);
            formData.append("creatorName", creator);
            formData.append("vacancies", vacancies.toString());
            formData.append("role", role);
            formData.append("type", type);
            formData.append("period", period);
            formData.append("jd", jd);
            formData.append("description", desc);

            const res = await axios.post('/api/posts', formData)

            if (res.status != 200) {

                alert('Check your internet connection');
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
            setJd(null);
            setVacancies(1);
            setDesc('');

        } catch (err) {

            alert('Creating Job Post Failed.');

        }
    }

    const close = async () => {

        setShowJd(false);
        setHide(false);

    }

    const review = async (x: string) => {

        try {

            const encoded = encodeURIComponent(x);

            const formData = new FormData();

            formData.append("id", data._id);
            formData.append("review", encoded);

            try {

                const res = await axios.put('/api/applications', formData);

                if (res.status != 200) {

                    alert('Check your connection');
                    return;

                }

                if (res.data.message) {

                    alert(res.data.message);
                    return;

                }

                if (res.data.done == 'true') {

                    alert('Application Reviewed sucessfully.');
                    close();
                    setLoad(!load);

                }

            } catch (err) {

                alert("Failed to cancel sent application...");
                close();
                return;

            }

        } catch (err) {

            alert('Reviewing Application failed');
            close();

        }

    }

    const showJD = async (id: string) => {//to show the job description after click on the student post Card

        try {

            const encoded = encodeURIComponent(id);

            const res = await axios.get(`/api/applications?id=${encoded}`);

            if (res.status != 200) {

                alert('Check your internet connection');
                return;

            }

            if (res.data.message) {

                alert(res.data.message);

            }

            if (!res.data.jd) {

                alert('No Job description added');
                return;

            }

            setJdCompany(res.data.jd);
            setData({ ...res.data._doc, jd: res.data.jd })
            setShowJd(true);

        } catch (err) {

            alert("Error showing job description: " + err);
            return;

        }

    }


    return (

        <div className="w-full flex flex-col min-w-[400px]">

            <div className="mb-5 flex justify-end m-3">
                <div onClick={() => setModal(true)} className="flex-row flex gap-[3px] border px-2 pr-3 items-center pb-[2px] rounded-xl bg-black text-white  hover:cursor-pointer hover:shadow-md shadow-gray-400">
                    <p className="text-[19px] font-bold">+</p>
                    <h1 className="flex items-center font-bold">Create a Post</h1>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-2 px-2 min-w-[400px]">

                {/* shortlisted student list */}
                <section className="sm:w-[25%] w-full bg-yellow-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Shortlist</p>
                </section>

                {/* this company created job post list */}
                <section className="sm:w-[80%] min-h-[78vh] w-full rounded-lg bg-blue-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">My Posts {myPosts && myPosts.length > 0 ? '(' + myPosts?.length + ')' : ''}</p>
                    <div className="overflow-y-auto scroll-smooth w-full h-[73vh] scrollbar-hide">
                        {myPosts?.length == 0 ?

                            <div className="h-full w-full flex justify-center items-center">

                                <p className="opacity-50">No Posts Yet</p>

                            </div>
                            :
                            <div>

                                {myPosts?.map((post) => {

                                    return (

                                        <Post_Company

                                            key={post._id}
                                            _id={post._id}
                                            role={post.role}
                                            type={post.type}
                                            description={post.description}
                                            period={post.period}
                                            recruited={post.recruited.toString()}
                                            vacancies={post.vacancies.toString()}
                                            creatorName={post.creatorName}
                                            createdAt={post.createdAt}

                                        />

                                    )

                                })}

                            </div>

                        }
                    </div>
                </section>

                {/* applications list received by students */}
                <section className="sm:w-[25%] sm:min-w-[320px] w-full bg-yellow-50">
                    <div className="flex flex-row gap-6 justify-end border-b-2 border-slate-100">
                        <p className="pt-2 text-center text-xl font-mono">Sent {applications && applications.length > 0 ? '(' + applications?.length + ')' : ''}</p>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`appearance-none bg-inherit bg-slate-100 h-7 hover:cursor-pointer pr-2 pb-[2px] outline-none self-center rounded-lg pl-3 border-2 ${filter == 'selected' ? 'border-green-400' : filter == 'pending' ? 'border-yellow-400' : filter == 'cancelled' ? 'border-red-400' : 'border-black'}`}>

                            <option value="selected">Selected {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'selected').length + ')' : ''}</option>
                            <option value="pending">Pending {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'pending').length + ')' : ''}</option>
                            <option value="rejected">Rejected {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'rejected').length + ')' : ''}</option>
                            <option value="cancelled">Cancelled {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'cancelled').length + ')' : ''}</option>

                        </select>
                    </div>

                    <div className="w-full h-[73vh] overflow-y-auto scroll-smooth overflow-x-hidden scrollbar-hide">
                        {applications?.filter((app) => app.status == filter).length == 0 ?

                            <div className="h-full w-full flex justify-center items-center">

                                <p className="opacity-50">No Applications Yet</p>

                            </div>
                            :
                            <div>

                                {applications?.filter((app) => app.status == filter).map((application) => {

                                    return (

                                        <Application_Company

                                            key={application._id}
                                            _id={application._id}
                                            role={application.role}
                                            type={application.type}
                                            status={application.status}
                                            createdAt={application.createdAt}
                                            showJd={() => showJD(application._id)}
                                            firstName={application.firstName}
                                            degree={application.degree}
                                            cancel={() => review("cancelled")}
                                            lastName={application.lastName}

                                        />

                                    )

                                })}

                            </div>

                        }
                    </div>

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

                                        <label className="text-lg text-gray-500">Job Description</label>
                                        <input required type="file" accept="image/jpeg" onChange={(e) => { e.target.files && e.target.files.length > 0 && setJd(e.target.files[0]) }} className="file:border-none file:bg-transparent file:font-bold file:text-blue-500 file:bg-gray-200 file:rounded-md file:shadow-sm file:cursor-pointer outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>

                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Description {desc.length}/150</label>
                                        <input required type="text" value={desc} minLength={100} maxLength={150} onChange={(e) => setDesc(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                </div>
                            </div>
                            <input type="submit" value='Create Job Post' className="outline-none bg-green-500 text-white sm:w-[40%] w-full py-1 mt-8 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />

                        </form>
                    </div>
                </Modal>

            }

            {showJd &&
                <Modal show={showJd} setShow={close}>
                    <div className={`py-2 scroll-smooth overflow-y-auto max-h-[86vh] flex flex-row items-center scrollbar-hide`}>
                        <div className="w-full h-[85vh]">
                            {jdCompany?.endsWith('.jpg') &&
                                <div className="flex justify-center items-center w-full">
                                    <div className="flex items-center justify-center w-[80%] h-full">
                                        <Image src={jdCompany} alt="Your Logo" height={600} width={600} />
                                    </div>
                                </div>}
                        </div>

                        <div className="w-full flex flex-col h-[85vh]">

                            <iframe
                                src={`${data?.resume}`}
                                className=" w-[95%] h-[41vh] sm:h-[81vh]"
                                title="Hasith Wijesinghe CV"
                            />
                        </div>

                    </div>
                    <div className="w-full justify-center flex gap-10 ">
                        <div onClick={() => review("selected")} className="w-[50%] sm:w-[38%] py-2  flex justify-center items-center text-lg font-bold bg-green-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-green-300 hover:bg-transparent shadow-black">Accept</div>
                        <div onClick={() => review("rejected")} className="w-[50%] sm:w-[38%] py-2  flex justify-center items-center text-lg font-bold bg-red-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-red-300 hover:bg-transparent shadow-black">Reject</div>
                    </div>
                </Modal>
            }

        </div>

    );

}