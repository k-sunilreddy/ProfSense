import { useState, useEffect } from "react";
import { getStoredUser } from "../helpers/storage";

const UpdateStatus = () => {
    const user = getStoredUser();
    const [status, setStatus] = useState("");
    const [availableFrom, setAvailableFrom] = useState("");
    const [availableTo, setAvailableTo] = useState("");
    const [facultyList, setFacultyList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [resetLoading, setResetLoading] = useState(false);
    const [resetMessage, setResetMessage] = useState("");

    // If the logged-in user is admin, fetch the list of faculty
    useEffect(() => {
        if (user && user.emp_id.toLowerCase() === "admin") {
            fetch(`${import.meta.env.VITE_API_URL}/get_faculty.php`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setFacultyList(data.faculty);
                    } else {
                        alert("Failed to load faculty list: " + data.message);
                    }
                })
                .catch((error) => console.error("Error fetching faculty list:", error));
        }
    }, [user]);

    // Hour options in 12-hour format from 09:00 to 04:00, with an order property for filtering
    const hourOptions = [
        { value: "", label: "--", order: 0 },
        { value: "09:00", label: "09:00", order: 1 },
        { value: "10:00", label: "10:00", order: 2 },
        { value: "11:00", label: "11:00", order: 3 },
        { value: "12:00", label: "12:00", order: 4 },
        { value: "01:00", label: "01:00", order: 5 },
        { value: "02:00", label: "02:00", order: 6 },
        { value: "03:00", label: "03:00", order: 7 },
        { value: "04:00", label: "04:00", order: 8 }
    ];

    const handleFromChange = (e) => {
        const newFrom = e.target.value;
        setAvailableFrom(newFrom);
        // If the current "to" value is before the new "from", clear it.
        if (availableTo) {
            const fromObj = hourOptions.find(hour => hour.value === newFrom);
            const toObj = hourOptions.find(hour => hour.value === availableTo);
            if (fromObj && toObj && toObj.order <= fromObj.order) {
                setAvailableTo("");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("You are not logged in!");
            return;
        }
        let targetUserId = user.id;
        // If admin, allow updating another faculty's status
        if (user.emp_id.toLowerCase() === "admin") {
            if (!selectedFaculty) {
                alert("Please select a faculty member to update.");
                return;
            }
            targetUserId = selectedFaculty;
        }
        const payload = {
            userId: targetUserId,
            status: status,
            availableFrom: availableFrom, // optional
            availableTo: availableTo      // optional
        };
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/update_status.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                alert("Status updated successfully to " + data.status);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    // Reset statuses to "Not Updated" (only for admin)
    const handleReset = async () => {
        if (!user || user.emp_id.toLowerCase() !== "admin") {
            alert("Only admin can reset statuses!");
            return;
        }
        setResetLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/reset_status.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data.success) {
                setResetMessage("Statuses reset successfully!");
            } else {
                setResetMessage(data.message);
            }
        } catch (error) {
            console.error("Error resetting statuses:", error);
            setResetMessage("Error resetting statuses");
        }
        setResetLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">
                {/* Left Side: Illustration (visible on medium and larger screens) */}
                <div className="hidden md:block md:w-1/2">
                    <img
                        src="/AUlogo.png"
                        alt="Update Status Illustration"
                        className="w-full h-full object-contain"
                    />
                </div>
                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-bold text-gray-800 text-center">
                        Update Your Status
                    </h2>
                    <p className="text-gray-600 text-center mt-2 mb-6">
                        Please select your current status and available timings.
                    </p>
                    {/* Admin-specific Faculty Dropdown */}
                    {user && user.emp_id.toLowerCase() === "admin" && (
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm font-medium">
                                Select Faculty
                            </label>
                            <select
                                value={selectedFaculty}
                                onChange={(e) => setSelectedFaculty(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Faculty</option>
                                {facultyList.map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}>
                                        {faculty.name} ({faculty.emp_id})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                                <option value="In Meeting">In Meeting</option>
                                <option value="On Invigilation Duty">On Invigilation Duty</option>
                                <option value="On Leave">On Leave</option>
                            </select>
                        </div>
                        <div className="flex space-x-4">
                            <div className="w-1/2">
                                <label className="block text-gray-600 text-sm font-medium">
                                    Available From
                                </label>
                                <select
                                    value={availableFrom}
                                    onChange={handleFromChange}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {hourOptions.map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-gray-600 text-sm font-medium">
                                    Available To
                                </label>
                                <select
                                    value={availableTo}
                                    onChange={(e) => setAvailableTo(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">-- Select --</option>
                                    {availableFrom
                                        ? hourOptions
                                            .filter(hour => hour.order > hourOptions.find(h => h.value === availableFrom).order)
                                            .map((option, idx) => (
                                                <option key={idx} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))
                                        : hourOptions.map((option, idx) => (
                                            <option key={idx} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Update Status
                        </button>
                    </form>
                    {/* Reset Status Section (Admin only) */}
                    {user && user.emp_id.toLowerCase() === "admin" && (
                        <div className="mt-8 border-t pt-4">
                            <p className="text-center text-gray-600 mb-2">
                                Reset all statuses to "Not Updated"?
                            </p>
                            <button
                                onClick={handleReset}
                                disabled={resetLoading}
                                className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {resetLoading ? "Resetting..." : "Reset Statuses"}
                            </button>
                            {resetMessage && (
                                <p className="mt-2 text-center text-green-600">{resetMessage}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpdateStatus;
