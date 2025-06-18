import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaHeart,
  FaHistory,
  FaMoneyBillAlt,
  FaComments,
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCurrentApp } from "../context/app.context";
import { getListReader } from "../../services/api";

interface UserSidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated, user, setUser } = useCurrentApp();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/signin");
  };

  const menuItems = [
    {
      icon: <FaHome size={20} />,
      label: "Trang chủ",
      onClick: () => navigate("/"),
    },
    {
      icon: <FaHeart size={20} />,
      label: "Yêu thích",
      onClick: () => navigate("/favorites"),
    },
    {
      icon: <FaHistory size={20} />,
      label: "Lịch sử mượn",
      onClick: () => navigate("/history"),
    },
    {
      icon: <FaComments size={20} />,
      label: "Trò chuyện",
      onClick: () => navigate("/chat"),
    },
    ...(user?.roleName === "Manager" || user?.roleName === "Admin"
      ? [
          {
            icon: <FaUserCircle size={20} />,
            label: "Thủ thư",
            onClick: () => navigate("/manager"),
          },
        ]
      : []),
    ...(user?.roleName === "Admin"
      ? [
          {
            icon: <FaUserCircle size={20} />,
            label: "Trang quản trị",
            onClick: () => navigate("/admin"),
          },
        ]
      : []),
  ];

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const readers = await getListReader();
        const found = Array.isArray(readers)
          ? readers.find((r) => r.idReader === user?.idReader)
          : null;
        setAvatarUrl(found?.urlAvatar || null);
      } catch (e) {
        setAvatarUrl(null);
      }
    };
    if (user) fetchAvatar();
  }, [user]);

  return (
    <nav
      className={`fixed top-0 left-0 h-full p-2 flex flex-col duration-300 bg-[#153D36] text-white z-50 ${
        open ? "w-72" : "w-20"
      }`}
      aria-label="Sidebar"
    >
      {/* Header - User Info */}
      <div className="px-4 py-6 flex justify-between items-center border-b border-white/20">
        <button
          className="hover:bg-white/10 rounded-md transition-colors w-full overflow-hidden"
          onClick={() => navigate("/profile")}
        >
          <div className={`flex items-center gap-4 ${!open && "hidden"}`}>
            {/* Avatar with fixed size */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0" />
            )}
            {/* Text container with constrained width */}
            <div className="flex-1 ">
              <p className="font-medium text-left text-md ">
                {user?.nameReader}
              </p>
              <span className="text-sm text-left opacity-80 ">
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
      {/* Navigation Items */}
      <ul className="flex-0 py-6 space-y-4 flex flex-col">
        {menuItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={item.onClick}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/10 rounded-md transition-colors duration-300 relative group"
            >
              <div className="flex justify-center w-8">{item.icon}</div>
              <span
                className={`${
                  !open ? "opacity-0 w-0" : "opacity-100"
                } transition-all duration-300 truncate text-md`}
              >
                {item.label}
              </span>
              {/* Tooltip khi sidebar đóng */}
              {!open && (
                <span className="absolute left-16 bg-white text-gray-800 text-base px-4 py-2 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {/* Group Logo */}
      <div className={`flex flex-col m-auto ${!open && "hidden"}`}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
          alt="Library"
          className="w-15 h-15 filter invert "
        />
        <p className="italic font-bold text-xl">Library</p>
      </div>
      {/* Footer - Logout */}
      <div className="mt-auto py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 hover:bg-white/10 rounded-md transition-colors duration-300 relative group"
        >
          <div className="flex justify-center w-8">
            <FaSignOutAlt size={20} />
          </div>
          <span
            className={`${
              !open ? "opacity-0 w-0" : "opacity-100"
            } transition-all duration-300 text-md`}
          >
            ĐĂNG XUẤT
          </span>
          {/* Tooltip khi sidebar đóng */}
          {!open && (
            <span className="absolute left-16 bg-white text-gray-800 text-base px-4 py-2 rounded-md shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              ĐĂNG XUẤT
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default UserSidebar;
