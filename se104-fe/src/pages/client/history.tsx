import React, { useEffect, useState } from "react";
import { getLoanSlipHistoryAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
import { message } from "antd";

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
        const res = await getLoanSlipHistoryAPI(idUser);
        console.log(res);
        if (Array.isArray(res)) {
          setHistory(res);
        } else {
          message.error("Dữ liệu không hợp lệ.");
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
    <div className="min-h-screen bg-[#d3edd8] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#153D36]">
        Lịch sử mượn sách
      </h2>

      {loading ? (
        <p className="text-center text-[#153D36]">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full bg-white">
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
                  className="border-b hover:bg-[#e3f6e8] transition duration-200"
                >
                  <td className="px-4 py-3 flex items-center gap-2">
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.nameBook}
                        className="w-10 h-14 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-14 bg-gray-200 rounded" />
                    )}
                    <span className="text-sm">{item.nameBook}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{item.genre}</td>
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
