import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Trinh thám", value: 4 },
  { name: "Kinh dị", value: 5 },
  { name: "Tiểu thuyết", value: 6 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const Report = () => {
  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      {/* Header */}
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white border border-black"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
          <h3 className="text-center font-semibold text-lg mb-4">
            Báo cáo thống kê tình hình mượn sách theo thể loại
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
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
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Table - Thống kê mượn theo thể loại */}
        <div className="bg-white rounded-xl shadow p-4 col-span-1">
          <h3 className="font-semibold text-lg mb-4">
            Báo cáo thống kê tình hình mượn sách theo thể loại
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">STT</th>
                <th>Tên thể loại</th>
                <th>Số lượt mượn</th>
                <th>Tỉ lệ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => {
                const total = data.reduce((sum, d) => sum + d.value, 0);
                const percent = ((item.value / total) * 100).toFixed(2);
                return (
                  <tr key={idx} className="border-b">
                    <td className="py-2">{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.value}</td>
                    <td>{percent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="font-semibold text-lg mb-4">January</h3>
          <div className="grid grid-cols-7 text-center gap-y-2 text-sm">
            {["M", "t", "w", "t", "f", "s", "s"].map((d, i) => (
              <div key={i} className="font-semibold text-gray-700">
                {d}
              </div>
            ))}
            {Array(31)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className={`py-2 ${
                    i + 1 === 2 ? "bg-blue-500 text-white rounded-full" : ""
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
              ))}
          </div>
        </div>

        {/* Table - Sách trả trễ */}
        <div className="bg-white rounded-xl shadow p-4 col-span-2">
          <h3 className="font-semibold text-lg mb-4">
            Báo cáo thống kê sách trả trễ
          </h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">STT</th>
                <th>Tên sách</th>
                <th>Ngày mượn</th>
                <th>Số ngày trễ</th>
                <th>Tên độc giả</th>
                <th>Số tiền phải trả</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Conan",
                  date: "7/1/2025",
                  delay: 4,
                  reader: "Trần Đăng Khoa",
                  cost: "10.000đ",
                },
                {
                  name: "Doraemon",
                  date: "1/1/2025",
                  delay: 5,
                  reader: "Dương Trọng Khang",
                  cost: "10.000đ",
                },
                {
                  name: "Trạng Quỳnh",
                  date: "1/1/2025",
                  delay: 6,
                  reader: "Nguyễn Tiến Khang",
                  cost: "1.000.000đ",
                },
              ].map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.delay}</td>
                  <td>{item.reader}</td>
                  <td>{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Report;
