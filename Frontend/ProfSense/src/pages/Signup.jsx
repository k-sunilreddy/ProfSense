import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [empId, setEmpId] = useState("");
    const [name, setName] = useState("");
    const [designation, setDesignation] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/register.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    EmpId: empId,
                    Name: name,
                    Designation: designation,
                    Password: password
                }),
            });
            const data = await res.json();
            if (data.success) {
                alert("Register successful!");
                //navigate("/signup");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Register failed.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
                {/* Left Side Image */}
                <div className="hidden md:block md:w-1/2">
                    <img src="/ProfClogo2.jpeg" alt="Signup" className="w-full h-full object-cover" />
                </div>
                {/* Right Side Form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Create an Account</h2>
                    <p className="text-gray-500 text-center mb-6">Register New Faculty</p>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Employee ID"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
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
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button type="submit" className="w-full p-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition">
                            Register
                        </button>
                    </form>
            {/*        <p className="text-gray-600 text-center mt-4">*/}
            {/*            Already have an account?{" "}*/}
            {/*            <span onClick={() => navigate("/")} className="text-blue-600 cursor-pointer hover:underline">*/}
            {/*  Login*/}
            {/*</span>*/}
            {/*        </p>*/}
                </div>
            </div>
        </div>
    );
};

export default Signup;
