import { useState, useEffect } from "react";

const Dashboard = () => {
    const [faculty, setFaculty] = useState([]);

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/get_faculty.php`);
                const data = await res.json();
                if (data.success) {
                    setFaculty(data.faculty);
                } else {
                    alert("Failed to load faculty data: " + data.message);
                }
            } catch (error) {
                console.error("Error fetching faculty data:", error);
            }
        };

        fetchFaculty();
    }, []);

    return (
        <div className="relative pt-20 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
            {/* Background watermark logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <img src="/logo.png" alt="Watermark Logo" className="w-1/3 h-auto" />
            </div>

            {/* Main content */}
            <div className="relative z-10">
                <header className="mb-8">
                    <h2 className="text-4xl font-bold text-center text-gray-800">
                        Faculty Dashboard
                    </h2>
                    <p className="mt-2 text-center text-gray-600">
                        Live status updates of all faculty
                    </p>
                </header>
                <div className="max-w-7xl mx-auto">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {faculty.map((user) => {
                            // Determine status text and background color
                            const statusText = user.status ? user.status : "Available";
                            let statusBg = "bg-green-500";
                            const statusLower = statusText.toLowerCase();
                            if (statusLower === "not updated") {
                                statusBg = "bg-slate-800";
                            } else if (statusLower === "busy") {
                                statusBg = "bg-red-500";
                            } else if (statusLower === "in meeting") {
                                statusBg = "bg-yellow-500";
                            } else if (statusLower === "on invigilation duty" || statusLower === "invigilation") {
                                statusBg = "bg-blue-500";
                            } else if (statusLower === "on leave") {
                                statusBg = "bg-gray-500";
                            }

                            return (
                                <div
                                    key={user.emp_id}
                                    className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xl font-bold text-gray-800">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.designation || ""}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                      <span className={`px-3 py-1 rounded-full text-white font-semibold ${statusBg}`}>
                        {statusText}
                      </span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-gray-600">{user.email}</p>
                                    </div>
                                    {/* Available Timings Section with "Available at:" phrase */}
                                    {(user.availableFrom || user.availableTo) && (
                                        <div className="mt-2">
                                            <p className="text-lg font-semibold text-green-600">
                                                Available at: {user.availableFrom ? user.availableFrom : "--"} to {user.availableTo ? user.availableTo : "--"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
