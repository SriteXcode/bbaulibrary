// import React from 'react'
// import { Routes, Route, Link, useNavigate } from 'react-router-dom'
// import Home from './pages/Home'
// import Books from './pages/Books'
// import Login from './pages/Login'
// import Register from './pages/Register'
// // IMPORT the new hook
// import useAuth from './hooks/useAuth'

// export default function App(){
//     // Use the hook to get login status and logout function
//     const { isLoggedIn, userRole, handleLogout } = useAuth();
//     const navigate = useNavigate(); // Need useNavigate for redirecting after logout

//     const logout = () => {
//         handleLogout();
//         navigate('/login'); // Redirect to login page after logging out
//     };
    
//     // Pass the handleLogin function to the Login component
//     const LoginWithProps = (props) => <Login {...props} handleLogin={useAuth().handleLogin} />;
    
//     // We wrap the entire component with BrowserRouter to enable useNavigate
//     return (
//         <>
//             <nav className="nav">
//                 <Link to="/">Home</Link>
//                 <Link to="/books">Books</Link>
//                 {/* Conditional rendering for Auth links */}
//                 {!isLoggedIn ? (
//                     <>
//                         <Link to="/login">Login</Link>
//                         <Link to="/register">Register</Link>
//                     </>
//                 ) : (
//                     <>
//                         {/* Display the user's role */}
//                         <span className="nav-role">Role: {userRole}</span>
//                         {/* If user is logged in, show a Logout button */}
//                         <button onClick={logout} className="nav-button">
//                             Logout
//                         </button>
//                     </>
//                 )}
//             </nav>
//             <Routes>
//                 <Route path="/" element={<Home/>} />
//                 <Route path="/books" element={<Books/>} />
//                 {/* Use the component with props */}
//                 <Route path="/login" element={<LoginWithProps />} />
//                 <Route path="/register" element={<Register/>} />
//             </Routes>
//         </>
//     )
// }




import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import LibrarianDashboard from './pages/LibrarianDashboard' // NEW IMPORT
import MyIssues from './pages/MyIssues' // NEW IMPORT
import useAuth from './hooks/useAuth'

export default function App(){
    const { isLoggedIn, userRole, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // 🌟 Listen for installation prompt
    React.useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    const logout = () => {
        handleLogout();
        navigate('/login');
        setIsMenuOpen(false);
    };
    
    const LoginWithProps = (props) => <Login {...props} handleLogin={useAuth().handleLogin} />;
    
    return (
        <>
            {/* Tailwind Classes applied to NAV and Links */}
            <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-red-400 hover:text-red-300 transition duration-150">
                        BBAU Library
                    </Link>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-white focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4 items-center">
                        {/* 📲 Install App Button */}
                        {deferredPrompt && (
                            <button
                                onClick={handleInstallClick}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition duration-150 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Install App
                            </button>
                        )}
                        
                        <Link to="/books" className="text-white hover:text-red-400 transition duration-150">
                            Search Books
                        </Link>
                        {userRole === 'admin' && (
                            <Link to="/admin" className="text-red-400 font-semibold hover:text-white transition duration-150">
                                Admin Tools
                            </Link>
                        )}
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition duration-150">Login</Link>
                                <Link to="/register" className="text-white hover:text-red-400 transition duration-150">Register</Link>
                            </>
                        ) : (
                            <>
                                {isLoggedIn && (
                                    <Link to="/my-issues" className="text-white hover:text-red-400 transition duration-150">
                                        My Issues
                                    </Link>
                                )}
                                <button 
                                    onClick={logout} 
                                    className="px-3 py-1 rounded border border-red-600 text-red-400 hover:bg-red-600 hover:text-white transition duration-150"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 flex flex-col space-y-4 pb-4">
                        {/* 📲 Install App Button (Mobile) */}
                        {deferredPrompt && (
                            <button
                                onClick={() => { handleInstallClick(); setIsMenuOpen(false); }}
                                className="w-full text-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition duration-150 flex justify-center items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Install App
                            </button>
                        )}

                        <Link to="/books" className="text-white hover:text-red-400" onClick={() => setIsMenuOpen(false)}>
                            Search Books
                        </Link>
                        {userRole === 'admin' && (
                            <Link to="/admin" className="text-red-400 font-semibold hover:text-white" onClick={() => setIsMenuOpen(false)}>
                                Admin Tools
                            </Link>
                        )}
                        {!isLoggedIn ? (
                            <>
                                <Link to="/login" className="block text-center px-3 py-2 rounded bg-red-600 hover:bg-red-700" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="block text-center text-white hover:text-red-400" onClick={() => setIsMenuOpen(false)}>Register</Link>
                            </>
                        ) : (
                            <>
                                {isLoggedIn && (
                                    <Link to="/my-issues" className="text-white hover:text-red-400" onClick={() => setIsMenuOpen(false)}>
                                        My Issues
                                    </Link>
                                )}
                                <button 
                                    onClick={logout} 
                                    className="w-full text-left px-3 py-2 rounded border border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/books" element={<Books/>} />
                <Route path="/login" element={<LoginWithProps />} />
                <Route path="/register" element={<Register/>} />
                {/* NEW ROUTE */}
                <Route path="/admin" element={<LibrarianDashboard />} /> 
                {/* NEW ROUTE */}
                <Route path="/my-issues" element={<MyIssues />} />
            </Routes>
        </>
    )
}