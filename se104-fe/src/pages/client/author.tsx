import React from "react";

const AuthorPage = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f9] w-full px-4 md:px-12 py-6">
      <div className="flex justify-between items-center bg-[#153D36] px-6 py-4 rounded-t-lg text-white">
        <h2 className="text-lg font-semibold">Tác giả</h2>
        <button className="bg-white text-[#153D36] px-4 py-1 rounded text-sm">
          &larr; Filter
        </button>
      </div>

      <div className="bg-white shadow-md rounded-b-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-[#153D36] font-semibold">
            <tr>
              <th className="px-4 py-3">Photo</th>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">Số lượng sách</th>
              <th className="px-4 py-3">Thể loại</th>
              <th className="px-4 py-3">Mô tả</th>
              <th className="px-4 py-3">Tuỳ chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr
                key={i}
                className="border-t hover:bg-gray-50 transition duration-150"
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full relative">
                      <div
                        className={`w-2 h-2 rounded-full absolute bottom-0 right-0 border border-white ${
                          i % 3 === 0
                            ? "bg-red-500"
                            : i % 2 === 0
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2">Trần Đăng Khoa</td>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">Tiểu thuyết</td>
                <td className="px-4 py-2">Mô tả</td>
                <td className="px-4 py-2 flex items-center gap-3">
                  <span className="text-red-500 text-lg cursor-pointer">
                    ❤️
                  </span>
                  <span className="text-black text-lg cursor-pointer">❗</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorPage;
