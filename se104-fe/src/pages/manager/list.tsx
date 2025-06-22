import React, { useState } from "react";
import BookList from "@/components/admin/listPage/BookList";
import ReaderList from "@/components/admin/listPage/ReaderList";
import AuthorList from "@/components/admin/listPage/AuthorList";
import TypeReaderList from "@/components/admin/listPage/TypeReaderList";
import TypeBookList from "@/components/admin/listPage/TypeBookList";

const List = () => {
  const [tab, setTab] = useState<
    "author" | "reader" | "book" | "typeBook" | "typeReader"
  >("reader");

  const [searchKeyword, setSearchKeyword] = useState("");

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            {["author", "reader", "book", "typeBook", "typeReader"].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setTab(type as typeof tab)}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    tab === type
                      ? "bg-[#153D36] text-white"
                      : "bg-[#e5e7eb] text-[#153D36]"
                  }`}
                >
                  {
                    {
                      author: "Tác giả",
                      reader: "Độc giả",
                      book: "Sách",
                      typeBook: "Loại sách",
                      typeReader: "Loại độc giả",
                    }[type]
                  }
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#153D36]">
            {
              {
                reader: "Độc giả",
                author: "Tác giả",
                book: "Danh sách sách",
                typeBook: "Loại sách",
                typeReader: "Loại độc giả",
              }[tab]
            }
          </h2>
        </div>

        {tab === "book" ? (
          <BookList keyword={searchKeyword} />
        ) : tab === "reader" ? (
          <ReaderList keyword={searchKeyword} />
        ) : tab === "author" ? (
          <AuthorList keyword={searchKeyword} />
        ) : tab === "typeBook" ? (
          <TypeBookList keyword={searchKeyword} />
        ) : (
          <TypeReaderList keyword={searchKeyword} />
        )}
      </div>
    </div>
  );
};

export default List;
