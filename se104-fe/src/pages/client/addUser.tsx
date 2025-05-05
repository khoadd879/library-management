import React, { useEffect, useState } from "react";

const AddUser = () => {
  const [activeTab, setActiveTab] = useState<"docgia" | "tacgia">("docgia");
  const [ngayLapThe, setNgayLapThe] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setNgayLapThe(today);
  }, []);

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

      <div className="px-12 py-8">
        <h2 className="text-xl font-bold text-[#153D36] text-center mb-6">
          {activeTab === "docgia" ? "THÔNG TIN ĐỘC GIẢ" : "THÔNG TIN TÁC GIẢ"}
        </h2>

        <div className="flex justify-start mb-6">
          <button
            className={`px-4 py-2 rounded text-sm font-medium ${
              activeTab === "tacgia"
                ? "bg-[#153D36] text-white"
                : "bg-[#e5e7eb] text-[#153D36]"
            }`}
            onClick={() => setActiveTab("tacgia")}
          >
            Tác giả
          </button>
          <button
            className={`ml-2 px-4 py-2 rounded text-sm font-medium ${
              activeTab === "docgia"
                ? "bg-[#153D36] text-white"
                : "bg-[#e5e7eb] text-[#153D36]"
            }`}
            onClick={() => setActiveTab("docgia")}
          >
            Độc giả
          </button>
        </div>

        {activeTab === "docgia" ? (
          <form className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1 text-[#153D36]">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ tên của độc giả..."
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#153D36] font-semibold">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#153D36] font-semibold">
                Ngày sinh
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#153D36] font-semibold">
                Giới tính
              </label>
              <select className="w-full px-4 py-2 border rounded outline-none text-sm">
                <option value="">-- Chọn giới tính --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#153D36] font-semibold">
                Địa chỉ
              </label>
              <input
                type="text"
                placeholder="Nhập địa chỉ..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#153D36] font-semibold">
                Số điện thoại
              </label>
              <input
                type="text"
                placeholder="Nhập địa chỉ..."
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-[#153D36] font-semibold">
                Ngày lập thẻ
              </label>
              <input
                type="date"
                value={ngayLapThe}
                readOnly
                className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100 text-gray-700"
              />
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="bg-[#153D36] text-white px-6 py-2 rounded text-sm font-semibold"
              >
                Thêm độc giả
              </button>
            </div>
          </form>
        ) : (
          <form className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <label className="block text-sm mb-1 text-[#153D36]">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ tên của tác giả..."
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#153D36]">
                Ngày sinh
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-[#153D36]">
                Thể loại
              </label>
              <select className="w-full px-4 py-2 border rounded outline-none text-sm">
                <option value="">-- Chọn thể loại --</option>
                <option value="tiểu thuyết">Tiểu thuyết</option>
                <option value="trinh thám">Trinh thám</option>
                <option value="sách giáo dục">Sách giáo dục</option>
              </select>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="bg-[#153D36] text-white px-6 py-2 rounded text-sm font-semibold"
              >
                Thêm tác giả
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddUser;
