import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../components/ui/Loader/Loader";

function PrivateRoute({ children }) {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="fixed top-1/2 left-1/2">
        <Loader />
      </div>
    );
  }

  if (user && user.email) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
}

export default PrivateRoute;
