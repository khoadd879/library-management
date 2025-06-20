import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navs = [
    {
      label: "Trang chủ",
      path: "/",
    },
    {
      label: "Quản lý Vai Trò",
      path: "/admin/roles",
    },
    {
      label: "Quản lý Người Dùng",
      path: "/admin/users",
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#e0f7fa]">
      <div className="flex gap-4 mb-8 bg-white rounded-xl shadow p-4">
        {navs.map((nav) => {
          const isActive =
            location.pathname === nav.path ||
            (nav.path !== "/" && location.pathname.startsWith(nav.path));
          const isHome = nav.path === "/";
          return (
            <Button
              key={nav.path}
              type={isActive ? "primary" : "default"}
              className={
                isActive
                  ? "!bg-[#1677ff] !text-white !border-[#1677ff] shadow-md"
                  : isHome
                  ? "!bg-white !text-[#1677ff] !border-[#1677ff] hover:!bg-[#e0f7fa] hover:!text-[#0d47a1] hover:!border-[#0d47a1]"
                  : "!bg-white !text-[#1677ff] !border-[#1677ff] hover:!bg-[#e6f4ff]"
              }
              onClick={() => navigate(nav.path)}
              size="large"
              style={{ borderRadius: 8, fontWeight: 500 }}
            >
              {nav.label}
            </Button>
          );
        })}
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
