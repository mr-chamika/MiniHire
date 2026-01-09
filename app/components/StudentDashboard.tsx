'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Post_Student from "./Post_Student";
import Saved_Student from "./Saved_Student";
import Modal from "./Modal";
import Image from "next/image";
import Application from "./Application";
import Alert from "./Alert";
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
    contactNumber: string;
    github: string;
    _idx: string;

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
interface Alert {

    show: boolean;
    close: () => void;
    message: string;
    type: 'success' | 'error';

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
    const [confirming, setConfirming] = useState(false);
    const [filter, setFilter] = useState("pending");
    const [isAlert, setIsAlert] = useState<Alert | null>(null);


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
            post_id: '',
            contactNumber: '',
            github: '',
            _idx: ''//clicked application's _id
        }
    );

    const toApply = async (id: string, x = "") => {//use of Apply button

        await showJD("", id, x);
        await proceed();

    }

    const proceed = async () => {


        try {

            const encoded = encodeURIComponent(email);
            const res = await axios.get(`/api/users?toApply=${encoded}`);

            if (res.status != 200) {

                console.log('Check your internet connection...');
                setIsAlert({ show: true, close: close, message: "No such registered company", type: "error" });
                return;

            }

            if (res.data.message) {

                console.log(res.data.message);
                setIsAlert({ show: true, close: close, message: res.data.message, type: "success" });
                return;

            }
            setData(prev => ({ ...res.data, post_id: prev.post_id, _idx: prev._idx }))
            setIsproceeding(true);

        } catch (err) {

            console.log('Error:' + err);
            setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
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

            console.log('All fields required');
            setIsAlert({ show: true, close: close, message: "All fields required...", type: "error" });
            return;

        }

        const formData = new FormData();

        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("university", data.university);
        formData.append("degree", data.degree);
        formData.append("portfolio", data.portfolio);
        formData.append("linkedin", data.linkedin);
        formData.append("github", data.github);
        formData.append("resume", data.resume);
        formData.append("post_id", data.post_id);
        formData.append("email", email);
        formData.append("contactNumber", data.contactNumber);

        const res = await axios.post('/api/applications', formData);

        if (res.status != 200) {

            console.log('Check your internet connection...');
            setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
            return;

        }

        if (res.data.message) {

            console.log(res.data.message);
            setIsAlert({ show: true, close: close, message: res.data.message, type: "success" });
            return;

        }

        if (res.data.done != 'true') {

            console.log('Application sent Failed');
            setIsAlert({ show: true, close: close, message: "Failed to send application, Try again...", type: "error" });
            return;

        }

        await closeSubmission();
        console.log('Application sent Successfully');
        setIsAlert({ show: true, close: close, message: "Application sent Successfully", type: "success" });

    }

    const showJD = async (app_id = "", id: string, x = "") => {//to show the job description after click on the student post Card

        try {

            const encoded = encodeURIComponent(id);

            const res = await axios.get(`/api/posts?id=${encoded}`);

            if (res.status != 200) {

                console.log('Check your internet connection');
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                return;

            }

            if (res.data.message) {

                console.log(res.data.message);
                setIsAlert({ show: true, close: close, message: res.data.message, type: "success" });

            }

            if (!res.data.jd) {

                console.log('No Job description added');
                setIsAlert({ show: true, close: close, message: "No Job description added...", type: "error" });
                return;

            }

            if (["pending", "selected", "recruited", "interviewed"].includes(x)) { proceed() }
            if (["rejected", "selected", "pending", "recruited", "interviewed", "hired"].includes(x)) { setHide(true) }

            if (x == 'recruited') { setConfirming(true) }

            setJd(res.data.jd);
            setData(prev => ({ ...prev, post_id: id, _idx: app_id }))
            setShowJd(true);

        } catch (err) {

            console.log("Error showing job description: " + err);
            setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
            return;

        }

    }

    const closed = async () => {

        setShowJd(false);
        setHide(false);
        setConfirming(false);
        setData({ firstName: '', lastName: '', university: '', degree: '', portfolio: '', linkedin: '', resume: '', post_id: '', contactNumber: '', github: '', _idx: '' })
        setIsFav(!isFav)

    }

    const close = async () => {

        setIsAlert(null);

    }

    const review = async (id = "", x: string) => {

        try {
            const encoded = encodeURIComponent(x);

            const formData = new FormData();

            formData.append("id", id);
            formData.append("review", encoded);

            const res = await axios.put('/api/applications', formData);

            if (res.status != 200) {

                console.log('Check your connection');
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                return;

            }

            if (res.data.message) {

                console.log(res.data.message);
                setIsAlert({ show: true, close: close, message: res.data.message, type: "success" });
                return;

            }

            if (res.data.done == 'true') {

                console.log('Application Reviewed sucessfully.');
                setIsAlert({ show: true, close: close, message: "Application Reviewed Successfully", type: "success" });
                closed();
                setIsFav(!isFav);

            }

        } catch (err) {

            console.log("Failed to cancel sent application...");
            setIsAlert({ show: true, close: close, message: "Check your connection...", type: "success" });
            closed();
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

                console.log('Check your connection');
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                return;

            }

            if (res.data.message) {

                console.log(res.data.message);
                setIsAlert({ show: true, close: close, message: res.data.message, type: "success" });
                return;

            }

            if (res.data.done != 'true') {

                console.log('Error saving post');
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                return;

            }

            setIsFav(!isFav);

        } catch (err) {

            console.log('Mark as favourite this post failed.');
            setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });

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

                console.log('Check your connection');
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                return;

            }

            if (res.data.message) {

                console.log(res.data.message);
                setIsAlert({ show: true, close: close, message: res.data.message, type: "success" });
                return;

            }

            if (res.data.done == 'true') {

                console.log('Application cancelled sucessfully.');
                setIsAlert({ show: true, close: close, message: "Application cancelled sucessfully", type: "success" });
                setIsFav(!isFav);

            }

        } catch (err) {

            console.log("Failed to cancel sent application...");
            setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
            return;

        }


    }

    useEffect(() => {

        const getSaved = async () => {

            try {

                const encoded = encodeURIComponent(email);

                const res = await axios.get(`/api/posts?saved=${encoded}`);

                if (res.status != 200) {

                    console.log('No such registered company');
                    setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                    return;

                }

                const data = res.data;

                if (!data.postSet) {

                    console.log('Check connection issues');
                    setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                    setSaved([]);
                    return;

                }

                setSaved(data.postSet);
                setSavedList(data.saved);

            } catch (err) {

                console.log("Error fetching saved posts: " + err);
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                setSaved([]);


            }

        }

        const getPosts = async () => {

            try {

                // const tokenString = localStorage.getItem("token");

                // if (!tokenString) { alert('Token not found. Try again..'); return; }

                // const token: Token = jwtDecode(tokenString);

                // const encoded = encodeURIComponent(token.userId);

                const encoded = encodeURIComponent("toStudents " + email);

                const res = await axios.get(`/api/posts?to=${encoded}`);

                if (res.status != 200) {

                    console.log('No recent posts');
                    setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                    return;

                }

                const data = res.data;

                if (!data) {

                    console.log('Check connection issues');
                    setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                    setPosts([]);
                    return;

                }

                setPosts(data);

            } catch (err) {

                console.log("Error fetching posts: " + err);
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                setPosts([]);

            }
        }

        const getApplications = async () => {//to get applications sent by user

            const encoded = encodeURIComponent(email);

            try {

                const res = await axios.get(`/api/applications?fo=${encoded}`);

                if (res.status != 200) {

                    console.log('No applications sent');
                    setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                    return;

                }

                const data = res.data;

                if (!data) {

                    console.log('Check connection issues');
                    setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                    setApplications([]);
                    return;

                }

                setApplications(data);

            } catch (err) {

                console.log("Error fetching posts: " + err);
                setIsAlert({ show: true, close: close, message: "Check your connection...", type: "error" });
                setApplications([]);

            }

        }

        getPosts();
        getSaved();
        getApplications();

    }, [isFav, showJd])

    const isApplied = (id: string): boolean => {

        const x = applications?.find(app => app.post_id == id);

        if (x && ["selected", "pending", "recruited", "interviewed", "hired"].includes(x.status)) {

            return true;

        }

        return false;

    }

    return (
        <>
            <div className="w-full flex pt-5 flex-col min-w-[400px]">

                <div className="flex flex-col sm:flex-row justify-between gap-2 px-2 min-w-[400px]">

                    {/* shortlisted student list */}
                    <section className="sm:w-[25%] sm:min-w-[320px] w-full bg-yellow-50">
                        <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Saved {saved && saved.length > 0 ? '(' + saved?.length + ')' : ''}</p>
                        <div className="w-full h-[79vh] overflow-y-auto scroll-smooth overflow-x-hidden scrollbar-hide">
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
                                                showJd={() => showJD("", post._id, isApplied(post._id) ? "rejected" : "")}

                                            />

                                        )

                                    })}

                                </div>

                            }
                        </div>
                    </section>

                    {/* this company created job post list */}
                    <section className=" sm:w-[80%] sm:min-w-[500px] min-h-[79vh] w-full rounded-lg bg-blue-50">
                        <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Recently Posted {posts && posts.length > 0 ? '(' + posts?.length + ')' : ''}</p>
                        <div className="w-full h-[79vh] overflow-y-auto scroll-smooth scrollbar-hide">
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
                                                showJd={() => showJD("", post._id, isApplied(post._id) ? "rejected" : "")}
                                                toApply={() => toApply(post._id, isApplied(post._id) ? "rejected" : "")}
                                                isApplied={isApplied(post._id)}

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
                                <option value="recruited">Recruited {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'recruited').length + ')' : ''}</option>
                                <option value="interviewed">Interviewed {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'interviewed').length + ')' : ''}</option>
                                <option value="hired">Hired {applications && applications.length > 0 ? '(' + applications?.filter((app) => app.status == 'hired').length + ')' : ''}</option>

                            </select>
                        </div>

                        <div className="w-full h-[79vh] overflow-y-auto scroll-smooth overflow-x-hidden scrollbar-hide">
                            {applications?.filter((app) => app.status == filter).length == 0 ?

                                <div className="h-full w-full flex justify-center items-center">

                                    <p className="opacity-50">No Applications Yet</p>

                                </div>
                                :
                                <div>

                                    {applications?.filter((app) => app.status == filter).map((application) => {

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
                                                showJd={() => showJD(application._id, application.post_id, application.status)}
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
                    <div className={`py-2 scroll-smooth overflow-y-auto max-h-[90vh] flex flex-col items-center scrollbar-thin scrollbar-hide`}>
                        <div className="w-full h-[85vh]">
                            {(jd?.endsWith('.jpg') || jd?.endsWith('.jpeg')) ?
                                <div className="flex justify-center items-center w-full">
                                    <div className="flex items-center justify-center w-[80%] h-[80%]">
                                        <Image src={jd} alt="Your Logo" width={440} height={100} />
                                    </div>
                                </div> : <div>Loading...</div>}
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
                        {confirming && <div className="flex flex-row sm:w-[40%] w-[50%] gap-3 sm:gap-6 items-center">
                            <div onClick={() => review(data._idx, "hired")} className="w-[45%] sm:w-[50%] flex justify-center items-center h-9 text-lg font-bold bg-green-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-green-300 hover:bg-transparent shadow-black">Confirm</div>
                            <div onClick={() => review(data._idx, "rejected")} className="w-[45%] sm:w-[50%] h-9  flex justify-center items-center text-lg font-bold bg-red-400 rounded-lg hover:cursor-pointer hover:text-white hover:border-2 border-red-300 hover:bg-transparent shadow-black">Reject</div>
                        </div>


                        }
                    </div>
                </Modal>
            }

            {isAlert?.show &&

                <Alert show={isAlert.show} close={close} type={isAlert.type} message={isAlert.message} />

            }
        </>
    );

}