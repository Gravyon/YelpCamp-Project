import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import Loader from "../common/Loader";

function ProtectedRoute() {
  const { isCheckingAuth, isAuthenticated } = useUserStore();
  const location = useLocation();
  if (isCheckingAuth) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Loader />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
