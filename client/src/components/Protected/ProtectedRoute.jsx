import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/Auth/AuthContextProvider";

function ProtectedRoute() {
    const { user } = useAuth(); // Get user state from context

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />; 
}

export default ProtectedRoute;
