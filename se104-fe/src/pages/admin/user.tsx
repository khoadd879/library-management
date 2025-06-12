import React, { useState } from "react";
import BookList from "@/pages/admin/bookList";
import ReaderList from "@/components/admin/listPage/ReaderList";
import AuthorList from "@/components/admin/listPage/AuthorList";

const UserPage = () => {
  const [tab, setTab] = useState<"author" | "reader" | "book">("reader");

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      {/* Header */}
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-6">
        {/* Tabs */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {["author", "reader", "book"].map((type) => (
              <button
                key={type}
                onClick={() => setTab(type as typeof tab)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  tab === type
                    ? "bg-[#153D36] text-white"
                    : "bg-[#e5e7eb] text-[#153D36]"
                }`}
              >
                {type === "author"
                  ? "Tác giả"
                  : type === "reader"
                  ? "Độc giả"
                  : "Sách"}
              </button>
            ))}
          </div>
          <div className="text-sm text-right text-gray-700">
            <p>
              Total {tab === "book" ? "books" : "members"}:{" "}
              <span className="font-semibold">
                {tab === "book" ? "500" : tab === "reader" ? "2000" : "100"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#153D36]">
            {tab === "reader"
              ? "Độc giả"
              : tab === "author"
              ? "Tác giả"
              : "Danh sách sách"}
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

        {/* Render content by tab */}
        {tab === "book" ? (
          <BookList />
        ) : tab === "reader" ? (
          <ReaderList />
        ) : (
          <AuthorList />
        )}
      </div>
    </div>
  );
};

export default UserPage;
