import React, { useState, useEffect } from "react";

const ReceiveBook = () => {
  const [today, setToday] = useState("");

  useEffect(() => {
    const current = new Date();
    const formatted = current.toISOString().slice(0, 10);
    setToday(formatted);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white border border-black"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-8">
        <h2 className="text-2xl font-bold text-[#153D36] text-center mb-6">
          THÔNG TIN SÁCH
        </h2>

        <div className="flex justify-center gap-10">
          <div className="w-1/4 flex items-start justify-center">
            <img
              src="https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain"
              alt="Book"
              className="rounded-lg shadow-lg w-48"
            />
          </div>

          <form className="w-1/2 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Tên sách
              </label>
              <input
                type="text"
                placeholder="Nhập họ tên của độc giả..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Tác giả
              </label>
              <input
                type="text"
                placeholder="Nhập tên tác giả..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#153D36]">
                  Năm xuất bản
                </label>
                <input
                  type="number"
                  placeholder="Nhập năm xuất bản..."
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-[#153D36]">
                  Thể loại
                </label>
                <select className="w-full px-4 py-2 border rounded outline-none text-sm">
                  <option>Value</option>
                  <option>Loại A</option>
                  <option>Loại B</option>
                  <option>Loại C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Nhập trị giá
              </label>
              <input
                type="number"
                placeholder="Nhập trị giá..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Nhập ngày nhận
              </label>
              <input
                type="date"
                value={today}
                readOnly
                className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Nhập mô tả
              </label>
              <textarea
                rows={4}
                placeholder="Nhập mô tả của quyển sách..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-[#27AE60] text-white px-6 py-2 rounded text-sm font-semibold"
              >
                Thêm sách
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceiveBook;
