// Thêm import Navigate
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import { useCurrentApp } from "@/components/context/app.context";
import { Button, Result, Spin } from "antd";

const ProtectedRoute = () => {
  const { isAuthenticated, user, loading } = useCurrentApp();
  const location = useLocation();

  // 1. Nếu đang tải thì hiện Spin xoay
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // 2. QUAN TRỌNG: Nếu chưa đăng nhập -> Chuyển hướng hẳn sang trang /landingPage
  if (!isAuthenticated) {
    return <Navigate to="/landingPage" replace />;
  }

  // 3. Logic check quyền (Giữ nguyên)
  const role = user?.data?.roleName;
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
