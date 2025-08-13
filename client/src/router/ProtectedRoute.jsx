const { useSelector } = require("react-redux");

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const { accessToken } = useSelector((state) => state.auth);

    if (!accessToken || !user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;