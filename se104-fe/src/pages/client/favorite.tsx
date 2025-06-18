import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavoriteBooksAPI, addFavoriteBookAPI } from "@/services/api";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { message, Spin } from "antd";

const Favorite = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        setLoading(true);
        const res = await getFavoriteBooksAPI();
        if (Array.isArray(res)) {
          setBooks(res);
        } else {
          message.error("Không lấy được danh sách sách yêu thích.");
        }
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi lấy dữ liệu sách yêu thích.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavoriteBooks();
  }, []);

  const toggleLike = async (bookId: string) => {
    try {
      setLoading(true);
      const res = await addFavoriteBookAPI(bookId);
      if (res) {
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.idBook !== bookId)
        );
      } else {
        message.error("Không thể cập nhật trạng thái yêu thích.");
      }
    } catch (err) {
      message.error("Lỗi khi yêu thích sách.");
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter((b) =>
    b.nameBook.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f4f7f9] min-h-screen relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex justify-center items-center animate-fade-in">
          <Spin size="large" className="scale-150" />
        </div>
      )}
      <div className="min-h-screen bg-white px-4 md:px-12 py-6">
        <div className="bg-[#153D36] px-6 py-4 rounded-t-lg flex justify-between items-center text-white mb-6">
          <h2 className="text-xl font-semibold">
            Yêu thích <span className="text-xl">❤️</span>
          </h2>
          <input
            type="text"
            placeholder="Tìm kiếm sách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[300px] px-4 py-1.5 rounded-full text-black outline-none text-sm bg-white"
          />
        </div>
        {filteredBooks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            Bạn chưa có sách nào trong danh sách yêu thích.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
            {filteredBooks.map((book) => (
              <div
                key={book.idBook}
                className="relative rounded-xl shadow-md bg-white p-3 hover:shadow-xl transition cursor-pointer group animate-fade-in-up"
                onClick={() => navigate(`/detail/${book.idBook}`)}
              >
                {/* Trái tim */}
                <div
                  className="absolute top-2 right-4 text-xl text-red-500 z-10 p-1 bg-white/80 rounded-full hover:bg-white transition-all duration-200 shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(book.idBook);
                  }}
                >
                  {book.isLiked ? <HeartFilled /> : <HeartOutlined />}
                </div>
                {/* Hình ảnh */}
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
                {/* Tên sách và tác giả */}
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
        )}
      </div>
    </div>
  );
};

export default Favorite;
