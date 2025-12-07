'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Post_Student from "./Post_Student";
import Saved_Student from "./Saved_Student";
import Modal from "./Modal";
import Image from "next/image";
import Application from "./Application";
interface Token {

    userId: string;
    role: string;
    verified: boolean;
    email: string;

}

interface Post {

    _id: string;
    companyName: string;
    role: string;
    contactNumber: string;
    type: string;
    period: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

interface Form {

    firstName: string;
    lastName: string;
    university: string;
    degree: string;
    portfolio: string;
    linkedin: string;
    resume: string;
    post_id: string;

}
interface Application {

    //details of post
    role: string;
    contactNumber: string;
    period: string;
    type: string;
    post_id: string;

    //details of application
    _id: string;
    createdAt: string;
    status: string;

}

export default function StudentDashboard({ email }: { email: string }) {

    const [posts, setPosts] = useState<Post[] | null>(null)
    const [saved, setSaved] = useState<Post[] | null>(null)
    const [applications, setApplications] = useState<Application[] | null>(null)
    const [savedList, setSavedList] = useState([""]);
    const [isFav, setIsFav] = useState(false);
    const [showJd, setShowJd] = useState(false);
    const [jd, setJd] = useState('');
    const [isProceeding, setIsproceeding] = useState(false);
    const [inResume, setInResume] = useState(false);
    const [hide, setHide] = useState(false);

    //for application form

    const [data, setData] = useState<Form>(
        {
            firstName: '',
            lastName: '',
            university: '',
            degree: '',
            portfolio: '',
            linkedin: '',
            resume: '',
            post_id: ''
        }
    );

    const toApply = async (id: string) => {//use of Apply button

        await showJD(id);
        await proceed();

    }

    const proceed = async () => {


        try {

            const encoded = encodeURIComponent(email);
            const res = await axios.get(`/api/users?toApply=${encoded}`);

            if (res.status != 200) {

                alert('Check your internet connection...');
                return;

            }

            if (res.data.message) {

                alert(res.data.message);
                return;

            }
            setData(prev => ({ ...res.data, post_id: prev.post_id }))
            setIsproceeding(true);

        } catch (err) {

            alert('Error:' + err);
            return;

        }


    }
    const closeSubmission = async () => {

        setShowJd(false);
        setIsproceeding(false);
        setHide(false);

    }

    const handleSubmit = async () => {

        if (!data) {

            alert('All fields required');
            return;

        }

        const formData = new FormData();

        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("university", data.university);
        formData.append("degree", data.degree);
        formData.append("portfolio", data.portfolio);
        formData.append("linkedin", data.linkedin);
        formData.append("resume", data.resume);
        formData.append("post_id", data.post_id);
        formData.append("email", email);

        const res = await axios.post('/api/applications', formData);

        if (res.status != 200) {

            alert('Check your internet connection...');
            return;

        }

        if (res.data.message) {

            alert(res.data.message);
            return;

        }

        if (res.data.done != 'true') {

            alert('Application sent Failed');
            return;

        }

        await closeSubmission();
        alert('Application sent Successfully');

    }

    const showJD = async (id: string, x = "") => {//to show the job description after click on the student post Card

        try {


            const encoded = encodeURIComponent(id);

            const res = await axios.get(`/api/posts?id=${encoded}`);

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

            if (x != "") { setHide(true) };

            setJd(res.data.jd);
            setData(prev => ({ ...prev, post_id: id }))
            setShowJd(true);

        } catch (err) {

            alert("Error showing job description: " + err);
            return;

        }

    }


    const mark = async (id: string) => {//to mark a post as a favourite

        try {

            const formData = new FormData();

            formData.append("id", id);
            formData.append("email", email);

            const res = await axios.put(`/api/posts`, formData);

            if (res.status != 200) {

                alert('Check your connection');
                return;

            }

            if (res.data.message) {

                alert(res.data.message);
                return;

            }

            if (res.data.done != 'true') {

                alert('Error saving post');
                return;

            }

            setIsFav(!isFav);

        } catch (err) {

            alert('Mark as favourite this post failed.')

        }

    }

    const cancel = async (id: string) => {

        const encoded = encodeURIComponent("cancel");

        const formData = new FormData();

        formData.append("id", id);
        formData.append("operation", encoded);

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

                alert('Application cancelled sucessfully.');
                setIsFav(!isFav);

            }

        } catch (err) {

            alert("Failed to cancel sent application...");
            return;

        }


    }

    useEffect(() => {

        const getSaved = async () => {

            try {

                const encoded = encodeURIComponent(email);

                const res = await axios.get(`/api/posts?saved=${encoded}`);

                if (res.status != 200) {

                    alert('No such registered company');
                    return;

                }

                const data = res.data;

                if (!data.postSet) {

                    alert('Check connection issues');
                    setSaved([]);
                    return;

                }

                setSaved(data.postSet);
                setSavedList(data.saved);

            } catch (err) {

                alert("Error fetching saved posts: " + err);
                setSaved([]);


            }

        }

        const getPosts = async () => {

            try {

                // const tokenString = localStorage.getItem("token");

                // if (!tokenString) { alert('Token not found. Try again..'); return; }

                // const token: Token = jwtDecode(tokenString);

                // const encoded = encodeURIComponent(token.userId);

                const encoded = encodeURIComponent("toStudents");

                const res = await axios.get(`/api/posts?to=${encoded}`);

                if (res.status != 200) {

                    alert('No recent posts');
                    return;

                }

                const data = res.data;

                if (!data) {

                    alert('Check connection issues');
                    setPosts([]);
                    return;

                }

                setPosts(data);

            } catch (err) {

                alert("Error fetching posts: " + err);
                setPosts([]);

            }
        }

        const getApplications = async () => {//to get applications sent by user

            const encoded = encodeURIComponent(email);

            try {

                const res = await axios.get(`/api/applications?fo=${encoded}`);

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

        getPosts();
        getSaved();
        getApplications();

    }, [isFav, showJd])

    return (
        <>
            <div className="w-full flex pt-5 flex-col min-w-[400px]">

                <div className="flex flex-col sm:flex-row justify-between gap-2 px-2 min-w-[400px]">

                    {/* shortlisted student list */}
                    <section className="sm:w-[25%] sm:min-w-[320px] w-full bg-yellow-50">
                        <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Saved</p>
                        <div className="w-full h-[75vh]">
                            {saved?.length == 0 ?

                                <div className="h-full w-full flex justify-center items-center">

                                    <p className="opacity-50">No Saved Posts Yet</p>

                                </div>
                                :
                                <div>

                                    {saved?.map((post) => {

                                        return (

                                            <Saved_Student

                                                key={post._id}
                                                _id={post._id}
                                                role={post.role}
                                                type={post.type}
                                                description={post.description}
                                                createdAt={post.createdAt}
                                                mark={() => mark(post._id)}
                                                showJd={() => showJD(post._id)}

                                            />

                                        )

                                    })}

                                </div>

                            }
                        </div>
                    </section>

                    {/* this company created job post list */}
                    <section className=" sm:w-[80%] sm:min-w-[500px] min-h-[79vh] w-full rounded-lg bg-blue-50">
                        <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Recently Posted</p>
                        <div className="w-full h-[79vh] overflow-y-auto scroll-smooth">
                            {posts?.length == 0 ?

                                <div className="h-full w-full flex justify-center items-center">

                                    <p className="opacity-50">No Posts Yet</p>

                                </div>
                                :
                                <div>

                                    {posts?.map((post) => {

                                        return (

                                            <Post_Student

                                                key={post._id}
                                                _id={post._id}
                                                role={post.role}
                                                type={post.type}
                                                description={post.description}
                                                period={post.period}
                                                contactNumber={post.contactNumber}
                                                createdAt={post.createdAt}
                                                companyName={post.companyName}
                                                mark={() => mark(post._id)}
                                                saved={savedList}
                                                showJd={() => showJD(post._id)}
                                                toApply={() => toApply(post._id)}

                                            />

                                        )

                                    })}

                                </div>

                            }
                        </div>
                    </section>

                    {/* applications list received by students */}
                    <section className="sm:w-[25%] sm:min-w-[320px] w-full bg-yellow-50">
                        <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Sent</p>

                        <div className="w-full h-[79vh] overflow-y-auto scroll-smooth overflow-x-hidden">
                            {applications?.length == 0 ?

                                <div className="h-full w-full flex justify-center items-center">

                                    <p className="opacity-50">No Applications Yet</p>

                                </div>
                                :
                                <div>

                                    {applications?.map((application) => {

                                        return (

                                            <Application

                                                key={application._id}
                                                _id={application.post_id}
                                                role={application.role}
                                                type={application.type}
                                                status={application.status}
                                                createdAt={application.createdAt}
                                                contact={application.contactNumber}
                                                period={application.period}
                                                showJd={() => showJD(application.post_id, "hide")}
                                                cancel={() => cancel(application._id)}

                                            />

                                        )

                                    })}

                                </div>

                            }
                        </div>

                    </section>

                </div>

            </div>

            {showJd &&
                <Modal show={showJd} setShow={closeSubmission}>
                    <div className="py-2 scroll-smooth overflow-y-auto max-h-[90vh] flex flex-col items-center">
                        <div className="w-full h-[85vh]">
                            {jd?.endsWith('.jpg') &&
                                <div className="flex justify-center items-center w-full">
                                    <div className="flex items-center justify-center w-[80%] h-[80%]">
                                        <Image src={jd} alt="Your Logo" height={600} width={600} />
                                    </div>
                                </div>}
                        </div>

                        {isProceeding &&
                            <form onSubmit={handleSubmit} className="w-[82%] shadow-xl px-10 pt-10 pb-10 rounded-3xl flex flex-col justify-between items-center">
                                <div className="gap-5 flex flex-col w-full items-center">
                                    <div className="sm:w-[50%] space-y-5 min-w-[145px]">
                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">First Name</label>
                                            <input required readOnly type="text" value={data?.firstName} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />

                                        </div>
                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">Last Name</label>
                                            <input required readOnly type="text" value={data?.lastName} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />

                                        </div>

                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">Email</label>
                                            <input required readOnly type="email" value={email} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />

                                        </div>

                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">University</label>
                                            <input required readOnly type="text" value={data?.university} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />

                                        </div>
                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">Degree</label>
                                            <input required readOnly type="text" value={data?.degree} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />

                                        </div>
                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">Your Portfolio</label>
                                            <input required readOnly type="url" value={data?.portfolio} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />
                                        </div>
                                        <div className="w-full flex flex-col pb-2">

                                            <label className="text-lg text-gray-200">LinkedIn Profile</label>
                                            <input readOnly pattern="https://www.linkedin.com/.*" required type="url" value={data?.linkedin} className="outline-none  rounded-lg px-3 py-3 bg-blue-100 border border-blue-200 w-full hover:cursor-default" />

                                        </div>
                                        <div className="w-full flex flex-col">

                                            <label className="text-lg text-gray-200">Resume</label>
                                            <div onClick={() => setInResume(!inResume)} className={`mb-2 text-white font-bold rounded-lg px-3 py-3 w-32 border ${inResume ? 'bg-red-600' : 'bg-blue-600'} border ${inResume ? 'border-red-800' : 'border-blue-800'} hover:cursor-pointer`}>{inResume ? "Hide Resume" : "View Resume"}</div>
                                            {inResume && <iframe
                                                src={`${data?.resume}#zoom=page-fit`}
                                                className=" w-full h-[41vh] sm:h-[104vh]"
                                                title="Hasith Wijesinghe CV"
                                            />}
                                        </div>
                                    </div>
                                </div>

                            </form>
                        }

                        {!hide && <div onClick={isProceeding ? handleSubmit : proceed} className="w-[50%] sm:w-[38%] py-2 flex justify-center items-center text-lg font-bold bg-green-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-green-300 hover:bg-transparent shadow-black">{isProceeding ? 'Submit' : 'Proceed'}</div>}
                    </div>
                </Modal>
            }
        </>
    );

}