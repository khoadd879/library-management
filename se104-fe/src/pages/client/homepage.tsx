import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllBooksAndCommentsAPI,
  getLoanSlipHistoryAPI,
  listAuthorAPI,
} from "@/services/api";
import { message } from "antd";

const UserHomepage = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
  const [authors, setAuthors] = useState<IAddAuthor[]>([]);
  const [latestBooks, setLatestBooks] = useState<IBook[]>([]);
  const [loanHistory, setLoanHistory] = useState<ILoanHistory[]>([]);

  useEffect(() => {
    const fetchBooksAndAuthors = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.warning("Lỗi: Không tìm thấy token.");
          return;
        }
        const idUser = localStorage.getItem("idUser");
        if (!idUser) {
          message.error("Không tìm thấy người dùng.");
          return;
        }

        const historyRes = await getLoanSlipHistoryAPI(idUser);
        if (Array.isArray(historyRes)) {
          setLoanHistory(historyRes.slice(0, 5));
        } else {
          message.error("Dữ liệu lịch sử không hợp lệ.");
        }
        const [booksResponse, authorRes] = await Promise.all([
          getAllBooksAndCommentsAPI(),
          listAuthorAPI(token),
        ]);

        if (Array.isArray(booksResponse)) {
          setFeaturedBooks(booksResponse.slice(0, 5));

          const sorted = [...booksResponse].sort(
            (a, b) => Number(b.reprintYear) - Number(a.reprintYear)
          );
          setLatestBooks(sorted.slice(0, 3));
        } else {
          message.error("Dữ liệu sách không đúng định dạng.");
        }

        if (Array.isArray(authorRes)) {
          setAuthors(authorRes.slice(0, 4));
        } else {
          message.error("Dữ liệu tác giả không đúng định dạng.");
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        message.error("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    };

    fetchBooksAndAuthors();
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
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Nổi bật
                </h2>
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => navigate("featured")}
                >
                  Xem tất cả &gt;
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {featuredBooks.map((book) => (
                  <div
                    key={book.idBook}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2 cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/detail/${book.idBook}`)}
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
                    <p className="text-xs text-gray-500">
                      {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
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
                <button className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {loanHistory.map((item) => (
                  <div
                    key={item.idBook}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2 cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/detail/${item.idBook}`)}
                  >
                    {item.avatarUrl ? (
                      <img
                        src={item.avatarUrl}
                        alt={item.nameBook}
                        className="h-40 w-full object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="h-40 bg-gray-200 rounded mb-2" />
                    )}
                    <p className="text-sm font-semibold text-[#154734]">
                      {item.nameBook}
                    </p>
                    <p className="text-xs text-gray-500">{item.genre}</p>
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
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => navigate("/author")}
                >
                  Xem tất cả &gt;
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {authors.map((author) => (
                  <div
                    key={author.idAuthor}
                    className="flex flex-col items-center text-center border rounded p-2 cursor-pointer"
                    onClick={() => navigate(`/authorInfo/${author.idAuthor}`)}
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
                    <span className="text-blue-500 text-xs mt-1">
                      Thông tin chi tiết
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Sách mới
                </h2>
                <button
                  className="text-blue-500 text-sm"
                  onClick={() => navigate("/new-books")}
                >
                  Xem tất cả &gt;
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {latestBooks.map((book) => (
                  <div
                    key={book.idBook}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2 cursor-pointer hover:shadow-lg transition"
                    onClick={() => navigate(`/detail/${book.idBook}`)}
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
                    <p className="text-xs text-gray-500">
                      {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
                    </p>
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

export default UserHomepage;