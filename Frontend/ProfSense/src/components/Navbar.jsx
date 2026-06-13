import { Link, useNavigate, useLocation } from "react-router-dom";
import { getStoredUser } from "../helpers/storage";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getStoredUser();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Hide Navbar on login and signup pages
    if (!user || location.pathname === "/" || location.pathname === "/signup") {
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        alert("Logged out successfully!");
        navigate("/");
    };

    return (
        <nav className="bg-[#FD752C] p-4 text-white fixed top-0 left-0 w-full z-50">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left: Logo and Brand */}
                <div className="flex items-center">
                    <Link to="/dashboard" className="flex items-center">
                        <img src="/ProfClogo2.jpeg" alt="Logo" className="w-8 h-8 mr-2" />
                        <span className="text-xl font-bold">Profsense</span>
                    </Link>
                </div>
                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex space-x-6 items-center">
                    <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link to="/update-status" className="hover:underline">Update Status</Link>
                    {user.emp_id.toLowerCase() === "admin" && (
                        <>
                            <Link to="/admin" className="hover:underline">Admin Panel</Link>
                            <Link to="/Signup" className="hover:underline">Register</Link>
                        </>
                    )}
                    {/* Replaced "Profile" with user icon and user's name */}
                    <Link to="/profile" className="flex items-center hover:underline">
                        <svg
                            version="1.0"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-2"
                            viewBox="0 0 512 512"
                            preserveAspectRatio="xMidYMid meet"
                            fill="currentColor"
                        >
                            <g transform="translate(0,512) scale(0.1,-0.1)">
                                <path d="M2335 5105 c-273 -42 -517 -172 -708 -375 -210 -223 -319 -481 -334 -790 -21 -432 191 -845 557 -1084 180 -118 353 -178 563 -195 389 -30 721 92 989 365 213 216 321 452 347 753 36 402 -116 776 -419 1038 -196 168 -376 252 -625 288 -120 17 -260 18 -370 0z"/>
                                <path d="M1427 2639 c-452 -48 -766 -372 -912 -944 -97 -381 -122 -839 -60 -1090 51 -201 218 -405 411 -503 87 -44 212 -80 317 -92 62 -8 534 -10 1437 -8 l1345 3 85 24 c316 86 532 298 611 596 41 155 36 525 -12 817 -105 650 -371 1040 -792 1162 -96 28 -268 49 -319 39 -49 -9 -117 -45 -271 -144 -164 -106 -187 -118 -310 -164 -142 -53 -259 -76 -396 -76 -140 0 -248 20 -390 70 -134 48 -140 51 -350 184 -110 70 -192 115 -224 124 -56 14 -56 14 -170 2z"/>
                            </g>
                        </svg>
                        <span>{user.name}</span>
                    </Link>
                </div>
                {/* Right: Logout Button (Desktop) */}
                <div className="hidden md:block">
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white text-[#FD752C] rounded-lg transition-colors duration-200 hover:bg-red-600 hover:text-white"
                    >
                        Logout
                    </button>
                </div>
                {/* Mobile: Hamburger Menu */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#FD752C] p-4">
                    <div className="flex flex-col space-y-4">
                        <Link onClick={() => setMobileMenuOpen(false)} to="/dashboard" className="hover:underline text-white">
                            Dashboard
                        </Link>
                        <Link onClick={() => setMobileMenuOpen(false)} to="/update-status" className="hover:underline text-white">
                            Update Status
                        </Link>
                        {user.emp_id.toLowerCase() === "admin" && (
                            <>
                                <Link onClick={() => setMobileMenuOpen(false)} to="/admin" className="hover:underline text-white">
                                    Admin Panel
                                </Link>
                                <Link onClick={() => setMobileMenuOpen(false)} to="/Signup" className="hover:underline text-white">
                                    Register
                                </Link>
                            </>
                        )}
                        <Link onClick={() => setMobileMenuOpen(false)} to="/profile" className="flex items-center hover:underline text-white">
                            <svg
                                version="1.0"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4 mr-2"
                                viewBox="0 0 512 512"
                                preserveAspectRatio="xMidYMid meet"
                                fill="currentColor"
                            >
                                <g transform="translate(0,512) scale(0.1,-0.1)" fill="currentColor" stroke="none">
                                    <path d="M2335 5105 c-273 -42 -517 -172 -708 -375 -210 -223 -319 -481 -334 -790 -21 -432 191 -845 557 -1084 180 -118 353 -178 563 -195 389 -30 721 92 989 365 213 216 321 452 347 753 36 402 -116 776 -419 1038 -196 168 -376 252 -625 288 -120 17 -260 18 -370 0z"/>
                                    <path d="M1427 2639 c-452 -48 -766 -372 -912 -944 -97 -381 -122 -839 -60 -1090 51 -201 218 -405 411 -503 87 -44 212 -80 317 -92 62 -8 534 -10 1437 -8 l1345 3 85 24 c316 86 532 298 611 596 41 155 36 525 -12 817 -105 650 -371 1040 -792 1162 -96 28 -268 49 -319 39 -49 -9 -117 -45 -271 -144 -164 -106 -187 -118 -310 -164 -142 -53 -259 -76 -396 -76 -140 0 -248 20 -390 70 -134 48 -140 51 -350 184 -110 70 -192 115 -224 124 -56 14 -56 14 -170 2z"/>
                                </g>
                            </svg>
                            <span>{user.name}</span>
                        </Link>
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false);
                                handleLogout();
                            }}
                            className="px-4 py-2 bg-white text-[#FD752C] rounded-lg transition-colors duration-200 hover:bg-gray-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
