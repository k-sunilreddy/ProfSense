import { useState, useEffect } from "react";
import { getStoredUser } from "../helpers/storage";

const Profile = () => {
    const [profile, setProfile] = useState(null); // fetched profile from API
    const [editedProfile, setEditedProfile] = useState({ name: "", department: "" });
    const [newPassword, setNewPassword] = useState(""); // for admin password update
    const [editing, setEditing] = useState(false);

    const user = getStoredUser();

    // Fetch profile from backend once when component mounts
    useEffect(() => {
        if (user && user.id) {
            fetch(`${import.meta.env.VITE_API_URL}/profile.php?userId=${user.id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setProfile(data.user);
                        // Initialize editedProfile only if not in editing mode
                        if (!editing) {
                            setEditedProfile({
                                name: data.user.name,
                                department: data.user.department || "",
                            });
                        }
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching profile:", error);
                    alert("Error fetching profile");
                });
        }
    }, [user, editing]);

    const handleSave = async () => {
        if (!user) return;
        const payload = {
            userId: user.id,
            Name: editedProfile.name,
            Department: editedProfile.department,
        };

        // For admin, include new password if provided
        if (user.emp_id.toLowerCase() === "admin" && newPassword.trim() !== "") {
            payload.Password = newPassword;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/profile.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                alert("Profile updated successfully");
                setEditing(false);
                setNewPassword("");
                // Re-fetch the updated profile to update the UI
                fetch(`${import.meta.env.VITE_API_URL}/profile.php?userId=${user.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            setProfile(data.user);
                            setEditedProfile({
                                name: data.user.name,
                                department: data.user.department || "",
                            });
                        }
                    });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile");
        }
    };

    if (!profile) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
            <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl">
                {/* Left Side: Image (using login/signup style image) */}
                <div className="hidden md:flex md:w-1/2 md:justify-center md:items-center">
                    <img
                        src="/AUlogo.png"
                        alt="Side Visual"
                        className="w-full h-auto object-contain"
                    />
                </div>
                {/* Right Side: Profile Details */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
                    <div className="space-y-4">
                        {/* Employee ID (read-only) */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Employee ID</label>
                            <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-50">{profile.emp_id}</p>
                        </div>
                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Designation</label>
                            <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-50">{profile.email}</p>
                        </div>
                        {/* Name (editable) */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Name</label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editedProfile.name}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                />
                            ) : (
                                <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-50">{profile.name}</p>
                            )}
                        </div>
                        {/* Department (editable) */}
                        <div>
                            <label className="block text-gray-600 text-sm font-medium">Department</label>
                            {editing ? (
                                <input
                                    type="text"
                                    name="department"
                                    value={editedProfile.department}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, department: e.target.value })}
                                    placeholder="Enter Department"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                />
                            ) : (
                                <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-50">{profile.department || "Not set"}</p>
                            )}
                        </div>
                        {/* For admin only: Password field */}
                        {user && user.emp_id.toLowerCase() === "admin" && (
                            <div>
                                <label className="block text-gray-600 text-sm font-medium">New Password</label>
                                {editing ? (
                                    <input
                                        type="password"
                                        name="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                ) : (
                                    <p className="mt-1 p-2 border border-gray-300 rounded bg-gray-50">********</p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-6 flex justify-end">
                        {editing ? (
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Save
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
