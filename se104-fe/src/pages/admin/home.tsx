import { useEffect, useState } from "react";
import { getAllBooksAndCommentsAPI, getListAuthor } from "@/services/api";
import { message } from "antd";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
  const [authors, setAuthors] = useState<IAddAuthor[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Lỗi không có token");
          return;
        }

        const [bookRes, authorRes] = await Promise.all([
          getAllBooksAndCommentsAPI(),
          getListAuthor(),
        ]);

        if (Array.isArray(bookRes)) {
          setFeaturedBooks(bookRes.slice(0, 5));
        } else {
          message.error("Lỗi dữ liệu sách.");
        }

        if (Array.isArray(authorRes)) {
          setAuthors(authorRes.slice(0, 4));
        } else {
          message.error("Lỗi dữ liệu tác giả.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Lỗi khi tải dữ liệu.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#f4f7f9] min-h-screen">
      <div className="bg-[#153D36] px-6 md:px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full max-w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white border border-black"
        />
        <div className="text-xl text-white ml-4">🔔</div>
      </div>

      <div className="container max-w-screen-xl mx-auto px-4 md:px-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 md:p-8 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Nổi bật
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {featuredBooks.map((book) => (
                  <div
                    key={book.idBook}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2"
                  >
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.nameBook}
                        className="h-40 w-full object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="h-40 bg-gray-200 rounded mb-2" />
                    )}
                    <p className="text-sm font-semibold text-[#154734]">
                      {book.nameBook}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {book.describe}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Lịch sử mượn sách
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-2" />
                    <p className="text-sm font-semibold text-[#154734]">
                      Sách mẫu
                    </p>
                    <p className="text-xs text-gray-500">Tác giả mẫu</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Tác giả
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {authors.map((author) => (
                  <div
                    key={author.idAuthor}
                    className="flex flex-col items-center text-center border rounded p-2"
                  >
                    {author.urlAvatar ? (
                      <img
                        src={author.urlAvatar}
                        alt={author.nameAuthor}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    )}
                    <p className="text-sm font-semibold text-[#154734]">
                      {author.nameAuthor}
                    </p>
                    <p className="text-xs text-gray-500">
                      {author.idTypeBook?.nameTypeBook}
                    </p>
                    <a href="#" className="text-blue-500 text-xs mt-1">
                      Thông tin chi tiết
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Sách mới
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[110px] bg-white rounded-lg shadow p-2.5"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-2" />
                    <p className="text-sm font-semibold text-[#154734]">
                      Educated
                    </p>
                    <p className="text-xs text-gray-500">Tara Westover</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
