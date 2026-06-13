import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UpdateStatus from "./pages/UpdateStatus";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import { getStoredUser } from "./helpers/storage";

const AppRoutes = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = () => {
            // If the user is not authenticated, redirect to login page.
            if (!getStoredUser()) {
                navigate("/login", { replace: true });
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate]);

    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<PrivateRoute><Signup /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/update-status" element={<PrivateRoute><UpdateStatus /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            <Navbar />
            <AppRoutes />
        </Router>
    );
}

export default App;
