import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllBooksAndCommentsAPI,
  getLoanSlipHistoryAPI,
  listAuthorAPI,
  addFavoriteBookAPI,
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
import { message, Skeleton, Avatar } from "antd";

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import CSS
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// --- CUSTOM CSS ---
const swiperStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.6s ease-out forwards;
  }
  
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }

  .swiper-pagination-bullet {
    background-color: #cbd5e1;
    opacity: 0.6;
    width: 10px;
    height: 10px;
    transition: all 0.3s ease;
  }
  .swiper-pagination-bullet-active {
    background-color: #153D36 !important;
    opacity: 1;
    width: 28px;
    border-radius: 5px;
  }
  .mySwiper .swiper-slide {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease;
    opacity: 0.6;
    transform: scale(0.88);
  }
  .mySwiper .swiper-slide-active {
    opacity: 1;
    transform: scale(1.02);
    z-index: 10;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.4);
  }
  
  .premium-shadow {
    box-shadow: 0 4px 20px -2px rgba(21, 61, 54, 0.12), 0 12px 40px -4px rgba(21, 61, 54, 0.08);
  }
  
  .premium-shadow:hover {
    box-shadow: 0 8px 30px -2px rgba(21, 61, 54, 0.18), 0 20px 60px -4px rgba(21, 61, 54, 0.12);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #153D36 0%, #1e5649 50%, #27705e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .glow-emerald {
    box-shadow: 0 0 40px rgba(21, 61, 54, 0.3);
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

// --- HELPER: BỎ DẤU TIẾNG VIỆT ---
const removeAccents = (str: string) => {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

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
    className="glass-card rounded-2xl p-3 flex flex-col h-full relative overflow-hidden premium-shadow transition-all duration-400 group cursor-pointer hover:-translate-y-1"
    onClick={() => onClick(book.idBook)}
  >
    {rank && (
      <div className="absolute top-3 left-3 z-20">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-lg ${rank === 1
            ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
            : rank === 2
              ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700"
              : rank === 3
                ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                : "bg-gradient-to-br from-[#153D36] to-[#1e5649] text-white"
            }`}
        >
          {rank}
        </div>
      </div>
    )}

    <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 mb-3">
      <img
        src={book.image || "https://placehold.co/400x600"}
        alt={book.nameBook}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Like button */}
      <div
        className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg cursor-pointer hover:bg-red-50 hover:scale-110 transition-all duration-300 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onLike(book.idBook);
        }}
      >
        {book.isLiked ? (
          <HeartFilled className="text-lg text-red-500" />
        ) : (
          <HeartOutlined className="text-gray-400 text-lg group-hover:text-red-400" />
        )}
      </div>

      {/* Quick action button on hover */}
      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <button className="w-full py-2.5 bg-white/95 backdrop-blur-xl rounded-xl text-[#153D36] text-xs font-bold shadow-lg hover:bg-[#153D36] hover:text-white transition-all duration-300">
          Xem chi tiết
        </button>
      </div>
    </div>

    <div className="flex-1 flex flex-col px-1">
      <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1.5 group-hover:text-[#153D36] transition-colors leading-snug">
        {book.nameBook}
      </h3>
      <p className="text-xs text-gray-400 mb-3 truncate font-medium">
        {book.authors?.[0]?.nameAuthor || "Tác giả ẩn danh"}
      </p>
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-1 rounded-lg">
          <StarFilled className="text-amber-400 text-xs" />
          <span className="text-xs font-bold text-amber-600">
            {book.star !== undefined && book.star > 0 ? book.star.toFixed(1) : "0.0"}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-[#153D36] bg-emerald-50 px-2.5 py-1 rounded-lg">
          {book.reprintYear || 2024}
        </span>
      </div>
    </div>
  </div>
);

const UserHomepage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // STATE DATA
  const [allBooks, setAllBooks] = useState<IBook[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [latestBooks, setLatestBooks] = useState<IBook[]>([]);
  const [loanHistory, setLoanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // STATE SEARCH & UI
  const [search, setSearch] = useState("");
  const [searchBooks, setSearchBooks] = useState<IBook[] | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const hasFetchedData = useRef(false);

  // States for Hero Section
  const [activeHeroBook, setActiveHeroBook] = useState<IBook | null>(null);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);

  // --- LOGIC TÌM KIẾM ---
  const handleSearch = (value: string) => {
    setSearch(value);

    if (!value || value.trim() === "") {
      setSearchBooks(null);
      return;
    }

    if (!allBooks || allBooks.length === 0) return;

    const searchTerm = removeAccents(value.trim());

    const filtered = allBooks.filter((book) => {
      if (!book) return false;
      const bookName = book.nameBook ? removeAccents(book.nameBook) : "";
      const authorName =
        book.authors && book.authors.length > 0 && book.authors[0]?.nameAuthor
          ? removeAccents(book.authors[0].nameAuthor)
          : "";
      return bookName.includes(searchTerm) || authorName.includes(searchTerm);
    });

    setSearchBooks(filtered);
  };

  useEffect(() => {
    const query = searchParams.get("search");
    if (query && allBooks.length > 0) {
      if (search === "") {
        setSearch(query);
        handleSearch(query);
      }
    }
  }, [searchParams, allBooks]);

  // --- VOICE SEARCH ---
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

  // --- TOGGLE LIKE ---
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

        setAllBooks((prev) => update(prev));
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

  // --- FETCH DATA ---
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
          // Calculate star ratings from evaluations
          const booksWithStars = booksResponse.map((book: any) => {
            const evaluations = book.evaluations || [];
            let star = 0;
            if (evaluations.length > 0) {
              const totalRating = evaluations.reduce((sum: number, e: any) => sum + (e.rating || 0), 0);
              star = totalRating / evaluations.length;
            }
            return {
              ...book,
              star,
            };
          });

          setAllBooks(booksWithStars);

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
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center animate-pulse">
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

      {/* --- HEADER --- */}
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

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-64px)]">
        {/* HERO SECTION (Chỉ hiện khi không tìm kiếm) */}
        {!searchBooks && activeHeroBook && (
          <section
            className={`relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d2925] via-[#153D36] to-[#1a4a40] text-white mb-14 min-h-[460px] flex items-center transition-opacity duration-300 ${isHeroTransitioning
              ? "opacity-70"
              : "opacity-100"
              }`}
          >
            {/* Background layers */}
            <div className="absolute inset-0 z-0">
              {/* Blurred book background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-10 blur-2xl scale-110"
                style={{
                  backgroundImage: `url(${activeHeroBook.image || "https://placehold.co/320x480/153D36/FFFFFF?text=📚"})`,
                }}
              ></div>
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d2925] via-[#153D36]/95 to-transparent"></div>
              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 w-full px-8 md:px-16 py-14 flex flex-col-reverse md:flex-row items-center gap-14">
              {/* Content */}
              <div className="flex-1 space-y-7">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-[#153D36] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                    <FireFilled className="text-sm" /> Thịnh hành
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white/80 border border-white/10">
                    <StarFilled className="text-amber-400" /> {activeHeroBook.star && activeHeroBook.star > 0 ? activeHeroBook.star.toFixed(1) : "0.0"}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                  {activeHeroBook.nameBook}
                </h1>

                <p className="text-emerald-100/70 text-lg font-medium max-w-xl line-clamp-2 leading-relaxed">
                  {activeHeroBook.description ||
                    `Khám phá hành trình tri thức cùng ${activeHeroBook.authors?.[0]?.nameAuthor || 'tác giả'}. Một tác phẩm không thể bỏ qua tại thư viện.`}
                </p>

                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <UserOutlined />
                    {activeHeroBook.authors?.[0]?.nameAuthor || "Tác giả ẩn danh"}
                  </span>
                  <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                  <span>{activeHeroBook.reprintYear || 2024}</span>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigate(`/detail/${activeHeroBook.idBook}`)}
                    className="group bg-white text-[#153D36] px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
                  >
                    <ReadOutlined className="text-lg" />
                    <span>Xem chi tiết</span>
                    <RightOutlined className="text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </button>
                  <button
                    onClick={() => toggleLike(activeHeroBook.idBook)}
                    className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all duration-300 font-semibold flex items-center gap-3 hover:border-white/40"
                  >
                    {activeHeroBook.isLiked ? (
                      <HeartFilled className="text-red-400 text-lg" />
                    ) : (
                      <HeartOutlined className="text-lg" />
                    )}
                    Yêu thích
                  </button>
                </div>
              </div>

              {/* Book image with float animation */}
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/20 to-transparent blur-3xl rounded-full scale-150"></div>
                <div className="relative">
                  <img
                    src={activeHeroBook.image || "https://placehold.co/320x480/153D36/FFFFFF?text=📚"}
                    className="relative w-[260px] md:w-[300px] aspect-[2/3] object-cover rounded-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.5)] glow-emerald"
                    alt={activeHeroBook.nameBook}
                  />
                  {/* Decorative frame */}
                  <div className="absolute -inset-3 border-2 border-white/10 rounded-3xl"></div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* --- GRID LAYOUT CHÍNH --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CỘT CHÍNH: NẾU SEARCH -> COL-SPAN-12 (FULL), NẾU KHÔNG -> COL-SPAN-8 */}
          <div
            className={`${searchBooks !== null ? "lg:col-span-12" : "lg:col-span-8"
              } space-y-20`}
          >
            <section>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                  <TrophyFilled className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">
                    {searchBooks !== null
                      ? "Kết quả tìm kiếm"
                      : "Bảng vàng thư viện"}
                  </h2>
                  <p className="text-gray-400 text-sm font-medium mt-1">
                    {searchBooks !== null ? `Tìm thấy ${searchBooks.length} kết quả` : "Những cuốn sách được yêu thích nhất"}
                  </p>
                </div>
              </div>

              {/* LOGIC HIỂN THỊ */}
              {loading ? (
                <div className="grid grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <BookCardSkeleton key={i} />
                  ))}
                </div>
              ) : searchBooks !== null ? (
                /* --- TRƯỜNG HỢP CÓ TÌM KIẾM --- */
                searchBooks.length === 0 ? (
                  // Không tìm thấy
                  <div className="flex flex-col items-center justify-center py-16 animate-fadeIn text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <SearchOutlined className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      Không tìm thấy sách
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-xs mx-auto">
                      Không có kết quả nào cho từ khóa <b>"{search}"</b>
                    </p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setSearchBooks(null);
                      }}
                      className="text-[#153D36] font-bold hover:underline"
                    >
                      Quay lại trang chủ
                    </button>
                  </div>
                ) : (
                  // Có kết quả: Mở rộng grid (5 cột cho màn hình lớn vì ẩn sidebar)
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    {searchBooks.map((book) => (
                      <BookCard
                        key={book.idBook}
                        book={book}
                        onLike={toggleLike}
                        onClick={(id) => navigate(`/detail/${id}`)}
                      />
                    ))}
                  </div>
                )
              ) : (
                /* --- TRƯỜNG HỢP MẶC ĐỊNH (SWIPER) --- */
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

            {/* NEW BOOKS SECTION */}
            {!searchBooks && (
              <section>
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#153D36] to-[#1e5649] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                      <BookOutlined className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-800">
                        Sách mới lên kệ
                      </h2>
                      <p className="text-gray-400 text-sm font-medium mt-0.5">
                        Những đầu sách mới nhất tại thư viện
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/new-books")}
                    className="group flex items-center gap-2 bg-[#153D36]/5 hover:bg-[#153D36] text-[#153D36] hover:text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300"
                  >
                    Xem tất cả
                    <RightOutlined className="text-xs group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

          {/* RIGHT COLUMN: SIDEBAR (CHỈ HIỆN KHI KHÔNG TÌM KIẾM) */}
          {!searchBooks && (
            <div className="lg:col-span-4 space-y-12">
              <div className="sticky top-24 space-y-12">
                {/* TOP AUTHORS */}
                <section className="glass-card rounded-2xl p-6 premium-shadow relative overflow-hidden">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-60"></div>

                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#153D36] to-[#1e5649] rounded-xl flex items-center justify-center">
                        <UserOutlined className="text-white text-lg" />
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Tác giả tiêu biểu
                      </h3>
                    </div>
                    <button
                      onClick={() => navigate("/author")}
                      className="text-[#153D36] font-semibold text-xs hover:underline flex items-center gap-1"
                    >
                      Xem tất cả <RightOutlined className="text-[10px]" />
                    </button>
                  </div>

                  <div className="space-y-3 relative z-10">
                    {loading ? (
                      <Skeleton active avatar />
                    ) : (
                      authors.map((author, index) => (
                        <div
                          key={author.idAuthor}
                          onClick={() =>
                            navigate(`/authorInfo/${author.idAuthor}`)
                          }
                          className="flex items-center gap-4 group cursor-pointer p-3 bg-gray-50/50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-transparent rounded-xl transition-all duration-300"
                        >
                          <div className="relative">
                            <Avatar
                              size={48}
                              src={author.urlAvatar}
                              className="border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                              icon={<UserOutlined />}
                            />
                            <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                              index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700' :
                                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                                  'bg-[#153D36] text-white'
                              }`}>
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 group-hover:text-[#153D36] transition-colors truncate text-sm">
                              {author.nameAuthor}
                            </h4>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {author.nationality || "Việt Nam"}
                            </span>
                          </div>
                          <RightOutlined className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* RECENT BORROWING */}
                <section className="bg-gradient-to-br from-[#0d2925] via-[#153D36] to-[#1a4a40] rounded-2xl p-6 premium-shadow relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                        <HistoryOutlined className="text-emerald-400 text-lg" />
                      </div>
                      <h3 className="font-bold text-lg text-white">
                        Mượn gần đây
                      </h3>
                    </div>
                    <button
                      onClick={() => navigate("/history")}
                      className="text-emerald-300 text-xs font-semibold hover:text-white flex items-center gap-1 transition-colors"
                    >
                      Xem lịch sử <RightOutlined className="text-[10px]" />
                    </button>
                  </div>

                  <div className="space-y-3 relative z-10">
                    {loading ? (
                      <Skeleton active paragraph={{ rows: 3 }} />
                    ) : loanHistory.length > 0 ? (
                      loanHistory.map((item) => (
                        <div
                          key={item.idBook}
                          onClick={() => navigate(`/detail/${item.idBook}`)}
                          className="flex gap-4 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer border border-white/5 hover:border-emerald-500/20 group"
                        >
                          <div className="w-14 h-20 flex-shrink-0">
                            <img
                              src={
                                item.avatarUrl || "https://placehold.co/150x220"
                              }
                              className="w-full h-full object-cover rounded-lg border border-white/10 shadow-lg"
                              alt=""
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="text-sm font-bold truncate text-white group-hover:text-emerald-300 transition-colors mb-1">
                              {item.nameBook}
                            </h4>
                            <p className="text-[10px] text-white/40 font-medium mb-2">
                              ID: {item.idBook}
                            </p>
                            {item.dateReturn ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full w-fit">
                                <CheckCircleFilled /> Đã hoàn trả
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold bg-amber-400/10 px-2 py-0.5 rounded-full w-fit">
                                <ClockCircleFilled /> Đang mượn
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-white/20">
                        <BookOutlined className="text-4xl mb-3" />
                        <p className="text-xs font-medium">
                          Chưa có lịch sử mượn sách
                        </p>
                      </div>
                    )}
                  </div>
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
