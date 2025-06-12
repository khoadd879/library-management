import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFavoriteBooksAPI,
  addFavoriteBookAPI,
} from "@/services/api";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { message, Spin } from "antd";

const Favorite = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

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
      const res = await addFavoriteBookAPI(bookId);
      if (res) {
        setLoading(true);
        setBooks((prevBooks) =>
          prevBooks.filter((book) => book.idBook !== bookId)
        );
      } else {
        message.error("Không thể cập nhật trạng thái yêu thích.");
      }
    } catch (err) {
      message.error("Lỗi khi yêu thích sách.");
    }finally {
        setLoading(false);
      }
  };

  return (
    <div className="bg-[#f4f7f9] min-h-screen relative">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex justify-center items-center">
          <Spin size="large" />
        </div>
      )}

      {!loading && (
        <div className="min-h-screen bg-white px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600">
              Yêu thích <span className="text-xl">❤️</span>
            </h2>
          </div>

          {books.length === 0 ? (
            <p className="text-gray-500">Bạn chưa có sách nào trong danh sách yêu thích.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {books.map((book) => (
                <div
                  key={book.idBook}
                  className="relative bg-white rounded shadow hover:shadow-lg transition p-2 cursor-pointer"
                  onClick={() => navigate(`/detail/${book.idBook}`)}
                >
                  {/* Trái tim */}
                  <div
                    className="absolute top-2 right-4 text-xl text-red-500 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(book.idBook);
                    }}
                  >
                    {book.isLiked ? <HeartFilled /> : <HeartOutlined />}
                  </div>

                  {/* Hình ảnh */}
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.nameBook}
                      className="w-full h-[200px] object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full h-[200px] bg-gray-300 rounded mb-2" />
                  )}

                  {/* Tên sách và tác giả */}
                  <p className="text-sm font-semibold text-[#154734]">
                    {book.nameBook}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Favorite;
