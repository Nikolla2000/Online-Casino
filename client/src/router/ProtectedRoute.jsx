import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
    const { user, accessToken } = useSelector((state) => state.auth);

    if (!accessToken || !user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;