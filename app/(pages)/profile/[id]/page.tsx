"use client"

import Modal from "@/app/components/Modal";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface User {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    linkedin?: string;
    portfolio?: string;
    resume?: string;
    degree?: string;
    university?: string;
    verified: boolean;
    role: string;
    companyName?: string;
    name?: string;
    contactNumber: string;
    github?: string;
    website?: string;
    logo?: string;
}

export default function Profile({ params }: { params: Promise<{ id: string }> }) {

    const [id, setId] = useState('');
    const [user, setUser] = useState<User | null>(null)
    const [show, setShow] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        linkedin: '',
        portfolio: '',
        github: '',
        degree: '',
        university: '',
        name: '',
        website: ''
    });
    const [originalData, setOriginalData] = useState({
        firstName: '',
        lastName: '',
        contactNumber: '',
        linkedin: '',
        portfolio: '',
        github: '',
        degree: '',
        university: '',
        name: '',
        website: ''
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const degrees = [
        { label: "BSc Hons in Software Engineering", value: "SE (Hons)" },
        { label: "BSc Hons in Computer Science", value: "CS (Hons)" },
        { label: "BSc Hons in Information Technology", value: "IT (Hons)" },
        { label: "BSc in Computer Science", value: "BSc" },
        { label: "BEng Hons in Software Engineering", value: "BEng (Hons)" },
        { label: "MSc in Computer Science", value: "MSc" },
        // Add more as needed
    ];

    const universities = [
        { label: "University of Colombo", value: "UOC" },
        { label: "University of Moratuwa", value: "UOM" },
        { label: "University of Sri Jayewardenepura", value: "USJP" },
        { label: "University of Peradeniya", value: "UOP" },
        { label: "University of Kelaniya", value: "UOK" },
        { label: "University of Ruhuna", value: "RUH" },
        { label: "University of Jaffna", value: "UOJ" },
        { label: "South Eastern University of Sri Lanka", value: "SEUSL" },
        { label: "Uva Wellassa University", value: "UWU" },
        { label: "Rajarata University", value: "Rajarata" },
        { label: "Sabaragamuwa University", value: "Sabaragamuwa" },
        { label: "Wayamba University", value: "Wayamba" },
        // Add more as needed
    ];

    const expandUniversity = (uni: string) => {
        const map: { [key: string]: string } = {
            "UOC": "University of Colombo",
            "UOM": "University of Moratuwa",
            "USJP": "University of Sri Jayewardenepura",
            "UOP": "University of Peradeniya",
            "UOK": "University of Kelaniya",
            "USJ": "University of Sri Jayewardenepura",
            "RUH": "University of Ruhuna",
            "UOJ": "University of Jaffna",
            "SEUSL": "South Eastern University of Sri Lanka",
            "UWU": "Uva Wellassa University",
            "Rajarata": "Rajarata University",
            "Sabaragamuwa": "Sabaragamuwa University",
            "Wayamba": "Wayamba University",
            // Add more as needed
        };
        return map[uni] || uni;
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("id", id);
            if (user?.role === 'student') {
                formData.append("firstName", editData.firstName);
                formData.append("lastName", editData.lastName);
                formData.append("contactNumber", editData.contactNumber);
                formData.append("linkedin", editData.linkedin);
                formData.append("portfolio", editData.portfolio);
                formData.append("github", editData.github);
                formData.append("degree", editData.degree);
                formData.append("university", editData.university);
                if (resumeFile) formData.append("resume", resumeFile);
            } else {
                formData.append("name", editData.name);
                formData.append("contactNumber", editData.contactNumber);
                formData.append("linkedin", editData.linkedin);
                formData.append("website", editData.website);
                if (logoFile) formData.append("logo", logoFile);
            }
            const res = await axios.put('/api/users', formData);
            if (res.status === 200) {
                alert('Profile updated successfully');
                setEditModal(false);
                setResumeFile(null);
                setLogoFile(null);
                // Refresh user data
                const refreshRes = await axios.get(`/api/users?id=${id}`);
                setUser(refreshRes.data);
                // Update original data to match new data
                setOriginalData(editData);
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const expandDegree = (deg: string) => {
        const map: { [key: string]: string } = {
            "SE (Hons)": "Bachelor of Science Honours in Software Engineering",
            "CS (Hons)": "Bachelor of Science Honours in Computer Science",
            "IT (Hons)": "Bachelor of Science Honours in Information Technology",
            "BSc": "Bachelor of Science",
            "BSc (Hons)": "Bachelor of Science Honours",
            "BEng": "Bachelor of Engineering",
            "BEng (Hons)": "Bachelor of Engineering Honours",
            "MSc": "Master of Science",
            // Add more IT-related degrees as needed
        };
        return map[deg] || deg;
    };

    const hasDataChanged = () => {
        if (user?.role === 'student') {
            return (
                editData.firstName !== originalData.firstName ||
                editData.lastName !== originalData.lastName ||
                editData.contactNumber !== originalData.contactNumber ||
                editData.linkedin !== originalData.linkedin ||
                editData.portfolio !== originalData.portfolio ||
                editData.github !== originalData.github ||
                editData.degree !== originalData.degree ||
                editData.university !== originalData.university ||
                resumeFile !== null
            );
        } else {
            return (
                editData.name !== originalData.name ||
                editData.contactNumber !== originalData.contactNumber ||
                editData.linkedin !== originalData.linkedin ||
                editData.website !== originalData.website ||
                logoFile !== null
            );
        }
    };

    useEffect(() => {

        const inside = async () => {

            const { id } = await params;

            try {
                setId(id);

                const res = await axios.get(`/api/users?id=${id}`)

                if (res.status != 200) {

                    alert('Error');
                    return;

                }

                setUser(res.data);
                const initialData = {
                    firstName: res.data.firstName || '',
                    lastName: res.data.lastName || '',
                    contactNumber: res.data.contactNumber || '',
                    linkedin: res.data.linkedin || '',
                    portfolio: res.data.portfolio || '',
                    github: res.data.github || '',
                    degree: res.data.degree || '',
                    university: res.data.university || '',
                    name: res.data.name || '',
                    website: res.data.website || ''
                };
                setEditData(initialData);
                setOriginalData(initialData);

            } catch (err) {

                console.log('Error from profile: ' + err);

            }


        }

        inside();

    }, [id])

    return (
        <>
            <div className="h-screen bg-gray-50 py-10 px-5 overflow-hidden">
                {user ? (
                    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-blue-500 text-white p-6 text-center relative">
                            {user.role === 'company' && user.logo && (
                                <Image src={user.logo} alt="Company Logo" width={100} height={100} className="mx-auto mb-4 rounded-full" />
                            )}
                            <h1 className="text-3xl font-bold">
                                {user.role === 'student' ? `${user.firstName && user.firstName[0].toUpperCase() + user.firstName?.slice(1)} ${user.lastName && user.lastName[0].toUpperCase() + user.lastName.slice(1)}` : (user.name || user.companyName)}
                            </h1>
                            <p className="text-lg mt-2">{user.email}</p>
                            {user.verified && (
                                <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                                    Verified
                                </span>
                            )}
                            <button onClick={() => setEditModal(true)} className="absolute top-4 right-4 bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-100">
                                Edit Profile
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="bg-blue-100 p-4 rounded-lg">
                                <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
                                <p className="text-lg"><strong>Contact Number:</strong> {user.contactNumber}</p>
                                <div className="mt-3 flex flex-row gap-5">
                                    {user.linkedin && (
                                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                                            LinkedIn Profile
                                        </a>
                                    )}
                                    {user.role === 'student' && user.portfolio && (
                                        <a href={user.portfolio} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                                            Portfolio
                                        </a>
                                    )}
                                    {user.role === 'student' && user.github && (
                                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                                            GitHub Profile
                                        </a>
                                    )}
                                    {user.role === 'company' && user.website && (
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline">
                                            Company Website
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Student Specific */}
                            {user.role === 'student' && (
                                <>
                                    <div className="bg-blue-100 p-4 rounded-lg">
                                        <h2 className="text-xl font-semibold mb-3">Education</h2>
                                        <p className="text-lg"><strong>University:</strong> {expandUniversity(user.university || '')}</p>
                                        <p className="text-lg"><strong>Degree:</strong> {expandDegree(user.degree || '')}</p>
                                    </div>

                                    {user.resume && (
                                        <div className="bg-blue-100 p-4 rounded-lg text-center">
                                            <button onClick={() => setShow(true)} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400">
                                                View Resume
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Company Specific */}
                            {user.role === 'company' && (
                                <>
                                    {/* Logo is now in header */}
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-screen">
                        <p className="text-xl">Loading...</p>
                    </div>
                )}

            </div>
            {/* Modal for Resume/Logo */}
            {show && (
                <Modal show={show} setShow={setShow}>
                    {user?.role === 'student' && user.resume ? (
                        user.resume.endsWith('.pdf') ? (
                            <iframe
                                src={user.resume}
                                className="w-full h-[93vh]"
                                title="Resume"
                            />
                        ) : (
                            <div className="flex justify-center items-center h-screen">
                                <p>Unsupported Resume Format</p>
                            </div>
                        )
                    ) : user?.role === 'company' && user.logo ? (
                        <div className="flex justify-center items-center h-screen">
                            <Image src={user.logo} alt="Company Logo" width={400} height={400} className="rounded-lg" />
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-screen">
                            <p>No Document Available</p>
                        </div>
                    )}
                </Modal>
            )}

            {/* Edit Profile Modal */}
            {editModal && (
                <Modal show={editModal} setShow={(show) => { setEditModal(show); if (!show) { setEditData(originalData); setResumeFile(null); setLogoFile(null); } }}>
                    <div className="w-full flex flex-col items-center min-h-screen">
                        <form onSubmit={handleEditSubmit} className="bg-white p-2 px-4 rounded-xl shadow-md w-full max-w-2xl text-left max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
                            {user?.role === 'student' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="w-full flex flex-col pb-2">
                                            <label className="text-lg text-gray-500">First Name</label>
                                            <input type="text" value={editData.firstName} onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                        </div>
                                        <div className="w-full flex flex-col pb-2">
                                            <label className="text-lg text-gray-500">Last Name</label>
                                            <input type="text" value={editData.lastName} onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Contact Number</label>
                                        <input type="text" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={editData.contactNumber} onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value.replace(/[^0-9]/g, '') })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">LinkedIn Profile</label>
                                        <input type="url" pattern="https://(www\.)?linkedin\.com/in/.*" value={editData.linkedin} onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Portfolio</label>
                                        <input type="url" value={editData.portfolio} onChange={(e) => setEditData({ ...editData, portfolio: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">GitHub Profile</label>
                                        <input type="url" value={editData.github} onChange={(e) => setEditData({ ...editData, github: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="w-full flex flex-col pb-2">
                                            <label className="text-lg text-gray-500">Degree</label>
                                            <select value={editData.degree} onChange={(e) => setEditData({ ...editData, degree: e.target.value })} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required>
                                                {degrees.map((deg) => (
                                                    <option key={deg.value} value={deg.value}>{deg.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-full flex flex-col pb-2">
                                            <label className="text-lg text-gray-500">University</label>
                                            <select value={editData.university} onChange={(e) => setEditData({ ...editData, university: e.target.value })} className="[&::-webkit-scrollbar]:hidden inline-block hover:cursor-pointer appearance-none outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required>
                                                {universities.map((uni) => (
                                                    <option key={uni.value} value={uni.value}>{uni.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Resume (PDF)</label>
                                        {user.resume && (
                                            <div className="mb-2">
                                                <p className="text-sm text-gray-600">Current: {user.resume.split('/').pop()}</p>
                                                <a href={user.resume} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Current Resume</a>
                                            </div>
                                        )}
                                        <input type="file" accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="file:border-none file:bg-transparent file:font-bold file:text-blue-500 file:bg-gray-200 file:rounded-md file:shadow-sm file:cursor-pointer outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Company Name</label>
                                        <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Contact Number</label>
                                        <input type="text" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} value={editData.contactNumber} onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value.replace(/[^0-9]/g, '') })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">LinkedIn Profile</label>
                                        <input type="url" pattern="https://(www\.)?linkedin\.com/company/.*" value={editData.linkedin} onChange={(e) => setEditData({ ...editData, linkedin: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Website</label>
                                        <input type="url" pattern="https?://.*" value={editData.website} onChange={(e) => setEditData({ ...editData, website: e.target.value })} className="outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" required />
                                    </div>
                                    <div className="w-full flex flex-col pb-2">
                                        <label className="text-lg text-gray-500">Logo (Image)</label>
                                        {user?.logo && (
                                            <div className="mb-2">
                                                <Image src={user.logo} alt="Current Logo" width={100} height={100} className="border rounded" />
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="file:border-none file:bg-transparent file:font-bold file:text-blue-500 file:bg-gray-200 file:rounded-md file:shadow-sm file:cursor-pointer outline-none rounded-lg px-2 py-1 bg-blue-100 border border-blue-200 w-full" />
                                    </div>
                                </>
                            )}
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => { setEditModal(false); setResumeFile(null); setLogoFile(null); setEditData(originalData) }} className="px-4 py-2 bg-gray-300 rounded" disabled={loading}>Cancel</button>
                                {hasDataChanged() && (
                                    <button type="submit" disabled={loading} className="outline-none bg-green-500 text-white px-4 py-2 rounded-xl hover:cursor-pointer hover:bg-green-300 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </>
    );

}