import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getAllBooksAndCommentsAPI,
    getLoanSlipHistoryAPI,
    listAuthorAPI,
    addFavoriteBookAPI,
    findBooksByNameAPI,
    getStarByIdBookAPI,
} from '@/services/api';
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
} from '@ant-design/icons';
import { message, Skeleton, Avatar, Tag } from 'antd';

// --- IMPORT SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

// Import CSS
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

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
  
  /* CSS transition mượt mà hơn */
  .mySwiper .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1) !important;
  }

  .mySwiper .swiper-slide {
    transition: transform 1s ease, opacity 1s ease;
    opacity: 0.4;
    transform: scale(0.85);
    filter: blur(1px);
  }
  
  .mySwiper .swiper-slide-active {
    opacity: 1;
    transform: scale(1.05);
    filter: blur(0);
    z-index: 10;
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

const BookCardSkeleton = () => (
    <div className="bg-white rounded-xl p-3 shadow-sm space-y-3">
        <Skeleton.Image active className="!w-full !h-48 rounded-lg" />
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
        className="bg-white rounded-2xl p-3 border border-gray-100 flex flex-col h-full relative overflow-hidden shadow-md select-none"
        onClick={() => onClick(book.idBook)}
    >
        {rank && (
            <div className="absolute -left-2 -top-2 w-12 h-12 z-20 flex items-center justify-center">
                <div
                    className={`absolute inset-0 transform rotate-45 translate-y-1 -translate-x-4 ${
                        rank === 1
                            ? 'bg-yellow-400'
                            : rank === 2
                            ? 'bg-gray-300'
                            : rank === 3
                            ? 'bg-orange-400'
                            : 'bg-[#153D36]'
                    }`}
                ></div>
                <span className="relative text-white font-bold text-sm transform -rotate-15 ml-1 mt-1">
                    #{rank}
                </span>
            </div>
        )}

        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100 mb-3">
            <img
                src={book.image || 'https://via.placeholder.com/150'}
                alt={book.nameBook}
                className="w-full h-full object-cover"
            />
            <div
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm cursor-pointer hover:bg-red-50 transition-colors z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    onLike(book.idBook);
                }}
            >
                {book.isLiked ? (
                    <HeartFilled className="text-lg text-red-500" />
                ) : (
                    <HeartOutlined className="text-gray-400 text-lg hover:text-red-400" />
                )}
            </div>
        </div>

        <div className="flex-1 flex flex-col">
            <h3 className="font-bold text-gray-800 text-base line-clamp-2 mb-1 leading-snug">
                {book.nameBook}
            </h3>
            <p className="text-sm text-gray-500 mb-2 truncate">
                {book.authors?.[0]?.nameAuthor || 'Tác giả ẩn danh'}
            </p>
            <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-1">
                    <StarFilled className="text-yellow-400 text-xs" />
                    <span className="text-xs font-semibold text-gray-600">
                        {book.star ? book.star.toFixed(1) : '0.0'}
                    </span>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {book.reprintYear}
                </span>
            </div>
        </div>
    </div>
);

const UserHomepage = () => {
    const navigate = useNavigate();
    const [featuredBooks, setFeaturedBooks] = useState<IBook[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    const [latestBooks, setLatestBooks] = useState<IBook[]>([]);
    const [loanHistory, setLoanHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchBooks, setSearchBooks] = useState<IBook[] | null>(null);
    const hasFetchedData = useRef(false);
    const [activeHeroBook, setActiveHeroBook] = useState<IBook | null>(null);

    const toggleLike = async (bookId: string) => {
        try {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) return message.error('Vui lòng đăng nhập!');

            const res = await addFavoriteBookAPI(idUser, bookId);
            if (res) {
                const update = (list: IBook[]) =>
                    list.map((b) =>
                        b.idBook === bookId ? { ...b, isLiked: !b.isLiked } : b
                    );
                setFeaturedBooks((prev) => update(prev));
                setLatestBooks((prev) => update(prev));
                if (searchBooks) setSearchBooks((prev) => update(prev!));
                if (activeHeroBook?.idBook === bookId) {
                    setActiveHeroBook((prev) =>
                        prev ? { ...prev, isLiked: !prev.isLiked } : null
                    );
                }
                message.success(
                    res ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích'
                );
            }
        } catch (err) {
            message.error('Lỗi thao tác');
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
            setSearchBooks(Array.isArray(res) ? res : []);
        } catch (err) {
            setSearchBooks([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (hasFetchedData.current) return;
            hasFetchedData.current = true;

            try {
                setLoading(true);
                const idUser = localStorage.getItem('idUser');
                if (!idUser) return;

                // --- GỌI ĐẦY ĐỦ API (Sách, Tác giả, Lịch sử) ---
                const [data, authorRes, historyRes] = await Promise.all([
                    getAllBooksAndCommentsAPI(idUser),
                    listAuthorAPI(),
                    getLoanSlipHistoryAPI(idUser),
                ]);

                // Set Lịch sử mượn
                if (Array.isArray(historyRes))
                    setLoanHistory(historyRes.slice(0, 5));

                // Set Tác giả
                if (Array.isArray(authorRes)) setAuthors(authorRes.slice(0, 5));

                // Set Sách (Nổi bật & Mới)
                const booksResponse = data.data;
                if (Array.isArray(booksResponse)) {
                    const booksWithStars = await Promise.all(
                        booksResponse.map(async (book: any) => {
                            try {
                                const res = await getStarByIdBookAPI(
                                    book.idBook
                                );
                                const starData = res.data;
                                const star =
                                    Array.isArray(starData) &&
                                    starData.length > 0
                                        ? starData[0].star
                                        : 0;

                                return { ...book, star };
                            } catch {
                                return { ...book, star: 0 };
                            }
                        })
                    );

                    const sortedFeatured = [...booksWithStars]
                        .sort((a, b) => (b.star || 0) - (a.star || 0))
                        .slice(0, 8);
                    setFeaturedBooks(sortedFeatured);

                    if (sortedFeatured.length > 0)
                        setActiveHeroBook(sortedFeatured[0]);

                    setLatestBooks(
                        [...booksWithStars]
                            .sort(
                                (a, b) =>
                                    (b.reprintYear || 0) - (a.reprintYear || 0)
                            )
                            .slice(0, 10)
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

            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 bg-[#153D36] rounded-xl flex items-center justify-center shadow-lg">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                                alt="Logo"
                                className="w-6 h-6 filter invert"
                            />
                        </div>
                        <span className="font-extrabold text-xl text-[#153D36] tracking-tight hidden sm:block">
                            LibManager
                        </span>
                    </div>
                    <div className="flex-1 max-w-2xl relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchOutlined className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sách, tác giả..."
                            className="block w-full pl-11 pr-4 py-2.5 bg-gray-100 rounded-full text-sm focus:bg-white focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                        >
                            <UserOutlined className="text-gray-600" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* HERO SECTION */}
                {!searchBooks && (
                    <section className="relative rounded-3xl overflow-hidden bg-[#153D36] text-white shadow-2xl shadow-teal-900/30 mb-10 min-h-[420px] flex items-center transition-all duration-500 group">
                        {/* BACKGROUND IMAGES */}
                        {activeHeroBook && (
                            <div className="absolute inset-0 z-0">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-out blur-xl opacity-40 scale-110"
                                    style={{
                                        backgroundImage: `url(${activeHeroBook.image})`,
                                    }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#153D36] via-[#153D36]/70 to-[#153D36]/40 mix-blend-multiply"></div>
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>
                        )}

                        {/* CONTENT */}
                        <div className="relative z-10 w-full px-8 md:px-12 py-8 flex flex-col-reverse md:flex-row items-center gap-10">
                            {/* Text Info */}
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
                                    <Tag
                                        color="#fadb14"
                                        className="m-0 border-none text-black font-extrabold px-2"
                                    >
                                        HOT
                                    </Tag>
                                    <span className="text-xs text-white/90 font-medium tracking-wide">
                                        Nổi bật nhất tuần này
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-md">
                                    {activeHeroBook
                                        ? activeHeroBook.nameBook
                                        : 'Khám phá tri thức'}
                                </h1>
                                <p className="text-gray-100 text-lg line-clamp-2 max-w-xl font-medium drop-shadow-sm opacity-90">
                                    {activeHeroBook?.authors?.[0]?.nameAuthor
                                        ? `Một tác phẩm kinh điển của ${activeHeroBook.authors[0].nameAuthor}. Hãy đắm chìm vào từng trang sách ngay hôm nay.`
                                        : 'Hàng ngàn đầu sách đang chờ bạn khám phá tại thư viện của chúng tôi.'}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        onClick={() =>
                                            activeHeroBook &&
                                            navigate(
                                                `/detail/${activeHeroBook.idBook}`
                                            )
                                        }
                                        className="bg-[#fadb14] text-black px-8 py-3.5 rounded-xl font-bold hover:bg-[#eacc15] hover:scale-105 transition-all shadow-lg shadow-yellow-500/20 flex items-center gap-2"
                                    >
                                        <ReadOutlined /> Chi tiết
                                    </button>
                                    <button
                                        onClick={() =>
                                            activeHeroBook &&
                                            toggleLike(activeHeroBook.idBook)
                                        }
                                        className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all text-white font-semibold flex items-center gap-2"
                                    >
                                        {activeHeroBook?.isLiked ? (
                                            <>
                                                <HeartFilled className="text-red-500" />{' '}
                                                Đã thích
                                            </>
                                        ) : (
                                            <>
                                                <HeartOutlined /> Yêu thích
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Book Cover */}
                            <div className="w-full md:w-auto flex justify-center md:justify-end relative">
                                {activeHeroBook ? (
                                    <div className="relative w-[200px] md:w-[260px] aspect-[2/3] transform rotate-3 hover:rotate-0 transition-all duration-500 ease-out">
                                        <div className="absolute inset-0 bg-black/40 blur-2xl rounded-lg translate-y-4 translate-x-4"></div>
                                        <img
                                            src={activeHeroBook.image}
                                            alt={activeHeroBook.nameBook}
                                            className="relative w-full h-full object-cover rounded-lg shadow-2xl border border-white/10"
                                        />
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-[#153D36] z-20">
                                            <StarFilled className="text-[#153D36] text-xs" />
                                            <span className="text-[#153D36] font-bold text-xs">
                                                {activeHeroBook.star?.toFixed(
                                                    1
                                                ) || 5.0}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-[200px] h-[300px] bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                        <ReadOutlined className="text-6xl text-white/20" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN - 8 CỘT (Main Content) */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* SWIPER SECTION */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <TrophyFilled className="text-yellow-500 text-2xl" />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {searchBooks !== null
                                            ? 'Kết quả tìm kiếm'
                                            : 'Bảng Xếp Hạng Sách'}
                                    </h2>
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <BookCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : searchBooks !== null ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {searchBooks.map((book) => (
                                        <BookCard
                                            key={book.idBook}
                                            book={book}
                                            onLike={toggleLike}
                                            onClick={(id) =>
                                                navigate(`/detail/${id}`)
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4">
                                    {/* --- SWIPER CONFIGURATION (Mượt mà 3s) --- */}
                                    <Swiper
                                        effect={'coverflow'}
                                        grabCursor={true}
                                        centeredSlides={true}
                                        slidesPerView={'auto'}
                                        loop={true}
                                        speed={1200} // Chậm và mượt
                                        autoplay={{
                                            delay: 3000, // Dừng đúng 3s
                                            disableOnInteraction: false,
                                            pauseOnMouseEnter: true,
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
                                        modules={[
                                            EffectCoverflow,
                                            Pagination,
                                            Autoplay,
                                        ]}
                                        className="mySwiper !pb-12"
                                        breakpoints={{
                                            640: { slidesPerView: 2 },
                                            768: { slidesPerView: 2 },
                                            1024: { slidesPerView: 3 },
                                        }}
                                        onSlideChange={(swiper) => {
                                            const realIndex = swiper.realIndex;
                                            if (featuredBooks[realIndex])
                                                setActiveHeroBook(
                                                    featuredBooks[realIndex]
                                                );
                                        }}
                                    >
                                        {featuredBooks.map((book, index) => (
                                            <SwiperSlide
                                                key={book.idBook}
                                                className="!w-[200px] sm:!w-[230px]"
                                            >
                                                <BookCard
                                                    book={book}
                                                    onLike={toggleLike}
                                                    onClick={(id) =>
                                                        navigate(
                                                            `/detail/${id}`
                                                        )
                                                    }
                                                    rank={index + 1}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}
                        </section>

                        {/* NEW BOOKS SECTION */}
                        {!searchBooks && (
                            <section>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-8 bg-[#2D7D6E] rounded-full"></span>
                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Sách mới cập nhật
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => navigate('/new-books')}
                                        className="text-[#2D7D6E] font-semibold hover:underline flex items-center text-sm"
                                    >
                                        Xem tất cả{' '}
                                        <RightOutlined className="text-xs ml-1" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {latestBooks.map((book) => (
                                        <div
                                            key={book.idBook}
                                            className="hover:-translate-y-1 transition duration-300"
                                        >
                                            <BookCard
                                                book={book}
                                                onLike={toggleLike}
                                                onClick={(id) =>
                                                    navigate(`/detail/${id}`)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* RIGHT COLUMN - 4 CỘT (SIDEBAR - Đã thêm lại) */}
                    {!searchBooks && (
                        <div className="lg:col-span-4 space-y-8">
                            <div className="sticky top-24 space-y-8">
                                {/* Tác giả hàng đầu */}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-bold text-lg text-gray-800">
                                            Tác giả hàng đầu
                                        </h3>
                                        <button
                                            onClick={() => navigate('/author')}
                                            className="text-xs font-semibold text-gray-500 hover:text-[#153D36]"
                                        >
                                            Xem thêm
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {loading ? (
                                            <Skeleton active />
                                        ) : (
                                            authors.map((author) => (
                                                <div
                                                    key={author.idAuthor}
                                                    onClick={() =>
                                                        navigate(
                                                            `/authorInfo/${author.idAuthor}`
                                                        )
                                                    }
                                                    className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition"
                                                >
                                                    <Avatar
                                                        size={48}
                                                        src={author.urlAvatar}
                                                        className="border border-gray-200"
                                                        icon={<UserOutlined />}
                                                    />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 group-hover:text-[#153D36] transition-colors">
                                                            {author.nameAuthor}
                                                        </h4>
                                                        <span className="text-xs text-gray-400">
                                                            Đang cập nhật
                                                        </span>
                                                    </div>
                                                    <RightOutlined className="ml-auto text-gray-300 text-xs group-hover:text-[#153D36]" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Lịch sử mượn sách */}
                                <div className="bg-gradient-to-b from-[#153D36] to-[#11302b] rounded-2xl p-6 shadow-lg text-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <HistoryOutlined />
                                            <h3 className="font-bold text-lg">
                                                Mượn gần đây
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => navigate('/history')}
                                            className="text-xs font-semibold text-gray-300 hover:text-white"
                                        >
                                            Chi tiết
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {loading ? (
                                            <Skeleton
                                                active
                                                paragraph={{ rows: 2 }}
                                                title={false}
                                            />
                                        ) : loanHistory.length > 0 ? (
                                            loanHistory.map((item) => (
                                                <div
                                                    key={item.idBook}
                                                    onClick={() =>
                                                        navigate(
                                                            `/detail/${item.idBook}`
                                                        )
                                                    }
                                                    className="flex gap-3 items-center bg-white/10 p-2 rounded-lg hover:bg-white/20 transition cursor-pointer backdrop-blur-sm"
                                                >
                                                    <img
                                                        src={
                                                            item.avatarUrl ||
                                                            'https://via.placeholder.com/150'
                                                        }
                                                        className="w-10 h-14 object-cover rounded bg-gray-700"
                                                        alt=""
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium truncate text-gray-100">
                                                            {item.nameBook}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 truncate">
                                                            {item.genre ||
                                                                'Ngày mượn: ' +
                                                                    new Date().toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-400 text-sm">
                                                Chưa có lịch sử mượn sách
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserHomepage;
