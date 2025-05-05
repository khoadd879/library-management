import React from "react";
import {
  FaHome,
  FaUsers,
  FaPlus,
  FaBoxOpen,
  FaClipboardList,
  FaChartPie,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { icon: <FaHome />, label: "Trang chủ" },
  { icon: <FaUsers />, label: "Danh sách" },
  { icon: <FaPlus />, label: "Thêm độc giả/tác giả" },
  { icon: <FaBoxOpen />, label: "Tiếp nhận sách" },
  { icon: <FaClipboardList />, label: "Mượn trả sách" },
  { icon: <FaChartPie />, label: "Báo cáo" },
  { icon: <FaComments />, label: "Trò chuyện" },
];

const AppSidebar = () => {
  return (
    <aside className="w-64 h-screen bg-[#153D36] text-white flex flex-col px-4 py-8">
      <div className="flex justify-center mb-10">
        <div className="w-20 h-20 bg-gray-300 rounded-full" />
      </div>
      <nav className="flex flex-col gap-6 ml-4 ">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex  items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors "
          >
            <div className="w-6 text-lg flex justify-center text-white">
              {item.icon}
            </div>
            <span className="text-white">{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="mt-auto pt-10">
        <a
          href="#"
          className="flex items-center gap-3 px-2 py-1 hover:text-red-400 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white ml-6">
            <FaSignOutAlt />
          </div>
          <span className="text-white">ĐĂNG XUẤT</span>
        </a>
      </div>
    </aside>
  );
};

export default AppSidebar;
