import React, { useState } from "react";

const UserPage = () => {
  const [tab, setTab] = useState<"author" | "reader">("reader");

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setTab("author")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === "author"
                  ? "bg-[#153D36] text-white"
                  : "bg-[#e5e7eb] text-[#153D36]"
              }`}
            >
              Tác giả
            </button>
            <button
              onClick={() => setTab("reader")}
              className={`px-4 py-2 rounded text-sm font-medium ${
                tab === "reader"
                  ? "bg-[#153D36] text-white"
                  : "bg-[#e5e7eb] text-[#153D36]"
              }`}
            >
              Độc giả
            </button>
          </div>
          <div className="text-sm text-right text-gray-700">
            <p>
              Total members: <span className="font-semibold">2000</span>
            </p>
            <p>
              Current used:{" "}
              <span className="font-semibold text-red-600">1800</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#153D36]">
            {tab === "reader" ? "Độc giả" : "Tác giả"}
          </h2>
          <div className="flex gap-2">
            <button className="bg-[#153D36] text-white px-4 py-2 rounded text-sm">
              Add new
            </button>
            <button className="border border-gray-300 px-4 py-2 rounded text-sm bg-white">
              &larr; Filter
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-[#153D36] font-medium">
              <tr>
                <th className="px-4 py-3">Photo</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Địa chỉ</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Ngày sinh</th>
                <th className="px-4 py-3">Ngày lập thẻ</th>
                <th className="px-4 py-3 text-center">Tuỳ chỉnh</th>
              </tr>
            </thead>
            <tbody>
              {(tab === "reader" ? [...Array(7)] : [...Array(3)]).map(
                (_, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          tab === "reader" ? "bg-red-400" : "bg-blue-400"
                        }`}
                      />
                    </td>
                    <td className="px-4 py-2 font-medium text-[#153D36]">
                      {tab === "reader" ? "Trần Dũng Khoa" : `Tác giả ${i + 1}`}
                    </td>
                    <td className="px-4 py-2 text-gray-700">Quận 1</td>
                    <td className="px-4 py-2 text-gray-700">
                      {tab === "reader"
                        ? "1111@gmail.com"
                        : `author${i + 1}@mail.com`}
                    </td>
                    <td className="px-4 py-2 text-gray-700">1/1/2001</td>
                    <td className="px-4 py-2 text-gray-700">1/1/2001</td>
                    <td className="px-4 py-2 text-center">
                      <button className="mr-2 text-black">✏️</button>
                      <button className="text-red-500">🗑️</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
