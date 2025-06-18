import React, { useEffect, useState } from "react";
import { getAllBooksAndCommentsAPI } from "@/services/api";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const FeaturedBooks = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToBookDetail = (idBook: string) => {
    navigate(`/detail/${idBook}`);
  };
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Vui lòng đăng nhập.");
          setLoading(false);
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
      } finally {
        setLoading(false);
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
      <div className="bg-white shadow-md rounded-b-lg p-6 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Spin size="large" />
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
            {filteredBooks.map((book) => (
              <div
                key={book.idBook}
                className="rounded-xl shadow-md bg-white p-3 hover:shadow-xl transition cursor-pointer group animate-fade-in-up"
                onClick={() => goToBookDetail(book.idBook)}
              >
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.nameBook}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold truncate text-[#153D36]">
                  {book.nameBook}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
                </p>
                <span className="text-xs text-gray-400 block">
                  Năm xuất bản: {book.reprintYear}
                </span>
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
