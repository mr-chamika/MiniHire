'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Post_Student from "./Post_Student";
import Saved_Student from "./Saved_Student";
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

export default function StudentDashboard({ email }: { email: string }) {

    const [posts, setPosts] = useState<Post[] | null>(null)
    const [saved, setSaved] = useState<Post[] | null>(null)
    const [savedList, setSavedList] = useState([""]);
    const [isFav, setIsFav] = useState(false);

    const mark = async (id: string) => {

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

        getPosts();
        getSaved();

    }, [isFav])

    return (

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

                                        />

                                    )

                                })}

                            </div>

                        }
                    </div>
                </section>

                {/* this company created job post list */}
                <section className=" sm:w-[80%] min-h-[79vh] w-full rounded-lg bg-blue-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Recently Posted</p>
                    <div className="w-full h-[75vh]">
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

                                        />

                                    )

                                })}

                            </div>

                        }
                    </div>
                </section>

                {/* applications list received by students */}
                <section className="sm:w-[25%] w-full bg-yellow-50">
                    <p className="pt-2 text-center text-xl font-mono border-b-2 border-slate-100">Sent</p>
                </section>

            </div>


        </div>

    );

}