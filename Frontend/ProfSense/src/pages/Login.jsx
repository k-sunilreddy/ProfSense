import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
    const [empId, setEmpId] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/login.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ EmpId: empId, Password: password }),
            });
            const data = await res.json();
            if (data.success) {
                alert("Login successful!");
                setIsAuthenticated && setIsAuthenticated(true);
                // If admin, store in sessionStorage only; otherwise, respect Remember Me
                if (empId.toLowerCase() === "admin") {
                    sessionStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    if (rememberMe) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                    } else {
                        sessionStorage.setItem("user", JSON.stringify(data.user));
                    }
                }
                navigate("/dashboard");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
                <div className="hidden md:block md:w-1/2">
                    <img src="./ProfClogo2.jpeg" alt="Login" className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>
                    <p className="text-gray-500 text-center mb-6">Login to continue</p>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Employee ID"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        {empId.toLowerCase() !== "admin" && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="rememberMe" className="text-sm text-gray-700">
                                    Remember Me
                                </label>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full p-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    </form>
            {/*        <p className="text-gray-600 text-center mt-4">*/}
            {/*            Don't have an account?{" "}*/}
            {/*            <span onClick={() => navigate("/signup")} className="text-blue-600 cursor-pointer hover:underline">*/}
            {/*  Sign Up*/}
            {/*</span>*/}
            {/*        </p>*/}
                </div>
            </div>
        </div>
    );
};

export default Login;
