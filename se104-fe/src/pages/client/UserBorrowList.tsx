import React, { useState } from "react";
import UserBorrows from "@/components/client/UserBorrows";
import UserReturns from "@/components/client/UserReturns";
import UserFines from "@/components/client/UserFines";

const UserBorrowList = () => {
  const [selectedTab, setSelectedTab] = useState<"borrows" | "returns" | "fines">(
    "borrows"
  );

  const renderTab = () => {
    switch (selectedTab) {
      case "borrows":
        return <UserBorrows />;
      case "returns":
        return <UserReturns />;
      case "fines":
        return <UserFines />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-6 py-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">QUẢN LÝ THƯ VIỆN</h1>
      </div>

      <div className="flex gap-2 px-6 mt-6">
        <button
          onClick={() => setSelectedTab("borrows")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "borrows"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          DANH SÁCH PHIẾU MƯỢN
        </button>

        <button
          onClick={() => setSelectedTab("returns")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "returns"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          DANH SÁCH PHIẾU TRẢ
        </button>

        <button
          onClick={() => setSelectedTab("fines")}
          className={`px-4 py-2 rounded font-medium text-sm ${
            selectedTab === "fines"
              ? "bg-[#153D36] text-white"
              : "bg-gray-200 text-[#153D36]"
          }`}
        >
          DANH SÁCH PHẠT
        </button>
      </div>

      <div className="px-6 py-6">{renderTab()}</div>
    </div>
  );
};

export default UserBorrowList;