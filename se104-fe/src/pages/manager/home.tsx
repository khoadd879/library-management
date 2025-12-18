import { useEffect, useState } from "react";
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
import { FaBook, FaUsers, FaExclamationCircle, FaMoneyBill } from "react-icons/fa";

const COLORS = ["#153D36", "#27AE60", "#3498DB", "#E67E22", "#9B59B6", "#1ABC9C"];

const HomePage = () => {
  const [genreData, setGenreData] = useState<
    { typeBook: string; count: number }[]
  >([]);
  const [lateBooks, setLateBooks] = useState<any[]>([]);
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [totalReaders, setTotalReaders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [genreRes, loanRes, readerRes] = await Promise.all([
          getAmountByTypeBookAPI(month),
          getAllLoanSlipsAPI(),
          getAllReadersAPI(),
        ]);

        const genreList = genreRes.data || (Array.isArray(genreRes) ? genreRes : []);
        setGenreData(genreList);

        const today = new Date();
        const loansList = loanRes.data || [];
        const readersList = readerRes.data || [];
        setTotalReaders(readersList.length);

        const filteredLateBooks = loansList
          .filter((loan: any) => new Date(loan.returnDate) < today)
          .map((loan: any) => {
            const reader = readersList.find(
              (r: any) => r.idReader === loan.idReader
            );
            return {
              name: loan.nameBook,
              borrowDate: new Date(loan.borrowDate).toLocaleDateString("vi-VN"),
              returnDate: new Date(loan.returnDate).toLocaleDateString("vi-VN"),
              reader: reader?.nameReader || "Không rõ",
              cost:
                loan.fineAmount > 0
                  ? loan.fineAmount.toLocaleString("vi-VN") + "đ"
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
  const totalFine = lateBooks.reduce((sum, book) => {
    const amount = parseInt(book.cost.replace(/[^\d]/g, '')) || 0;
    return sum + amount;
  }, 0);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-[#153D36] px-6 py-5">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-xl font-semibold text-white">Tổng quan hệ thống</h1>
          <p className="text-emerald-200/70 text-sm mt-1">Thống kê hoạt động thư viện</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FaBook className="text-emerald-600" />
              </div>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Tháng {month}</span>
            </div>
            <p className="text-gray-500 text-sm">Lượt mượn</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-blue-600" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">Tổng độc giả</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{totalReaders}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaExclamationCircle className="text-orange-500" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">Sách trả trễ</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{lateBooks.length}</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FaMoneyBill className="text-red-500" />
              </div>
            </div>
            <p className="text-gray-500 text-sm">Tiền phạt</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{totalFine.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>

        {/* Month Filter */}
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-medium">Chọn tháng thống kê:</span>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#153D36]/20 focus:border-[#153D36]"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-[#153D36]">
              <h3 className="font-medium text-white">Mượn sách theo thể loại</h3>
            </div>
            <div className="p-5">
              {genreData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={genreData.map((d) => ({
                        name: d.typeBook.trim(),
                        value: d.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={40}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
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
              ) : (
                <div className="h-[280px] flex items-center justify-center text-gray-400">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>

          {/* Stats Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-[#153D36]">
              <h3 className="font-medium text-white">Chi tiết thể loại</h3>
            </div>
            <div className="p-5">
              {genreData.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2.5 text-gray-500 font-medium">STT</th>
                      <th className="text-left py-2.5 text-gray-500 font-medium">Thể loại</th>
                      <th className="text-center py-2.5 text-gray-500 font-medium">Lượt mượn</th>
                      <th className="text-right py-2.5 text-gray-500 font-medium">Tỉ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genreData.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 text-gray-500">{idx + 1}</td>
                        <td className="py-3 text-gray-800 font-medium">{item.typeBook}</td>
                        <td className="py-3 text-center text-gray-800">{item.count}</td>
                        <td className="py-3 text-right">
                          <span className="text-[#153D36] font-medium bg-emerald-50 px-2 py-0.5 rounded">
                            {((item.count / total) * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-400">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Late Books Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-orange-500 flex items-center justify-between">
            <h3 className="font-medium text-white">Sách trả trễ</h3>
            <span className="text-sm bg-white/20 text-white px-3 py-1 rounded-full">{lateBooks.length} sách</span>
          </div>
          <div className="p-5">
            {lateBooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2.5 text-gray-500 font-medium">STT</th>
                      <th className="text-left py-2.5 text-gray-500 font-medium">Tên sách</th>
                      <th className="text-left py-2.5 text-gray-500 font-medium">Ngày mượn</th>
                      <th className="text-left py-2.5 text-gray-500 font-medium">Hạn trả</th>
                      <th className="text-left py-2.5 text-gray-500 font-medium">Độc giả</th>
                      <th className="text-right py-2.5 text-gray-500 font-medium">Tiền phạt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lateBooks.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-orange-50/50">
                        <td className="py-3 text-gray-500">{idx + 1}</td>
                        <td className="py-3 text-gray-800 font-medium">{item.name}</td>
                        <td className="py-3 text-gray-600">{item.borrowDate}</td>
                        <td className="py-3 text-red-500 font-medium">{item.returnDate}</td>
                        <td className="py-3 text-gray-700">{item.reader}</td>
                        <td className="py-3 text-right">
                          <span className="text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">
                            {item.cost}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <p className="text-emerald-600 font-medium">✓ Tất cả sách đã được trả đúng hạn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
