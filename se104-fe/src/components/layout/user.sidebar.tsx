import React from "react";
import {
  FaHome,
  FaHeart,
  FaHistory,
  FaMoneyBillAlt,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64  min-h-screen bg-[#153D36] text-white flex flex-col items-center px-4 py-8 h-full">
      <div className="mb-8">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
      </div>

      <nav className="flex flex-col gap-6 w-full">
        <SidebarItem
          icon={<FaHome />}
          label="Trang chủ"
          onClick={() => navigate("/")}
        />
        <SidebarItem
          icon={<FaHeart />}
          label="Yêu thích"
          onClick={() => navigate("/favorites")}
        />
        <SidebarItem
          icon={<FaHistory />}
          label="Lịch sử mượn"
          onClick={() => navigate("/history")}
        />
        <SidebarItem
          icon={<FaMoneyBillAlt />}
          label="Thanh toán tiền phạt"
          onClick={() => navigate("/payment")}
        />
        <SidebarItem
          icon={<FaComments />}
          label="Trò chuyện"
          onClick={() => navigate("/chat")}
        />
      </nav>

      <div className="mt-12 text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
          alt="Library"
          className="w-20 h-20 mx-auto"
        />
        <p className="text-white italic font-bold text-lg">Library</p>
      </div>

      <div className="mt-auto pt-8">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 text-sm hover:text-red-400 transition-colors"
        >
          <FaSignOutAlt />
          <span>ĐĂNG XUẤT</span>
        </button>
      </div>
    </aside>
  );
};

const SidebarItem = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 text-left hover:text-green-300 transition-colors"
  >
    <div className="w-6 text-lg flex justify-center">{icon}</div>
    <span>{label}</span>
  </button>
);

export default UserSidebar;
