import React, { useState } from "react";
import BorrowForm from "@/components/admin/book/BorrowForm";
import FineForm from "@/components/admin/book/FineForm";
import ListBorrow from "@/components/admin/book/ListBorrow";

const BorrowBook = () => {
  const [selectedTab, setSelectedTab] = useState<"borrow" | "list" | "fine">(
    "borrow"
  );

  const renderTab = () => {
    switch (selectedTab) {
      case "borrow":
        return <BorrowForm />;
      case "list":
        return <ListBorrow />;
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
          onClick={() => setSelectedTab("list")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "list"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          DANH SÁCH MƯỢN
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
