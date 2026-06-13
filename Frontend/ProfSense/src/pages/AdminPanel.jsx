import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/get_faculty.php`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.faculty);
            } else {
                alert("Failed to load users: " + data.message);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/delete_user.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();
            if (data.success) {
                alert("User deleted successfully");
                // Refresh the user list after deletion
                fetchUsers();
            } else {
                alert("Error deleting user: " + data.message);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Admin Panel - Manage Users</h2>
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-4">
                <table className="w-full table-auto">
                    <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">S.No</th>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Emp ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className="border-t">
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.emp_id}</td>
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.designation}</td>
                            <td className="px-4 py-2">{user.status ? user.status : "Available"}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center py-4">
                                No users found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
