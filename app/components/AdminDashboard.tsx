'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";

interface Company {
    _id: string;
    name: string;
    email: string;
    contactNumber: string;
    website: string;
    linkedin: string;
    logo: string;
    verified: boolean;
}

export default function AdminDashboard({ email }: { email: string }) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'approved' | 'unverified'>('all');
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const [action, setAction] = useState<'approve' | 'unapprove' | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    useEffect(() => {
        fetchCompanies();
    }, []);

    useEffect(() => {
        let filtered = companies;
        if (filter === 'approved') {
            filtered = companies.filter(c => c.verified);
        } else if (filter === 'unverified') {
            filtered = companies.filter(c => !c.verified);
        }
        if (search) {
            filtered = filtered.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
        }
        setFilteredCompanies(filtered);
    }, [companies, filter, search]);

    const fetchCompanies = async () => {
        try {
            const res = await axios.get('/api/users?operation=all');
            setCompanies(res.data);
        } catch (err) {
            console.error('Error fetching companies:', err);
        } finally {
            setLoading(false);
        }
    };

    const approveCompany = async (id: string) => {
        try {
            await axios.post(`/api/users?approve=${id}`);
            setCompanies(companies.map(c => c._id === id ? { ...c, verified: true } : c));
        } catch (err) {
            console.error('Error approving company:', err);
        }
    };

    const unapproveCompany = async (id: string) => {
        try {
            await axios.post(`/api/users?unapprove=${id}`);
            setCompanies(companies.map(c => c._id === id ? { ...c, verified: false } : c));
        } catch (err) {
            console.error('Error unapproving company:', err);
        }
    };

    const handleAction = (company: Company, actionType: 'approve' | 'unapprove') => {
        setSelectedCompany(company);
        setAction(actionType);
        setModal(true);
    };

    const confirmAction = async () => {
        if (!selectedCompany || !action) return;
        if (action === 'approve') {
            await approveCompany(selectedCompany._id);
        } else if (action === 'unapprove') {
            await unapproveCompany(selectedCompany._id);
        }
        setModal(false);
        setSelectedCompany(null);
        setAction(null);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Manage Companies</h1>
                <div className="mb-4 flex gap-4">
                    <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border p-2">
                        <option value="all">All Companies</option>
                        <option value="approved">Approved</option>
                        <option value="unverified">Unverified (Banned)</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search by company name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 flex-1"
                    />
                </div>
                {filteredCompanies.length === 0 ? (
                    <p>No companies match the criteria.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map(company => (
                            <div key={company._id} className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12 rounded-full mr-4 object-cover" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">{company.name}</h2>
                                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${company.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {company.verified ? 'Approved' : 'Unverified (Banned)'}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-gray-600"><strong>Email:</strong> {company.email}</p>
                                    <p className="text-gray-600"><strong>Contact:</strong> {company.contactNumber}</p>
                                    <div className="flex gap-4">
                                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center">
                                            🌐 Website
                                        </a>
                                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center">
                                            💼 LinkedIn
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    {!company.verified ? (
                                        <button
                                            onClick={() => handleAction(company, 'approve')}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
                                        >
                                            ✅ Approve
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleAction(company, 'unapprove')}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                                        >
                                            🚫 Ban
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {modal && selectedCompany && action && (
                <Modal show={modal} setShow={setModal}>
                    <div className="w-full flex flex-col items-center justify-center min-h-screen">
                        <div className="bg-white p-6 rounded-xl shadow-md w-80 text-center">
                            <h2 className="text-xl font-semibold mb-4">
                                {action === 'approve' ? 'Approve Company' : 'Unapprove (Ban) Company'}
                            </h2>
                            <p className="mb-4">
                                Are you sure you want to {action === 'approve' ? 'approve' : 'unapprove (ban)'} <strong>{selectedCompany.name}</strong>?
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={confirmAction}
                                    className={`px-4 py-2 rounded text-white ${action === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setModal(false)}
                                    className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}