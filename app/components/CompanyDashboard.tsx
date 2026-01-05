'use client'

import { useEffect, useState } from "react";
import Modal from "./Modal";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Post_Company from "./Post_Company";
import Application_Company from "./Application_Company"
import Shortlist_Card from "./Shortlist_Card"
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
    status: string;
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
    marks: number;
    contactNumber: string

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
    status: string;
    marks: Number;
    email: string;
    address: string;
    role: string;
    companyName: string;
    period: string;
    type: string;

}

export default function CompanyDashboard({ email }: { email: string }) {

    const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

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
    const [filter2, setFilter2] = useState("SE");
    const [showJd, setShowJd] = useState(false);
    const [hide, setHide] = useState(false);
    const [marks, setMarks] = useState(0);
    const [showInvite, setShowInvite] = useState(false);//to display pop up to customize interview invitation email.
    const [sendSelected, setSendSelected] = useState(false);//to display pop up to send selected email.
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mailLoading, setMailLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPostId, setCurrentPostId] = useState('');
    const [originalData, setOriginalData] = useState({
        address: '',
        creator: '',
        role: roles[0].value,
        type: types[0].value,
        period: periods[0].value,
        vacancies: 1,
        desc: ''
    });

    //set states for invitation email to student

    const inviteTemplate = `
Thank you for your interest in the Intern position at our company. We 
were impressed by your background and would like to invite you to attend a virtual interview.

The interview details, including the scheduled time and meeting link, are provided below.
`

    const minDate = () => {

        const today = new Date();

        const yr = today.getFullYear();
        const month = today.getMonth() > 9 ? (today.getMonth() + 1).toString() : '0' + (today.getMonth() + 1).toString();
        const day = today.getDate() > 9 ? (today.getDate()).toString() : '0' + (today.getDate()).toString();

        return `${yr}-${month}-${day}`;

    }

    const getCurrentTime = () => {

        const now = new Date();


        const hours = String(now.getHours()).padStart(2, '0');


        const minutes = String(now.getMinutes()).padStart(2, '0');


        return `${hours}:${minutes}`;
    };

    const getMinTimeForDate = () => {

        const today = new Date();
        const selected = new Date(inviteDate);

        if (
            today.getFullYear() === selected.getFullYear() &&
            today.getMonth() === selected.getMonth() &&
            today.getDate() === selected.getDate()
        ) {

            const now = new Date();
            now.setSeconds(0, 0);
            now.setMinutes(now.getMinutes() + 1);
            return now.toTimeString().slice(0, 5);
        }

        return "00:00";
    };

    const getMinDate = minDate();
    const MinTime = getCurrentTime();

    const [inviteDate, setInviteDate] = useState(getMinDate)
    const [inviteTime, setInviteTime] = useState(MinTime)
    const [invite, setInvite] = useState(inviteTemplate)
    const [inviteLink, setInviteLink] = useState('https://meet.google.com/landing?hs=197&authuser=0')


    const [load, setLoad] = useState(false);

    const [myPosts, setMyPosts] = useState<Post[] | null>(null)
    const [applications, setApplications] = useState<Application[] | null>(null)
    const [shortlist, setShortList] = useState<Application[] | null>(null)

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
            jd: '',
            status: '',
            marks: 0,
            email: '',
            address: '',
            role: '',
            companyName: '',
            period: '',
            type: ''
        }
    );

    //states for selection letter

    const [selectedDate, setSelectedDate] = useState(getMinDate)
    const [selectedTime, setSelectedTime] = useState(MinTime)
    const [letter, setLetter] = useState('')

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

        const getShortlisted = async () => {//to get applications selected by this company

            const encoded = encodeURIComponent(email);

            try {

                const res = await axios.get(`/api/applications?selectedTo=${encoded}`);

                if (res.status != 200) {

                    alert('No applications selected');
                    return;

                }

                const data = res.data;
                if (!data) {

                    alert('Check connection issues');
                    setShortList([]);
                    return;

                }

                setShortList(data);

            } catch (err) {

                alert("Error fetching posts: " + err);
                setShortList([]);

            }

        }


        getNameAndContact();
        getMyPosts();
        getApplications();
        getShortlisted();

    }, [modal, load])

    const handleSubmit = async (e: any) => {

        e.preventDefault();
        setLoading(true);
        try {

            if (isEditing) {
                // Update logic
                const formData = new FormData();
                formData.append("action", "update");
                formData.append("_id", currentPostId);
                formData.append("companyAddress", address);
                formData.append("creatorName", creator);
                formData.append("role", role);
                formData.append("type", type);
                formData.append("period", period);
                formData.append("vacancies", vacancies.toString());
                formData.append("description", desc);

                if (jd) {

                    formData.append("jd", jd);

                }

                const res = await axios.put('/api/posts', formData);
                if (res.status !== 200) {
                    alert('Check your internet connection');
                    return;
                }
                if (res.data.message) {
                    alert(res.data.message);
                }
                setModal(false);
                setIsEditing(false);
                setCurrentPostId('');
                setJd(null);
                setJdCompany("");
                setLoad(!load);
            } else {


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
                console.log('hell1');

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

            }
        } catch (err) {

            setLoading(false);
            alert('Creating Job Post Failed.');

        } finally {

            setLoading(false);

        }
    }

    const close = async () => {

        setShowJd(false);
        setHide(false);
        setMarks(0)

    }

    const review = async (id = "", x: string) => {

        try {

            const encoded = encodeURIComponent(x);

            const formData = new FormData();

            formData.append("id", data._id || id);
            formData.append("review", encoded);

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

                if (data.marks != marks) {

                    marking();

                }

                alert('Application Reviewed sucessfully.');
                close();
                setLoad(!load);

            }

        } catch (err) {

            alert("Failed to cancel sent application...");
            close();
            return;

        }

    }

    const marking = async () => {

        try {

            const formData = new FormData();

            formData.append("id", data._id);
            formData.append("marks", marks.toString());

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

                alert('Application marked sucessfully.');

            }

        } catch (err) {

            alert("Failed to mark application...");
            close();
            return;

        }
    }

    const showJD = async (id: string, x = '') => {//to show the job description after click on the student post Card

        if (["cancelled"].includes(x)) { setHide(true); }
        if (["rejected"].includes(x)) { setHide(true); }

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
            setMarks(res.data._doc.marks)
        } catch (err) {

            alert("Error showing job description: " + err);
            return;

        }

    }

    const getInviteData = async (id: string) => {

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

            setData({ ...res.data._doc, jd: res.data.jd })
            setShowInvite(true);

        } catch (err) {

            alert("Error showing job description: " + err);
            return;

        }


    }
    const getSelectionData = async (id: string) => {

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

            setData({ ...res.data._doc, jd: res.data.jd, address: res.data.address, role: res.data.role, type: res.data.type, period: res.data.period })

            setLetter(`
We are pleased to inform you that you have been selected for the ${res.data.role} Internship at ${res.data.companyName}. After careful review of your application and interview, we were impressed 
with your skills, enthusiasm, and potential, and we believe you will be a valuable addition to our team.
    
Your internship is scheduled to commence on ${selectedDate.split("-")[2] + " " + months[parseInt(selectedDate.split("-")[1]) - 1] + " " + selectedDate.split("-")[0]} and will continue until ${data.period == '6m' ? '6 Months' : '1 Year'}. The internship will be conducted ${res.data.type}.
    
Further details regarding onboarding, reporting structure, and required documentation will be shared with you shortly.
    `)
            setSendSelected(true);

        } catch (err) {

            alert("Error showing job description: " + err);
            return;

        }


    }

    const handleSubmitEmail = async (e: any) => {

        e.preventDefault();
        setMailLoading(true);

        if (error) return;

        try {

            const formData = new FormData();

            formData.append("_id", data._id);
            formData.append("date", inviteDate.split("-")[2] + " " + months[parseInt(inviteDate.split("-")[1]) - 1] + " " + inviteDate.split("-")[0]);
            formData.append("time", (`${inviteTime.split(":")[0] > '12' ? parseInt(inviteTime.split(":")[0]) - 12 : inviteTime.split(":")[0]}`) + `:${inviteTime.split(":")[1]} ${inviteTime.split(":")[0] > '12' ? "PM" : "AM"}`);
            formData.append("name", data.firstName + " " + data.lastName);
            formData.append("email", data.email);
            formData.append("link", inviteLink);
            formData.append("invite", invite)

            const res = await axios.post('/api/applications', formData)

            if (res.status != 200) {

                setMailLoading(false);
                alert('Check your internet connection');
                return;

            }

            if (res.data.message) {

                alert(res.data.message);

            }

            if (res.data.done == 'true') {

                setLoad(!load)
                alert('email sent');
                setShowInvite(false)
                setInviteDate(getMinDate)
                setInviteTime(getMinTimeForDate())
                setMailLoading(false);
            }

        } catch (err) {

            setMailLoading(false);
            console.log("Error sending email: " + err);
            alert("Check your internet connection...")
            return;

        }
    }

    const handleSelected = async (e: any) => {//to send selected mail to student

        e.preventDefault();

        if (error) return;

        try {

            const formData = new FormData();

            formData.append("_id", data._id);
            formData.append("date", selectedDate.split("-")[2] + " " + months[parseInt(selectedDate.split("-")[1]) - 1] + " " + selectedDate.split("-")[0]);
            formData.append("time", (`${selectedTime.split(":")[0] > '12' ? parseInt(selectedTime.split(":")[0]) - 12 : selectedTime.split(":")[0]}`) + `:${selectedTime.split(":")[1]} ${selectedTime.split(":")[0] > '12' ? "PM" : "AM"}`);
            formData.append("name", data.firstName + " " + data.lastName);
            formData.append("email", data.email);
            formData.append("address", data.address);
            formData.append("letter", letter);
            formData.append("role", role);
            formData.append("type", type);


            const res = await axios.post('/api/applications', formData)

            if (res.status != 200) {

                alert('Check your internet connection');
                return;

            }

            if (res.data.message) {

                alert(res.data.message);

            }

            if (res.data.done == 'true') {

                alert('email sent');
                setSendSelected(false)
                setSelectedDate(getMinDate)
                setSelectedTime(getMinTimeForDate())
                setLoad(!load);
            }

        } catch (err) {

            console.log("Error sending email: " + err);
            alert("Check your internet connection...")
            return;

        }


    }

    const editing = async (id: string) => {

        const post = myPosts?.find(p => p._id === id);
        if (post) {
            setAddress(post.companyAddress);
            setCreator(post.creatorName);
            setRole(post.role);
            setType(post.type);
            setPeriod(post.period);
            setVacancies(Number(post.vacancies));
            setDesc(post.description);
            setOriginalData({
                address: post.companyAddress,
                creator: post.creatorName,
                role: post.role,
                type: post.type,
                period: post.period,
                vacancies: Number(post.vacancies),
                desc: post.description
            });

            try {
                const encoded = encodeURIComponent(id);
                const res = await axios.get(`/api/posts?id=${encoded}`);
                if (res.status === 200) {

                    setJdCompany(res.data.jd.split("/").pop())
                }
            } catch (err) {
                console.error("Error fetching JD:", err);
            }

            setCurrentPostId(id);
            setIsEditing(true);
            setModal(true);
        }
    };

    const hasChanged = () => {
        return address !== originalData.address ||
            creator !== originalData.creator ||
            role !== originalData.role ||
            type !== originalData.type ||
            period !== originalData.period ||
            vacancies !== originalData.vacancies ||
            desc !== originalData.desc ||
            jd !== null;
    };

    const hiding = async (id: string) => {

        const formData = new FormData();
        formData.append("action", "toggle_hide");
        formData.append("_id", id);

        try {
            const res = await axios.put('/api/posts', formData);
            if (res.status === 200) {

                if (res.data.message) {

                    alert(res.data.message);

                }
                setLoad(!load);
            } else {
                alert('Error toggling status');
            }
        } catch (err) {
            alert('Error: ' + err);
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
                <section className="sm:w-[25%] sm:min-w-[320px] w-full bg-yellow-50">
                    <div className="flex flex-row gap-6 justify-end border-b-2 border-slate-100">
                        <p className="pt-2 text-center text-xl font-mono">Shortlist {shortlist && shortlist.length > 0 ? '(' + shortlist.filter(app => ["selected", "interviewed", "recruited", "hired"].includes(app.status)).length + ')' : ''}</p>
                        <select value={filter2} onChange={(e) => setFilter2(e.target.value)} className={`appearance-none bg-inherit bg-slate-100 h-7 hover:cursor-pointer pr-2 pb-[2px] outline-none self-center rounded-lg pl-3 border-2 ${/*filter == 'selected' ? 'border-green-400' :*/ filter2 == 'SE' ? 'border-yellow-400' : filter2 == 'QA' ? 'border-red-400' : 'border-black'}`}>

                            {/* <option value="selected">Selected {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'selected').length + ')' : ''}</option> */}
                            <option value="SE">SE {shortlist && shortlist.length > 0 ? '(' + shortlist?.filter((app) => ['SE', 'CS'].includes(app.degree.split(" ")[0])).length + ')' : ''}</option>
                            <option value="QA">QA {shortlist && shortlist.length > 0 ? '(' + shortlist?.filter((app) => ['QA'].includes(app.degree.split(" ")[0])).length + ')' : ''}</option>
                            <option value="BA">BA {shortlist && shortlist.length > 0 ? '(' + shortlist?.filter((app) => ['BA'].includes(app.degree.split(" ")[0])).length + ')' : ''}</option>

                        </select>
                    </div>

                    <div className="w-full h-[73vh] overflow-y-auto scroll-smooth overflow-x-hidden scrollbar-hide">
                        {shortlist?.filter((app) => [filter2, "CS"].includes(app.degree.split(" ")[0])).length == 0 ?

                            <div className="h-full w-full flex justify-center items-center">

                                <p className="opacity-50">No Shortlisted applications</p>

                            </div>
                            :
                            <div>

                                {shortlist?.filter((app) => [filter2, "CS"].includes(app.degree.split(" ")[0])).map((application) => {

                                    return (

                                        <Shortlist_Card

                                            key={application._id}
                                            _id={application._id}
                                            status={application.status}
                                            createdAt={application.createdAt}
                                            showJd={() => showJD(application._id, application.status)}
                                            firstName={application.firstName}
                                            degree={application.degree}
                                            lastName={application.lastName}
                                            university={application.university}
                                            marks={application.marks}
                                            linkedin={application.linkedin}
                                            portfolio={application.portfolio}
                                            setShowInvite={() => getInviteData(application._id)}
                                            contact={application.contactNumber}
                                            selected={() => getSelectionData(application._id)}
                                            reject={() => review(application._id, "rejected")}


                                        />

                                    )

                                })}

                            </div>

                        }
                    </div>
                </section>

                {/* this company created job post list */}
                <section className="sm:w-[80%] sm:min-w-[500px] min-h-[78vh] w-full rounded-lg bg-blue-50">
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
                                            editing={() => editing(post._id)}
                                            hiding={() => hiding(post._id)}
                                            isHidden={post.status}

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
                        <p className="pt-2 text-center text-xl font-mono">Received {applications && applications.length > 0 ? '(' + applications.filter(app => !["selected", "interviewed", "recruited", "hired"].includes(app.status)).length + ')' : ''}</p>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)} className={`appearance-none bg-inherit bg-slate-100 h-7 hover:cursor-pointer pr-2 pb-[2px] outline-none self-center rounded-lg pl-3 border-2 ${/*filter == 'selected' ? 'border-green-400' :*/ filter == 'pending' ? 'border-yellow-400' : filter == 'cancelled' ? 'border-red-400' : 'border-black'}`}>

                            {/* <option value="selected">Selected {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'selected').length + ')' : ''}</option> */}
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
                                            showJd={() => showJD(application._id, application.status)}
                                            firstName={application.firstName}
                                            degree={application.degree}
                                            cancel={() => review("", "cancelled")}
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

                <Modal show={modal} setShow={(show) => { setModal(show); if (!show) { setIsEditing(false); setCurrentPostId(''); setAddress(''); setCreator(''); setRole(roles[0].value); setType(types[0].value); setPeriod(periods[0].value); setJd(null); setJdCompany(""); setDesc(''); } }}>
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
                                        <div className="flex items-center border border-blue-200 rounded-lg bg-blue-100 px-2 py-1 w-full">
                                            <input type="file" id="jdFile" hidden accept="image/jpeg" onChange={(e) => {
                                                if (e.target.files && e.target.files.length > 0) {
                                                    setJd(e.target.files[0]);
                                                    setJdCompany(e.target.files[0].name)
                                                }
                                            }} />
                                            <label htmlFor="jdFile" className="cursor-pointer bg-gray-200 text-blue-500 font-bold rounded-md px-2 py-1 shadow-sm mr-2">Choose File</label>
                                            <span className="text-gray-500 flex-1">{(jdCompany.length > 40 ? jdCompany.slice(0, 40) + "..." : jdCompany) || "No File Choosen"}</span>
                                        </div>

                                    </div>

                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Description {desc.length}/150</label>
                                        <input required type="text" value={desc} minLength={100} maxLength={150} onChange={(e) => setDesc(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                </div>
                            </div>
                            <input type="submit" disabled={loading || (isEditing && !hasChanged())} value={loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Job Post' : 'Create Job Post')} className="outline-none bg-green-500 text-white sm:w-[40%] w-full py-1 mt-8 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black disabled:opacity-50" />

                        </form>
                    </div>
                </Modal>

            }
            {showInvite &&

                <Modal show={showInvite} setShow={setShowInvite}>
                    <div className="justify-center items-center flex h-[90vh]">
                        <form onSubmit={handleSubmitEmail} className="w-[72%] shadow-xl px-10 py-2 rounded-lg flex flex-col justify-center items-center bg-gray-50 min-w-[380px]">
                            <div className=" space-y-2 min-w-[145px] w-full">
                                <div className="flex flex-row gap-5">
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Date</label>
                                        <input type="date" min={getMinDate} value={inviteDate} onChange={(e) => setInviteDate(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                    <div className="w-full flex flex-col">

                                        <label className="text-lg text-gray-500">Time</label>
                                        <input type="time" value={inviteTime} onChange={(e) => { if (e.target.value >= getMinTimeForDate()) { setInviteTime(e.target.value); setError('') } else { setInviteTime(e.target.value); setError('Please choose valid time') } }} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                        <div className="w-full h-2">
                                            <span className={` text-red-400 text-sm italic ${!error ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Candidate's Name</label>
                                    <input readOnly type="text" value={data.firstName + " " + data.lastName} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Candidate's Email</label>
                                    <input readOnly inputMode="numeric" value={data.email} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Meeting Link</label>
                                    <input required type="text" pattern="https://meet.google.com/.*" value={inviteLink} onChange={(e) => setInviteLink(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Invitation</label>
                                    <textarea rows={10} required value={invite} onChange={(e) => setInvite(e.target.value)} className="outline-none  rounded-lg px-4 py-1 bg-blue-100 border border-blue-200 w-full resize-none text-justify" />
                                </div>
                            </div>
                            <input type="submit" value={mailLoading ? 'Sending email...' : 'Send Email'} disabled={mailLoading} className="outline-none bg-green-500 text-white sm:w-[40%] w-full py-1 my-2  rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black disabled:opacity-50" />

                        </form>
                    </div>
                </Modal>

            }

            {sendSelected &&

                <Modal show={sendSelected} setShow={setSendSelected}>
                    <div className="justify-center items-center flex h-[90vh]">
                        <form onSubmit={handleSelected} className="w-[72%] shadow-xl px-10 py-2 rounded-lg flex flex-col justify-center items-center bg-gray-50 min-w-[380px]">
                            <div className=" space-y-2 min-w-[145px] w-full">
                                <div className="flex flex-row gap-5">
                                    <div className="w-full flex flex-col pb-2">

                                        <label className="text-lg text-gray-500">Date</label>
                                        <input type="date" min={getMinDate} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                    </div>
                                    <div className="w-full flex flex-col">

                                        <label className="text-lg text-gray-500">Time</label>
                                        <input type="time" value={selectedTime} onChange={(e) => { if (e.target.value >= getMinTimeForDate()) { setSelectedTime(e.target.value); setError('') } else { setSelectedTime(e.target.value); setError('Please choose valid time') } }} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                        <div className="w-full h-2">
                                            <span className={` text-red-400 text-sm italic ${!error ? 'opacity-0' : 'opacity-100'}`}>{error}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Candidate's Name</label>
                                    <input readOnly type="text" value={data.firstName + " " + data.lastName} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Candidate's Email</label>
                                    <input readOnly inputMode="numeric" value={data.email} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />

                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Company Address</label>
                                    <input readOnly type="text" value={data.address} onChange={(e) => setInviteLink(e.target.value)} className="outline-none  rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                </div>
                                <div className="w-full flex flex-col pb-2">

                                    <label className="text-lg text-gray-500">Selection Letter</label>
                                    <textarea rows={10} required value={letter} onChange={(e) => setLetter(e.target.value)} className="outline-none  rounded-lg px-4 py-1 bg-blue-100 border border-blue-200 w-full resize-none text-justify" />
                                </div>
                            </div>
                            <input type="submit" value='Send Email' className="outline-none bg-green-500 text-white sm:w-[40%] w-full py-1 my-2  rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black" />

                        </form>
                    </div>
                </Modal>

            }

            {showJd &&
                <Modal show={showJd} setShow={close}>
                    <div className="h-screen">
                        <div className={`scroll-smooth overflow-y-auto max-h-screen flex flex-col w-full sm:gap-0 gap-5 sm:flex-row items-center justify-around`}>
                            <div className="w-[60%] sm:w-[40%]">
                                {(jdCompany?.endsWith('.jpg') || jdCompany?.endsWith('.jpeg')) &&
                                    <div className="flex w-full justify-center h-full">
                                        <div className="flex h-full">
                                            <Image src={jdCompany} alt="Job Description" height={600} width={600} className="h-[41vh] sm:h-[80vh]" />
                                        </div>
                                    </div>}
                            </div>

                            <div className="flex flex-col items-center w-full sm:w-[50%] mb-1">

                                <iframe
                                    src={`${data?.resume}`}
                                    className="w-[60%] sm:w-[85%] h-[41vh] sm:h-[81vh]"
                                    title="Hasith Wijesinghe CV"
                                />
                            </div>

                        </div>
                        <div className="w-full flex gap-14 sm:gap-6  justify-center sm:justify-normal sm:ml-10 sm:mt-5">
                            {hide ? (

                                !["cancelled"].includes(data.status) && <div onClick={() => setHide(false)} className="w-[50%] sm:w-[38%] flex justify-center items-center text-lg font-bold bg-yellow-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-yellow-300 hover:bg-transparent shadow-black">Reconsider</div>

                            ) : (

                                <div className="w-full flex flex-row sm:gap-36 justify-evenly sm:justify-normal">
                                    <div className="flex flex-row sm:w-[40%] w-[50%] gap-3 sm:gap-6 items-center">
                                        <div onClick={marks > 0 ? () => review("", "selected") : () => alert('Do not forget to mark')} className="w-[45%] sm:w-[50%] flex justify-center items-center h-9 text-lg font-bold bg-green-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-green-300 hover:bg-transparent shadow-black">Accept</div>
                                        <div onClick={["rejected"].includes(data.status) ? close : () => review("", "rejected")} className="w-[45%] sm:w-[50%] h-9  flex justify-center items-center text-lg font-bold bg-red-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-red-300 hover:bg-transparent shadow-black">{["rejected"].includes(data.status) ? 'Keep Rejected' : 'Reject'}</div>
                                    </div>
                                    <div className="flex items-center justify-center sm:w-[35%]">
                                        <div className="py-1 flex items-center justify-center flex-row sm:w-[300px] gap-2 px-2 sm:gap-2 bg-blue-400">
                                            <label>Marks</label>
                                            <input type="number" min={0} max={10} value={marks || 0} onBlur={() => { if (marks > 10) setMarks(10); if (marks < 0) setMarks(0); }} onChange={(e) => setMarks(parseInt(e.target.value))} className="px-2 sm:w-44 w-10" />
                                            <button disabled={marks == data.marks} onClick={marking} className="bg-black text-white px-1 rounded-lg pb-[2px]">Save</button>
                                        </div>
                                    </div>
                                </div>

                            )
                            }
                        </div>
                    </div>
                </Modal>
            }

        </div>

    );

}