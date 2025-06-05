import React from "react";

const BookList = () => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-[#153D36] font-medium">
          <tr>
            <th className="px-4 py-3">Ảnh sách</th>
            <th className="px-4 py-3">Tên sách</th>
            <th className="px-4 py-3">Tác giả</th>
            <th className="px-4 py-3">Thể loại</th>
            <th className="px-4 py-3">Năm tái bản</th>
            <th className="px-4 py-3">Nhà xuất bản</th>
            <th className="px-4 py-3">Trị giá</th>
            <th className="px-4 py-3 text-center">Tuỳ chỉnh</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                <div className="w-10 h-14 bg-gray-200 rounded"></div>
              </td>
              <td className="px-4 py-2 font-medium">Sách {i + 1}</td>
              <td className="px-4 py-2">Tác giả {i + 1}</td>
              <td className="px-4 py-2">
                {i % 3 === 0
                  ? "Tiểu thuyết"
                  : i % 2 === 0
                  ? "Khoa học"
                  : "Lịch sử"}
              </td>
              <td className="px-4 py-2">202{i % 4}</td>
              <td className="px-4 py-2">NXB {i + 1}</td>
              <td className="px-4 py-2">{i + 50}.000đ</td>
              <td className="px-4 py-2 text-center">
                <button className="mr-2 text-black">✏️</button>
                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
