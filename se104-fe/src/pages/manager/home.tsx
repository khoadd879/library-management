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

const lateBooks = [
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
];

const HomePage = () => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center mb-24 " />

      <div className="flex flex-wrap justify-center gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full max-w-md mr-12">
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

        {/* Table - Mượn theo thể loại */}
        <div className="bg-white rounded-xl shadow p-4 w-full max-w-md">
          <h3 className="text-center font-semibold text-lg mb-4">
            Thống kê mượn sách theo thể loại
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
              {data.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2">{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                  <td>{((item.value / total) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table - Sách trả trễ */}
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
                <th>Số ngày trễ</th>
                <th>Tên độc giả</th>
                <th>Số tiền phải trả</th>
              </tr>
            </thead>
            <tbody>
              {lateBooks.map((item, idx) => (
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

export default HomePage;
