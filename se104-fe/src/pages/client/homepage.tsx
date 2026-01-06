import { useEffect, useState, useRef } from "react";
// 1. IMPORT THÊM useSearchParams
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllBooksAndCommentsAPI,
  getLoanSlipHistoryAPI,
  listAuthorAPI,
  addFavoriteBookAPI,
  findBooksByNameAPI,
  getStarByIdBookAPI,
} from "@/services/api";
import {
  HeartOutlined,
  HeartFilled,
  SearchOutlined,
  StarFilled,
  HistoryOutlined,
  UserOutlined,
  RightOutlined,
  TrophyFilled,
  ReadOutlined,
  BookOutlined,
  CheckCircleFilled,
  ClockCircleFilled,
  FireFilled,
  AudioFilled,
  AudioOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { message, Skeleton, Avatar, Tag } from "antd";

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import CSS
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// --- CUSTOM CSS ---
const swiperStyles = `
  .swiper-pagination-bullet {
    background-color: #cbd5e1;
    opacity: 0.5;
    width: 8px;
    height: 8px;
    transition: all 0.3s;
  }
  .swiper-pagination-bullet-active {
    background-color: #153D36 !important;
    opacity: 1;
    width: 24px;
    border-radius: 4px;
  }
  .mySwiper .swiper-slide {
    transition: transform 0.8s ease, opacity 0.8s ease;
    opacity: 0.4;
    transform: scale(0.85);
  }
  .mySwiper .swiper-slide-active {
    opacity: 1;
    transform: scale(1.05);
    z-index: 10;
  }
  @keyframes ripple {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }
  .animate-ripple {
    animation: ripple 1.5s infinite;
  }
`;

// --- INTERFACES ---
interface IBook {
  idBook: string;
  nameBook: string;
  image: string;
  authors?: { nameAuthor: string }[];
  star?: number;
  reprintYear?: number;
  isLiked?: boolean;
  description?: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const BookCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4 border border-gray-100">
    <Skeleton.Image active className="!w-full !h-52 rounded-xl" />
    <Skeleton active paragraph={{ rows: 2 }} title={false} />
  </div>
);

const BookCard = ({
  book,
  onLike,
  onClick,
  rank,
}: {
  book: IBook;
  onLike: (id: string) => void;
  onClick: (id: string) => void;
  rank?: number;
}) => (
  <div
    className="bg-white rounded-2xl p-3 border border-gray-100 flex flex-col h-full relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
    onClick={() => onClick(book.idBook)}
  >
    {rank && (
      <div className="absolute -left-2 -top-2 w-12 h-12 z-20 flex items-center justify-center">
        <div
          className={`absolute inset-0 transform rotate-45 translate-y-1 -translate-x-4 ${
            rank === 1
              ? "bg-yellow-400"
              : rank === 2
              ? "bg-gray-300"
              : rank === 3
              ? "bg-orange-400"
              : "bg-[#153D36]"
          }`}
        ></div>
        <span className="relative text-white font-bold text-sm transform -rotate-15 ml-1 mt-1">
          #{rank}
        </span>
      </div>
    )}

    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-50 mb-3">
      <img
        src={book.image || "https://placehold.co/400x600"}
        alt={book.nameBook}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div
        className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-md cursor-pointer hover:bg-red-50 transition-all z-10"
        onClick={(e) => {
          e.stopPropagation();
          onLike(book.idBook);
        }}
      >
        {book.isLiked ? (
          <HeartFilled className="text-lg text-red-500" />
        ) : (
          <HeartOutlined className="text-gray-400 text-lg hover:text-red-500" />
        )}
      </div>
    </div>

    <div className="flex-1 flex flex-col px-1">
      <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-[#153D36] transition-colors">
        {book.nameBook}
      </h3>
      <p className="text-xs text-gray-400 mb-3 truncate">
        {book.authors?.[0]?.nameAuthor || "Tác giả ẩn danh"}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <StarFilled className="text-yellow-400 text-[10px]" />
          <span className="text-xs font-bold text-gray-600">
            {book.star ? book.star.toFixed(1) : "5.0"}
          </span>
        </div>
        <span className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
          {book.reprintYear || 2024}
        </span>
      </div>
    </div>
  </div>
);

const UserHomepage = () => {
  const navigate = useNavigate();
  // --- 2. THÊM LOGIC LẮNG NGHE URL ---
  const [searchParams] = useSearchParams();

  const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [latestBooks, setLatestBooks] = useState<IBook[]>([]);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchBooks, setSearchBooks] = useState<IBook[] | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const hasFetchedData = useRef(false);

  // States for Hero Section
  const [activeHeroBook, setActiveHeroBook] = useState<IBook | null>(null);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);

  // --- HÀM TÌM KIẾM ---
  const handleSearch = async (value: string) => {
    setSearch(value);
    if (!value) {
      setSearchBooks(null);
      return;
    }
    try {
      const res = await findBooksByNameAPI(value);
      setSearchBooks(Array.isArray(res) ? res : []);
    } catch (err) {
      setSearchBooks([]);
    }
  };

  // --- EFFECT: TỰ ĐỘNG TÌM KHI URL THAY ĐỔI ---
  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearch(query);
      handleSearch(query);
    }
  }, [searchParams]); // Chạy lại mỗi khi URL thay đổi param 'search'

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      message.error("Trình duyệt không hỗ trợ tìm kiếm giọng nói");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let transcript = event.results[0][0].transcript;
      transcript = transcript.replace(/\.$/, "").trim();

      setSearch(transcript);
      handleSearch(transcript);
      message.success(`Đã tìm: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === "no-speech") {
        message.info("Không nghe thấy giọng nói, vui lòng thử lại.");
      } else {
        console.error("Voice error:", event.error);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleLike = async (bookId: string) => {
    try {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) return message.error("Vui lòng đăng nhập!");
      const res = await addFavoriteBookAPI(idUser, bookId);
      if (res) {
        const update = (list: IBook[]) =>
          list.map((b) =>
            b.idBook === bookId ? { ...b, isLiked: !b.isLiked } : b
          );
        setFeaturedBooks((prev) => update(prev));
        setLatestBooks((prev) => update(prev));
        if (searchBooks) setSearchBooks((prev) => update(prev!));
        if (activeHeroBook?.idBook === bookId)
          setActiveHeroBook((prev) =>
            prev ? { ...prev, isLiked: !prev.isLiked } : null
          );
        message.success("Đã cập nhật yêu thích");
      }
    } catch (err) {
      message.error("Lỗi thao tác");
    }
  };

  const handleSlideChange = (swiper: any) => {
    const index = swiper.realIndex;
    if (
      featuredBooks[index] &&
      featuredBooks[index].idBook !== activeHeroBook?.idBook
    ) {
      setIsHeroTransitioning(true);
      setTimeout(() => {
        setActiveHeroBook(featuredBooks[index]);
        setIsHeroTransitioning(false);
      }, 300);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetchedData.current) return;
      hasFetchedData.current = true;
      try {
        setLoading(true);
        const idUser = localStorage.getItem("idUser");
        if (!idUser) return;

        const [data, authorRes, historyRes] = await Promise.all([
          getAllBooksAndCommentsAPI(idUser),
          listAuthorAPI(),
          getLoanSlipHistoryAPI(idUser),
        ]);

        const rawHistory = historyRes?.data ?? historyRes ?? [];
        setLoanHistory(Array.isArray(rawHistory) ? rawHistory.slice(0, 4) : []);

        const rawAuthors = authorRes?.data ?? authorRes ?? [];
        setAuthors(Array.isArray(rawAuthors) ? rawAuthors.slice(0, 5) : []);

        const booksResponse = data?.data ?? data ?? [];
        if (Array.isArray(booksResponse)) {
          const booksWithStars = await Promise.all(
            booksResponse.map(async (book: any) => {
              try {
                const res = await getStarByIdBookAPI(book.idBook);
                return {
                  ...book,
                  star: res?.data?.[0]?.star ?? 0,
                };
              } catch {
                return { ...book, star: 0 };
              }
            })
          );
          const sortedFeatured = [...booksWithStars]
            .sort((a, b) => (b.star || 0) - (a.star || 0))
            .slice(0, 8);
          setFeaturedBooks(sortedFeatured);
          if (sortedFeatured.length > 0) setActiveHeroBook(sortedFeatured[0]);
          setLatestBooks(
            [...booksWithStars]
              .sort((a, b) => (b.reprintYear || 0) - (a.reprintYear || 0))
              .slice(0, 12)
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800">
      <style>{swiperStyles}</style>

      {/* --- LISTENING OVERLAY --- */}
      {isListening && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center flex-col animate-fadeIn">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center gap-6 relative">
            <button
              onClick={stopListening}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <CloseOutlined className="text-xl" />
            </button>

            <div className="relative">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center animate-ripple">
                <AudioFilled className="text-4xl text-red-500" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-bold text-xl text-gray-800">Đang nghe...</h3>
              <p className="text-gray-500 text-sm">
                Hãy nói tên sách hoặc tác giả
              </p>
            </div>

            <button
              onClick={stopListening}
              className="px-6 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition-colors"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 bg-[#153D36] rounded-xl text-white flex items-center justify-center shadow-lg">
              <BookOutlined className="text-white text-xl" />
            </div>
            <span className="font-extrabold text-xl text-[#153D36] tracking-tight hidden sm:block uppercase italic">
              LibManager
            </span>
          </div>

          {/* --- SEARCH BAR WITH MIC --- */}
          <div className="flex-1 max-w-xl relative">
            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sách, tác giả..."
              className="block w-full pl-11 pr-12 py-2.5 bg-gray-100 rounded-2xl text-sm focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors group"
              onClick={handleVoiceSearch}
              title="Tìm kiếm bằng giọng nói"
            >
              {isListening ? (
                <AudioFilled className="text-red-500 animate-pulse text-lg" />
              ) : (
                <AudioOutlined className="text-gray-400 group-hover:text-[#153D36] text-lg" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-[#153D36] hover:text-white transition-all shadow-sm"
              onClick={() => navigate("/profile")}
            >
              <UserOutlined />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HERO SECTION - SYNCED WITH SWIPER */}
        {!searchBooks && activeHeroBook && (
          <section
            className={`relative rounded-[2.5rem] overflow-hidden bg-[#153D36] text-white shadow-2xl mb-12 min-h-[480px] flex items-center transition-all duration-500 ${
              isHeroTransitioning
                ? "opacity-50 blur-sm scale-[0.98]"
                : "opacity-100 blur-0 scale-100"
            }`}
          >
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-125"
                style={{
                  backgroundImage: `url(${activeHeroBook.image})`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#153D36] via-[#153D36]/80 to-transparent"></div>
            </div>
            <div className="relative z-10 w-full px-8 md:px-16 py-12 flex flex-col-reverse md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <Tag
                  color="gold"
                  className="font-black border-none uppercase px-4 py-1 rounded-full flex items-center gap-2 w-fit"
                >
                  <FireFilled /> Sách thịnh hành
                </Tag>
                <h1 className="text-4xl md:text-6xl font-black leading-tight drop-shadow-2xl">
                  {activeHeroBook.nameBook}
                </h1>
                <p className="text-emerald-50/80 text-lg font-medium max-w-xl line-clamp-2 italic">
                  "
                  {activeHeroBook.description ||
                    `Khám phá hành trình tri thức cùng ${activeHeroBook.authors?.[0]?.nameAuthor}. Một tác phẩm không thể bỏ qua tại thư viện.`}
                  "
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => navigate(`/detail/${activeHeroBook.idBook}`)}
                    className="bg-white text-[#153D36] px-10 py-4 rounded-2xl font-black hover:bg-emerald-50 hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
                  >
                    <ReadOutlined /> CHI TIẾT SÁCH
                  </button>
                  <button
                    onClick={() => toggleLike(activeHeroBook.idBook)}
                    className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-bold flex items-center gap-2"
                  >
                    {activeHeroBook.isLiked ? (
                      <HeartFilled className="text-red-500" />
                    ) : (
                      <HeartOutlined />
                    )}{" "}
                    YÊU THÍCH
                  </button>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
                <img
                  src={activeHeroBook.image}
                  className="relative w-[260px] md:w-[320px] aspect-[2/3] object-cover rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-2 group-hover:rotate-0 transition-all duration-700"
                  alt=""
                />
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-20">
            {/* RANKING */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <TrophyFilled className="text-amber-500 text-2xl" />
                </div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight uppercase italic">
                  {searchBooks !== null
                    ? "Kết quả tìm kiếm"
                    : "Bảng vàng thư viện"}
                </h2>
              </div>
              {loading ? (
                <div className="grid grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : searchBooks !== null ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {searchBooks.map((book) => (
                    <BookCard
                      key={book.idBook}
                      book={book}
                      onLike={toggleLike}
                      onClick={(id) => navigate(`/detail/${id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={"auto"}
                  loop={featuredBooks.length >= 3}
                  speed={1200}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                  }}
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  modules={[EffectCoverflow, Pagination, Autoplay]}
                  className="mySwiper !pb-16"
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  onSlideChange={handleSlideChange}
                >
                  {featuredBooks.map((book, index) => (
                    <SwiperSlide key={book.idBook} className="!w-[240px]">
                      <BookCard
                        book={book}
                        onLike={toggleLike}
                        onClick={(id) => navigate(`/detail/${id}`)}
                        rank={index + 1}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </section>

            {/* NEW BOOKS */}
            {!searchBooks && (
              <section>
                <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                    <div className="w-3 h-3 bg-[#153D36] rounded-full animate-ping"></div>{" "}
                    SÁCH MỚI LÊN KỆ
                  </h2>
                  <button
                    onClick={() => navigate("/new-books")}
                    className="group text-[#153D36] font-black text-sm uppercase tracking-wider flex items-center"
                  >
                    XEM TẤT CẢ{" "}
                    <RightOutlined className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {latestBooks.map((book) => (
                    <BookCard
                      key={book.idBook}
                      book={book}
                      onLike={toggleLike}
                      onClick={(id) => navigate(`/detail/${id}`)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* SIDEBAR */}
          {!searchBooks && (
            <div className="lg:col-span-4 space-y-12">
              <div className="sticky top-24 space-y-12">
                {/* TOP AUTHORS */}
                <section className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-50 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <h3 className="font-black text-xl text-gray-800 uppercase tracking-tighter">
                      Tác giả tiêu biểu
                    </h3>
                    <button
                      onClick={() => navigate("/author")}
                      className="text-[#153D36] font-bold text-xs hover:underline uppercase"
                    >
                      Tất cả
                    </button>
                  </div>
                  <div className="space-y-6 relative z-10">
                    {loading ? (
                      <Skeleton active avatar />
                    ) : (
                      authors.map((author, index) => (
                        <div
                          key={author.idAuthor}
                          onClick={() =>
                            navigate(`/authorInfo/${author.idAuthor}`)
                          }
                          className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-emerald-50 rounded-2xl transition-all duration-300"
                        >
                          <div className="relative">
                            <Avatar
                              size={60}
                              src={author.urlAvatar}
                              className="border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                              icon={<UserOutlined />}
                            />
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-400 text-[#153D36] rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-gray-800 group-hover:text-[#153D36] transition-colors truncate text-base">
                              {author.nameAuthor}
                            </h4>
                            <Tag className="m-0 mt-1 border-none bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md uppercase">
                              {author.nationality || "Việt Nam"}
                            </Tag>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Decoration */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#153D36]/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                </section>

                {/* RECENT BORROWING */}
                <section className="bg-[#153D36] rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-10 relative z-10">
                    <div className="flex items-center gap-3 text-white">
                      <HistoryOutlined className="text-emerald-400 text-2xl" />
                      <h3 className="font-black text-lg uppercase tracking-widest">
                        Mượn gần đây
                      </h3>
                    </div>
                    <button
                      onClick={() => navigate("/history")}
                      className="text-emerald-300 text-[10px] font-black hover:text-white uppercase tracking-widest"
                    >
                      Lịch sử
                    </button>
                  </div>

                  <div className="space-y-5 relative z-10">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 3 }} />
                    ) : loanHistory.length > 0 ? (
                      loanHistory.map((item) => (
                        <div
                          key={item.idBook}
                          onClick={() => navigate(`/detail/${item.idBook}`)}
                          className="flex gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 cursor-pointer border border-white/5 hover:border-emerald-500/30 group/item"
                        >
                          <div className="w-16 h-22 flex-shrink-0 shadow-2xl">
                            <img
                              src={
                                item.avatarUrl || "https://placehold.co/150x220"
                              }
                              className="w-full h-full object-cover rounded-xl border border-white/10 group-item-hover:scale-105 transition-transform"
                              alt=""
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-black truncate text-white group-item-hover:text-emerald-400 transition-colors mb-1">
                              {item.nameBook}
                            </h4>
                            <div className="space-y-1">
                              <p className="text-[10px] text-gray-400 font-medium">
                                ID: {item.idBook}
                              </p>
                              {item.dateReturn ? (
                                <span className="text-[10px] text-emerald-400 font-black flex items-center gap-1.5 uppercase">
                                  <CheckCircleFilled /> Đã hoàn trả
                                </span>
                              ) : (
                                <span className="text-[10px] text-amber-400 font-black flex items-center gap-1.5 uppercase animate-pulse">
                                  <ClockCircleFilled /> Đang mượn
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-white/20">
                        <BookOutlined className="text-5xl mb-3" />
                        <p className="text-xs uppercase tracking-widest font-black">
                          Chưa có lịch sử
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Decoration */}
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                </section>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserHomepage;
