import React, { useEffect, useState } from "react";
import { getAllBooksAndCommentsAPI } from "@/services/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const FeaturedBooks = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const goToBookDetail = (idBook: string) => {
    navigate(`/detail/${idBook}`);
  };
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Vui lòng đăng nhập.");
          return;
        }

        const res = await getAllBooksAndCommentsAPI();
        if (Array.isArray(res)) {
          setBooks(res);
        } else {
          message.error("Dữ liệu sách không hợp lệ.");
        }
      } catch (err) {
        console.error("Lỗi khi tải sách:", err);
        message.error("Không thể tải danh sách sách.");
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) =>
    b.nameBook.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] px-4 md:px-12 py-6 w-full">
      <div className="bg-[#153D36] px-6 py-4 rounded-t-lg flex justify-between items-center text-white">
        <h2 className="text-xl font-semibold">Sách nổi bật</h2>
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px] px-4 py-1.5 rounded-full text-black outline-none text-sm bg-white"
        />
      </div>

      <div className="bg-white shadow-md rounded-b-lg p-6">
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.idBook}
                className="rounded-lg shadow-sm bg-white p-2 hover:shadow-md transition"
                onClick={() => goToBookDetail(book.idBook)}
              >
                <div className="w-full h-48 bg-gray-200 rounded overflow-hidden mb-2">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.nameBook}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <p className="text-sm font-semibold truncate">
                  {book.nameBook}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Không tìm thấy sách phù hợp.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeaturedBooks;
