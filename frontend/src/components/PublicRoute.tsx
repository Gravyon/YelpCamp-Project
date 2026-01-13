import { useUserStore } from "../store/userStore";
import Loader from "./Loader";
import { Navigate, Outlet } from "react-router-dom";

export const PublicRoute = () => {
  const { isAuthenticated, isCheckingAuth } = useUserStore();

  if (isCheckingAuth) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Loader />
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to="/campgrounds" replace />;
  }

  return <Outlet />;
};
