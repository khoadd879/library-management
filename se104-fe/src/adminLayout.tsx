import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "antd";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <Button type="primary" onClick={() => navigate("/admin/roles")}>
          Quản lý Vai Trò
        </Button>
        <Button onClick={() => navigate("/admin/users")}>
          Quản lý Người Dùng
        </Button>
      </div>

      <Outlet />
    </div>
  );
};

export default AdminLayout;
