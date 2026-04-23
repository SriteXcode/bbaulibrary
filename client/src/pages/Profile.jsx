import React, { useEffect, useState } from 'react';
import API from '../api';
import useAuth from '../hooks/useAuth';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isPhotoEnlarged, setIsPhotoEnlarged] = useState(false);
    const { isLoggedIn } = useAuth();

    const fetchData = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            // Fetch User Details
            const userRes = await API.get('/api/users/me');
            setUserData(userRes.data);

            // Fetch My Issues
            const issuesRes = await API.get('/api/issues/myissues');
            setIssues(issuesRes.data);
        } catch (err) {
            setMessage('Error loading profile data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isLoggedIn]);

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

    const getStatusColor = (status) => {
        switch (status) {
            case 'issued': return 'bg-yellow-100 text-yellow-800';
            case 'requested': return 'bg-blue-100 text-blue-800';
            case 'returned': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="border-4 w-12 h-12 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-lg font-medium text-gray-600">Loading your profile...</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-8 py-8">
            <h2 className="text-3xl font-extrabold text-gray-900 border-b-4 border-red-600 pb-3 mb-8">User Profile</h2>

            {message && <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">{message}</div>}

            {userData && (
                <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0 cursor-pointer" onClick={() => userData.profilePhoto && setIsPhotoEnlarged(true)}>
                            {userData.profilePhoto ? (
                                <img 
                                    src={userData.profilePhoto} 
                                    alt={userData.name} 
                                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-red-500 shadow-lg hover:opacity-90 transition duration-150"
                                    title="Click to enlarge"
                                />
                            ) : (
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gray-200 flex items-center justify-center text-4xl sm:text-5xl font-bold text-gray-500 border-4 border-red-500 shadow-lg">
                                    {userData.name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* User Details */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                                <p className="text-lg font-semibold text-gray-800">{userData.name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                <p className="text-lg font-semibold text-gray-800">{userData.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Library Card No.</p>
                                <p className="text-lg font-semibold text-gray-800">{userData.libraryCardNo}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department / Semester</p>
                                <p className="text-lg font-semibold text-gray-800">{userData.department} / {userData.semester} Sem</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                                <p className="text-lg font-semibold text-gray-800">{userData.phone}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Role</p>
                                <p className="inline-block mt-1 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold uppercase">
                                    {userData.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                My Book History & Requests
            </h3>

            <div className="space-y-4">
                {issues.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-10 text-center border-2 border-dashed border-gray-200">
                        <p className="text-lg text-gray-500 italic">No active book issues or requests found.</p>
                    </div>
                ) : (
                    issues.map(issue => (
                        <div key={issue._id} className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-8 border-red-500 gap-4">
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900">{issue.book?.title || 'Book Details Missing'}</h4>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                                    <p><span className="font-semibold">Issued On:</span> {formatDate(issue.issueDate)}</p>
                                    <p><span className="font-semibold text-red-500">Due Date:</span> {formatDate(issue.dueDate)}</p>
                                    {issue.status === 'returned' && (
                                        <p><span className="font-semibold text-green-600">Returned On:</span> {formatDate(issue.returnDate)}</p>
                                    )}
                                </div>
                                {issue.fine > 0 && (
                                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-lg bg-red-100 text-red-700 font-bold text-sm">
                                        ⚠️ Fine: ₹{issue.fine.toFixed(2)}
                                    </div>
                                )}
                                {issue.status === 'returned' && issue.paidAmount > 0 && (
                                    <div className="mt-3 inline-flex items-center px-3 py-1 rounded-lg bg-green-100 text-green-700 font-bold text-sm">
                                        ✅ Paid: ₹{issue.paidAmount.toFixed(2)}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 ${getStatusColor(issue.status)}`}>
                                    {issue.status}
                                </span>
                                {issue.status === 'requested' && (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Awaiting Approval</p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Image Enlargement Modal */}
            {isPhotoEnlarged && userData?.profilePhoto && (
                <div 
                    className="fixed inset-0 flex items-center justify-center z-[70] p-4 backdrop-blur-md"
                    onClick={() => setIsPhotoEnlarged(false)}
                >
                    <div className="relative animate-in zoom-in duration-300 flex justify-center items-center">
                        <img 
                            src={userData.profilePhoto} 
                            alt="Enlarged profile" 
                            className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain border-2 border-white/20"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button 
                            className="absolute top-2.5 right-2.5 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center text-3xl font-light transition-all shadow-lg"
                            onClick={() => setIsPhotoEnlarged(false)}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
