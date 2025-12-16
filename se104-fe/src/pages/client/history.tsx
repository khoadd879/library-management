import React, { useEffect, useState } from "react";
import { getLoanSlipHistoryAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
import { message, Spin } from "antd";

const History = () => {
  const [history, setHistory] = useState<ILoanHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) {
        message.error("Không tìm thấy người dùng.");
        return;
      }
      try {
        setLoading(true);
        const res = await getLoanSlipHistoryAPI(idUser);
        if (Array.isArray(res)) {
          setHistory(res);
        }
      } catch (err) {
        console.error("Lỗi khi tải lịch sử mượn:", err);
        message.error("Không thể tải lịch sử mượn sách.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d3edd8] to-[#f4f7f9] px-4 md:px-10 py-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#153D36] drop-shadow animate-fade-in-up">
        Lịch sử mượn sách
      </h2>
      {loading ? (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <Spin size="large" className="scale-150" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl shadow-2xl bg-white animate-fade-in-up">
          <table className="min-w-full">
            <thead className="bg-[#153D36] text-white text-left">
              <tr>
                <th className="px-4 py-3">Tên sách</th>
                <th className="px-4 py-3">Thể loại</th>
                <th className="px-4 py-3">Ngày mượn</th>
                <th className="px-4 py-3">Ngày trả</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-[#e3f6e8] transition duration-200 animate-fade-in-up"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.nameBook}
                        className="w-10 h-14 object-cover rounded shadow"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-200 rounded" />
                    )}
                    <span className="text-sm font-semibold text-[#153D36]">
                      {item.nameBook}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A4E46]">
                    {item.genre}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(item.dateBorrow).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(item.dateReturn).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    Không có lịch sử mượn sách.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
// Tailwind CSS animation utilities
// .animate-fade-in { animation: fadeIn 0.7s; }
// .animate-fade-in-up { animation: fadeInUp 0.7s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
