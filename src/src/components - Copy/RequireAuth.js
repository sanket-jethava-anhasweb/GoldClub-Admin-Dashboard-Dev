import { useLocation, Navigate, Outlet } from "react-router-dom";
import { roles } from "../constants/Roles";

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const auth = localStorage.getItem("vjw-ad-user")

    return (
        // new Array(auth?.roles)?.find(role => allowedRoles?.includes(role))
        auth
            // allowedRoles == auth?.roles
            ? <Outlet />
            : auth && JSON.parse(auth?.token) ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;