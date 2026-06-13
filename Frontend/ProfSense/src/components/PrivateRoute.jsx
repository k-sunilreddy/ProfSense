import React from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser } from "../helpers/storage";

const PrivateRoute = ({ children }) => {
    const user = getStoredUser();

    if (!user) {
        // Not authenticated; redirect to login page.
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
