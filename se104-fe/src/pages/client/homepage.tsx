import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllBooksAndCommentsAPI,
  getLoanSlipHistoryAPI,
  listAuthorAPI,
  addFavoriteBookAPI,
  findBooksByNameAPI,
  getStarByIdBookAPI,
} from "@/services/api";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { message, Spin } from "antd";

const UserHomepage = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
  const [authors, setAuthors] = useState<IAddAuthor[]>([]);
  const [latestBooks, setLatestBooks] = useState<IBook[]>([]);
  const [loanHistory, setLoanHistory] = useState<ILoanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchBooks, setSearchBooks] = useState<IBook[] | null>(null);
  const hasFetchedData = useRef(false);

  const toggleLike = async (bookId: string) => {
    try {
      const res = await addFavoriteBookAPI(bookId);
      if (res) {
        const updateLikedState = (books: IBook[]) =>
          books.map((book) =>
            book.idBook === bookId ? { ...book, isLiked: !book.isLiked } : book
          );

        setFeaturedBooks((prev) => updateLikedState(prev));
        setLatestBooks((prev) => updateLikedState(prev));
      } else {
        message.error("Không thể cập nhật trạng thái yêu thích.");
      }
    } catch (err) {
      message.error("Lỗi khi yêu thích sách.");
    }
  };

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (!value) {
      setSearchBooks(null);
      return;
    }
    try {
      const res = await findBooksByNameAPI(value);
      if (Array.isArray(res)) {
        setSearchBooks(res);
      } else {
        setSearchBooks([]);
      }
    } catch (err) {
      setSearchBooks([]);
      message.error("Lỗi khi tìm kiếm sách.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const idUser = localStorage.getItem("idUser");
        if (!token || !idUser) {
          message.warning("Không tìm thấy thông tin đăng nhập.");
          return;
        }

        const historyRes = await getLoanSlipHistoryAPI(idUser);
        if (Array.isArray(historyRes)) {
          setLoanHistory(historyRes.slice(0, 5));
        }

        const [booksResponse, authorRes] = await Promise.all([
          getAllBooksAndCommentsAPI(idUser),
          listAuthorAPI(),
        ]);

        if (Array.isArray(booksResponse)) {
          // Lấy số sao cho từng sách bằng cách gọi getStarByIdBookAPI
          const booksWithStars = await Promise.all(
            booksResponse.map(async (book: any) => {
              try {
                const res = await getStarByIdBookAPI(book.idBook);
                // API trả về mảng, lấy phần tử đầu tiên nếu có
                let star = 0;
                if (
                  Array.isArray(res) &&
                  res.length > 0 &&
                  typeof res[0].star === "number"
                ) {
                  star = res[0].star;
                }
                return { ...book, star };
              } catch {
                return { ...book, star: 0 };
              }
            })
          );
          // Sắp xếp giảm dần theo số sao và lấy 5 quyển đầu tiên
          const sortedByStar = booksWithStars.sort((a, b) => b.star - a.star);
          setFeaturedBooks(sortedByStar.slice(0, 5));
          // Sắp xếp theo reprintYear gần nhất với hiện tại (năm hiện tại là 2025)
          const sorted = [...booksResponse].sort(
            (a, b) =>
              Math.abs(b.reprintYear - 2025) - Math.abs(a.reprintYear - 2025)
          );
          setLatestBooks(sorted.slice(0, 10));
        }

        if (Array.isArray(authorRes)) {
          setAuthors(authorRes.slice(0, 4));
        }
      } catch (error) {
        message.error("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchData();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex justify-center items-center">
          <Spin size="large" />
        </div>
      )}

      {!loading && (
        <>
          {/* Header with Search */}
          <header className="bg-gradient-to-r from-[#153D36] to-[#1A4E46] px-6 py-4 shadow-lg">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                  alt="Library"
                  className="w-8 h-8 mx-auto filter invert"
                />
                <span className=" ml-2 text-white font-bold text-xl">
                  Library
                </span>
              </div>

              <div className="relative w-full max-w-md mx-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm sách..."
                  className="w-full px-4 py-2 rounded-full outline-none text-sm text-gray-800 bg-white shadow-sm focus:ring-2 focus:ring-[#1A4E46]"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-screen-xl mx-auto px-4 py-8">
            {/* Hero Section */}
            <section className="mb-12 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-[#1A4E46] to-[#2D7D6E] text-white p-8">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Khám phá thế giới sách không giới hạn
                </h1>
                <p className="text-lg mb-6">
                  Hơn 10,000 đầu sách đang chờ bạn khám phá. Mượn sách dễ dàng,
                  trả sách thuận tiện.
                </p>
                <button
                  className="bg-white text-[#1A4E46] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition cursor-pointer shadow-md"
                  onClick={() => navigate("/featured")}
                >
                  Xem tất cả sách
                </button>
              </div>
            </section>

            {/* Featured Books */}
            <section className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchBooks !== null ? "Kết quả tìm kiếm" : "Sách nổi bật"}
                </h2>
                {searchBooks === null && (
                  <button
                    onClick={() => navigate("featured")}
                    className="bg-[#b2ebf2] text-[#0d47a1] rounded-full px-5 py-2 font-semibold flex items-center gap-1 shadow hover:bg-[#4dd0e1] transition cursor-pointer"
                  >
                    Xem tất cả
                    <svg
                      className="w-4 h-4 ml-1 text-[#0d47a1]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {searchBooks !== null ? (
                  searchBooks.length === 0 ? (
                    <div className="col-span-full text-center text-gray-500 py-8 text-lg font-medium">
                      Không có sách mà bạn tìm kiếm
                    </div>
                  ) : (
                    searchBooks.map((book) => (
                      <div
                        key={book.idBook}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer relative"
                        onClick={() => navigate(`/detail/${book.idBook}`)}
                      >
                        <div
                          className="absolute top-3 right-3 z-10 cursor-pointer p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(book.idBook);
                          }}
                        >
                          {book.isLiked ? (
                            <HeartFilled
                              style={{ color: "rgb(239 68 68)" }}
                              className="text-lg"
                            />
                          ) : (
                            <HeartOutlined className="text-lg text-gray-400 hover:text-red-400" />
                          )}
                        </div>
                        <div className="aspect-[2/3] bg-gray-100 relative">
                          {book.image ? (
                            <img
                              src={book.image}
                              alt={book.nameBook}
                              className="w-full h-full object-cover"
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
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 line-clamp-2">
                            {book.nameBook}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {book.authors?.[0]?.nameAuthor ||
                              "Không rõ tác giả"}
                          </p>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  featuredBooks.map((book) => (
                    <div
                      key={book.idBook}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer relative"
                      onClick={() => navigate(`/detail/${book.idBook}`)}
                    >
                      <div
                        className="absolute top-3 right-3 z-10 cursor-pointer p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(book.idBook);
                        }}
                      >
                        {book.isLiked ? (
                          <HeartFilled
                            style={{ color: "rgb(239 68 68)" }}
                            className="text-lg"
                          />
                        ) : (
                          <HeartOutlined className="text-lg text-gray-400 hover:text-red-400" />
                        )}
                      </div>
                      <div className="aspect-[2/3] bg-gray-100 relative">
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.nameBook}
                            className="w-full h-full object-cover"
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
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {book.nameBook}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Ẩn các phần khác khi đang tìm kiếm */}
            {searchBooks === null && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - 2/3 width */}
                <div className="lg:col-span-2 space-y-8">
                  {/* New Books */}
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Sách mới
                      </h2>
                      <button
                        onClick={() => navigate("/new-books")}
                        className="bg-[#b2ebf2] text-[#0d47a1] rounded-full px-5 py-2 font-semibold flex items-center gap-1 shadow hover:bg-[#4dd0e1] transition cursor-pointer"
                      >
                        Xem tất cả
                        <svg
                          className="w-4 h-4 ml-1 text-[#0d47a1]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                      {latestBooks.map((book) => (
                        <div
                          key={book.idBook}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer relative"
                          onClick={() => navigate(`/detail/${book.idBook}`)}
                        >
                          <div
                            className="absolute top-3 right-3 z-10 cursor-pointer p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(book.idBook);
                            }}
                          >
                            {book.isLiked ? (
                              <HeartFilled
                                style={{ color: "rgb(239 68 68)" }}
                                className="text-lg"
                              />
                            ) : (
                              <HeartOutlined className="text-lg text-gray-400 hover:text-red-400" />
                            )}
                          </div>
                          <div className="aspect-[2/3] bg-gray-100 relative">
                            {book.image ? (
                              <img
                                src={book.image}
                                alt={book.nameBook}
                                className="w-full h-full object-cover"
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
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 line-clamp-2">
                              {book.nameBook}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {book.authors?.[0]?.nameAuthor ||
                                "Không rõ tác giả"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column - 1/3 width */}
                <div className="space-y-8">
                  {/* Authors Section */}
                  <section className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Tác giả
                      </h2>
                      <button
                        onClick={() => navigate("/author")}
                        className="bg-[#b2ebf2] text-[#0d47a1] rounded-full px-5 py-2 font-semibold flex items-center gap-1 shadow hover:bg-[#4dd0e1] transition cursor-pointer"
                      >
                        Xem tất cả
                        <svg
                          className="w-4 h-4 ml-1 text-[#0d47a1]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {authors.map((author) => (
                        <div
                          key={author.idAuthor}
                          className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                          onClick={() =>
                            navigate(`/authorInfo/${author.idAuthor}`)
                          }
                        >
                          {author.urlAvatar ? (
                            <img
                              src={author.urlAvatar}
                              alt={author.nameAuthor}
                              className="w-16 h-16 rounded-full object-cover mb-3"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1A4E46] to-[#2D7D6E] flex items-center justify-center text-white font-bold text-xl mb-3">
                              {author.nameAuthor.charAt(0)}
                            </div>
                          )}
                          <h3 className="font-medium text-gray-800">
                            {author.nameAuthor}
                          </h3>
                          <span className="text-xs text-[#1A4E46] mt-1">
                            Xem chi tiết
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Borrowing History */}
                  <section className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">
                        Lịch sử mượn sách
                      </h2>
                      <button
                        onClick={() => navigate("/history")}
                        className="bg-[#b2ebf2] text-[#0d47a1] rounded-full px-5 py-2 font-semibold flex items-center gap-1 shadow hover:bg-[#4dd0e1] transition cursor-pointer"
                      >
                        Xem tất cả
                        <svg
                          className="w-4 h-4 ml-1 text-[#0d47a1]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {loanHistory.map((item) => (
                        <div
                          key={item.idBook}
                          className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                          onClick={() => navigate(`/detail/${item.idBook}`)}
                        >
                          {item.avatarUrl ? (
                            <img
                              src={item.avatarUrl}
                              alt={item.nameBook}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded"></div>
                          )}
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {item.nameBook}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {item.genre}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default UserHomepage;
