import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaUsers,
  FaPlus,
  FaBoxOpen,
  FaClipboardList,
  FaChartPie,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaNewspaper,
  FaUserCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import { getPermissionsByRoleAPI, logoutAPI } from "@/services/api";

interface AdminSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppSidebar: React.FC<AdminSidebarProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, user, setUser } = useCurrentApp();
  const [permissions, setPermissions] = useState<string[]>([]);
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    await logoutAPI(refreshToken!);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/signin");
  };
  useEffect(() => {
    const fetchPermissions = async () => {
      if (user?.roleName) {
        try {
          const res = await getPermissionsByRoleAPI(user.roleName);
          console.log(res);
          const names = res.map((p: any) => p.permissionName);
          setPermissions(names);
        } catch (err) {
          console.error("Lỗi khi tải quyền:", err);
        }
      }
    };

    fetchPermissions();
  }, [user?.roleName]);

  const menuItems = [
    {
      icon: <FaHome size={20} />,
      label: "Trang chủ",
      onClick: () => navigate("/manager"),
      permission: null,
    },
    {
      icon: <FaUsers size={20} />,
      label: "Danh sách",
      onClick: () => navigate("/manager/list"),
      permission: "manageUsers",
    },
    {
      icon: <FaPlus size={20} />,
      label: "Thêm độc giả/tác giả",
      onClick: () => navigate("/manager/add"),
      permission: "viewLists",
    },
    {
      icon: <FaBoxOpen size={20} />,
      label: "Tiếp nhận sách",
      onClick: () => navigate("/manager/receive"),
      permission: "receiveBooks",
    },
    {
      icon: <FaClipboardList size={20} />,
      label: "Mượn trả sách",
      onClick: () => navigate("/manager/borrow"),
      permission: "borrowBooks",
    },
    {
      icon: <FaComments size={20} />,
      label: "Trò chuyện",
      onClick: () => navigate("/manager/chat"),
      permission: "chat",
    },
    {
      icon: <FaNewspaper size={20} />,
      label: "Sửa luật",
      onClick: () => navigate("/manager/parameter"),
      permission: "parameter",
    },
    {
      icon: <FaChartPie size={20} />,
      label: "Báo cáo trả trễ",
      onClick: () => navigate("/manager/report"),
      permission: "viewReports",
    },
    {
      icon: <FaUserCircle size={20} />,
      label: "Reader",
      onClick: () => navigate("/user"), // Đổi route nếu cần
      permission: null,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 h-full p-2 flex flex-col duration-300 bg-[#153D36] text-white z-50 ${
        open ? "w-72" : "w-20"
      }`}
      aria-label="Sidebar"
    >
      {/* Header - User Info */}
      <div className="px-4 py-4 flex justify-between items-center border-b border-white/20">
        <button
          className="hover:bg-white/10 rounded-md transition-colors w-full overflow-hidden"
          onClick={() => navigate("/admin/profile")}
        >
          <div className={`flex items-center gap-4 ${!open && "hidden"}`}>
            {/* Avatar with fixed size */}
            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex-shrink-0"></div>
            {/* Text container with constrained width */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="font-medium text-left text-lg truncate">
                {user?.nameReader}
              </p>
              <span className="text-sm text-left opacity-80 truncate">
                {user?.email}
              </span>
            </div>
          </div>
        </button>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0"
        >
          <FaBars
            size={20}
            className={`duration-300 ${!open && "rotate-90"}`}
          />
        </button>
      </div>

      {/* Navigation Items - Scrollable area */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2">
          {menuItems
            .filter(
              (item) =>
                !item.permission || permissions.includes(item.permission)
            )
            .map((item, index) => (
              <li key={index}>
                <button
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition-colors duration-300 relative group"
                >
                  <div className="flex justify-center w-6">{item.icon}</div>
                  <span
                    className={`${
                      !open ? "opacity-0 w-0" : "opacity-100"
                    } transition-all duration-300 truncate text-sm`}
                  >
                    {item.label}
                  </span>
                  {!open && (
                    <span className="absolute left-12 bg-white text-gray-800 text-sm px-3 py-1 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </div>

      {/* Group Logo */}
      <div
        className={`flex flex-col items-center pt-2 pb-4 ${!open && "hidden"}`}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
          alt="Library"
          className="w-16 h-16 filter invert mb-2"
        />
        <p className="italic font-bold text-sm">Library Admin</p>
      </div>

      {/* Footer - Logout */}
      <div className="py-2 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-md transition-colors duration-300 relative group"
        >
          <div className="flex justify-center w-6">
            <FaSignOutAlt size={20} />
          </div>
          <span
            className={`${
              !open ? "opacity-0 w-0" : "opacity-100"
            } transition-all duration-300 text-sm`}
          >
            ĐĂNG XUẤT
          </span>
          {/* Tooltip khi sidebar đóng */}
          {!open && (
            <span className="absolute left-12 bg-white text-gray-800 text-sm px-3 py-1 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              ĐĂNG XUẤT
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default AppSidebar;
