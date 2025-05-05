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
import { useNavigate } from "react-router-dom";

const AppSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 min-h-screen bg-[#153D36] text-white flex flex-col px-4 py-8 h-full">
      <div className="flex justify-center mb-10">
        <div className="w-20 h-20 bg-gray-300 rounded-full" />
      </div>

      <nav className="flex flex-col gap-6 ml-4">
        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaHome />
          </div>
          <span className="text-white">Trang chủ</span>
        </button>

        <button
          onClick={() => navigate("/admin/list")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaUsers />
          </div>
          <span className="text-white">Danh sách</span>
        </button>

        <button
          onClick={() => navigate("/admin/add")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaPlus />
          </div>
          <span className="text-white">Thêm độc giả/tác giả</span>
        </button>

        <button
          onClick={() => navigate("/admin/receive")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaBoxOpen />
          </div>
          <span className="text-white">Tiếp nhận sách</span>
        </button>

        <button
          onClick={() => navigate("/admin/borrow")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaClipboardList />
          </div>
          <span className="text-white">Mượn trả sách</span>
        </button>

        <button
          onClick={() => navigate("/admin/report")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaChartPie />
          </div>
          <span className="text-white">Báo cáo</span>
        </button>

        <button
          onClick={() => navigate("/admin/chat")}
          className="flex items-center gap-3 px-2 py-1 hover:text-green-300 transition-colors"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaComments />
          </div>
          <span className="text-white">Trò chuyện</span>
        </button>
      </nav>

      <div className="mt-auto pt-10">
        <button
          onClick={() => alert("Đăng xuất")}
          className="flex items-center gap-3 px-2 py-1 hover:text-red-400 transition-colors ml-6"
        >
          <div className="w-6 text-lg flex justify-center text-white">
            <FaSignOutAlt />
          </div>
          <span className="text-white">ĐĂNG XUẤT</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
