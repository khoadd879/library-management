import { Link, Outlet, useLocation } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { Button, Result } from "antd";
import LandingPage from "@/pages/landingPage";

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useCurrentApp();
  const location = useLocation();
  const role = user?.data.roleName;
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const path = location.pathname;
  const isAdmin = path.includes("admin");
  const isManager = path.includes("manager");

  const isForbidden =
    (role === "Reader" && (isAdmin || isManager)) ||
    (role === "Manager" && isAdmin);

  if (isForbidden) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary">
            <Link to="/">Back Home</Link>
          </Button>
        }
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
