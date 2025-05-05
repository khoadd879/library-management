import React, { useState } from "react";

const BorrowForm = () => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-[#153D36] text-center mb-4">
        Phiếu mượn sách
      </h2>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tên độc giả
        </label>
        <input
          type="text"
          placeholder="Nhập họ tên độc giả..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tên sách
        </label>
        <input
          type="text"
          placeholder="Nhập tên sách..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Mã sách
        </label>
        <input
          type="text"
          placeholder="Nhập mã sách..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tác giả
        </label>
        <input
          type="text"
          placeholder="Nhập tên tác giả..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Ngày mượn
        </label>
        <input
          type="date"
          value={today}
          readOnly
          className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100 cursor-not-allowed"
        />
      </div>
      <button className="bg-[#17966F] text-white px-6 py-2 rounded text-sm font-semibold mt-4 mx-auto block">
        Xuất phiếu
      </button>
    </form>
  );
};

const ReturnForm = () => (
  <form className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4">
    <h2 className="text-2xl font-bold text-[#153D36] text-center mb-4">
      Phiếu trả sách
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tên người mượn
        </label>
        <input
          type="text"
          placeholder="Nhập họ tên..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tên sách
        </label>
        <input
          type="text"
          placeholder="Nhập tên sách..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Ngày trả
        </label>
        <input
          type="date"
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tiền phạt
        </label>
        <input
          type="number"
          placeholder="Tiền phạt..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-[#153D36]">
        Tổng nợ
      </label>
      <input
        type="number"
        placeholder="Tổng nợ..."
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
    </div>
    <button className="bg-[#17966F] text-white px-6 py-2 rounded text-sm font-semibold mt-4 mx-auto block">
      Xuất phiếu
    </button>
  </form>
);

const FineForm = () => (
  <form className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4">
    <h2 className="text-2xl font-bold text-[#153D36] text-center mb-4">
      Phiếu thu tiền phạt
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tên độc giả
        </label>
        <input
          type="text"
          placeholder="Nhập họ tên..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Tổng nợ
        </label>
        <input
          type="number"
          placeholder="Tổng nợ..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#153D36]">
          Số tiền thu
        </label>
        <input
          type="number"
          placeholder="Số tiền thu..."
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-[#153D36]">
        Số tiền nợ còn lại
      </label>
      <input
        type="number"
        placeholder="Còn lại..."
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
    </div>
    <button className="bg-[#17966F] text-white px-6 py-2 rounded text-sm font-semibold mt-4 mx-auto block">
      Xuất phiếu
    </button>
  </form>
);

const BorrowBook = () => {
  const [selectedTab, setSelectedTab] = useState("borrow");

  const renderTab = () => {
    switch (selectedTab) {
      case "borrow":
        return <BorrowForm />;
      case "return":
        return <ReturnForm />;
      case "fine":
        return <FineForm />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-6 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full text-sm bg-white text-black border"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="flex gap-2 px-6 mt-6">
        <button
          onClick={() => setSelectedTab("borrow")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "borrow"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          MƯỢN SÁCH
        </button>
        <button
          onClick={() => setSelectedTab("return")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "return"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          TRẢ SÁCH
        </button>
        <button
          onClick={() => setSelectedTab("fine")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "fine"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          THU TIỀN PHẠT
        </button>
      </div>

      <div className="px-6 py-6">{renderTab()}</div>
    </div>
  );
};

export default BorrowBook;
