import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getAmountByTypeBookAPI,
  getAllLoanSlipsAPI,
  getAllReadersAPI,
} from "@/services/api";
import { message } from "antd";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00bfff"];

const HomePage = () => {
  const [genreData, setGenreData] = useState<
    { typeBook: string; count: number }[]
  >([]);
  const [lateBooks, setLateBooks] = useState<any[]>([]);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreRes, loanRes, readerRes] = await Promise.all([
          getAmountByTypeBookAPI(month),
          getAllLoanSlipsAPI(),
          getAllReadersAPI(),
        ]);

        setGenreData(Array.isArray(genreRes) ? genreRes : []);

        const today = new Date();
        const filteredLateBooks = loanRes
          .filter((loan: any) => new Date(loan.returnDate) < today)
          .map((loan: any) => {
            const reader = readerRes.find(
              (r: any) => r.idReader === loan.idReader
            );
            return {
              name: loan.nameBook,
              borrowDate: new Date(loan.borrowDate).toLocaleDateString("vi-VN"),
              returnDate: new Date(loan.returnDate).toLocaleDateString("vi-VN"),
              reader: reader?.nameReader || "Không rõ",
              cost:
                loan.fineAmount > 0
                  ? loan.fineAmount.toLocaleString("vi-VN") + "000đ"
                  : "0đ",
            };
          });

        setLateBooks(filteredLateBooks);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        message.error("Không thể tải dữ liệu báo cáo!");
      }
    };

    fetchData();
  }, [month]);

  const total = genreData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center mb-10" />

      <div className="px-12 pb-6">
        <label className="block font-semibold mb-2 text-sm">
          Chọn tháng cần thống kê
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="border px-4 py-2 rounded text-sm"
        >
          <option value={1}>Tháng 1</option>
          <option value={2}>Tháng 2</option>
          <option value={3}>Tháng 3</option>
          <option value={4}>Tháng 4</option>
          <option value={5}>Tháng 5</option>
          <option value={6}>Tháng 6</option>
          <option value={7}>Tháng 7</option>
          <option value={8}>Tháng 8</option>
          <option value={9}>Tháng 9</option>
          <option value={10}>Tháng 10</option>
          <option value={11}>Tháng 11</option>
          <option value={12}>Tháng 12</option>
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full max-w-md mr-12">
          <h3 className="text-center font-semibold text-lg mb-4">
            Báo cáo mượn sách theo thể loại (tháng {month})
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreData.map((d) => ({
                  name: d.typeBook.trim(),
                  value: d.count,
                }))}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(2)}%`
                }
              >
                {genreData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bảng thống kê thể loại */}
        <div className="bg-white rounded-xl shadow p-4 w-full max-w-md">
          <h3 className="text-center font-semibold text-lg mb-4">
            Thống kê mượn sách theo thể loại
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">STT</th>
                <th>Thể loại</th>
                <th>Lượt mượn</th>
                <th>Tỉ lệ</th>
              </tr>
            </thead>
            <tbody>
              {genreData.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{idx + 1}</td>
                  <td>{item.typeBook}</td>
                  <td>{item.count}</td>
                  <td>{((item.count / total) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow p-4 w-full col-span-full max-w-6xl">
          <h3 className="text-center font-semibold text-lg mb-4">
            Báo cáo thống kê sách trả trễ
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">STT</th>
                <th>Tên sách</th>
                <th>Ngày mượn</th>
                <th>Ngày phải trả</th>
                <th>Tên độc giả</th>
                <th>Số tiền phải trả</th>
              </tr>
            </thead>
            <tbody>
              {lateBooks.length > 0 ? (
                lateBooks.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.borrowDate}</td>
                    <td>{item.returnDate}</td>
                    <td>{item.reader}</td>
                    <td>{item.cost}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Không có sách trả trễ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
