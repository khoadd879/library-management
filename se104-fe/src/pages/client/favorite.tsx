import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoriteBooksAPI, addFavoriteBookAPI } from '@/services/api';
import {
    HeartFilled,
    SearchOutlined,
    BookOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { message, Skeleton, Button, Input, Empty, Tooltip } from 'antd';

// Interface (Giả định, dùng lại interface của bạn)
interface IBook {
    idBook: string;
    nameBook: string;
    image: string;
    authors?: { nameAuthor: string }[];
    reprintYear?: number;
    isLiked?: boolean;
}

const Favorite = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchFavoriteBooks();
    }, []);

    const fetchFavoriteBooks = async () => {
        try {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) {
                message.warning('Vui lòng đăng nhập để xem tủ sách.');
                return;
            }
            setLoading(true);
            const res = await getFavoriteBooksAPI(idUser);
            if (Array.isArray(res.data)) {
                // Đảm bảo đánh dấu là đã thích vì đây là trang Favorite
                const formattedData = res.data.map((b: IBook) => ({
                    ...b,
                    isLiked: true,
                }));
                setBooks(formattedData);
            }
        } catch (error) {
            console.error(error);
            message.error('Không thể tải tủ sách.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (
        bookId: string,
        event: React.MouseEvent
    ) => {
        event.stopPropagation(); // Ngăn chặn click vào card cha

        const idUser = localStorage.getItem('idUser');
        if (!idUser) return;

        // 1. OPTIMISTIC UPDATE: Xóa ngay trên UI để cảm giác mượt mà
        const previousBooks = [...books];
        setBooks((prev) => prev.filter((b) => b.idBook !== bookId));

        try {
            // 2. Gọi API thực tế
            await addFavoriteBookAPI(idUser, bookId);
            message.success('Đã xóa khỏi danh sách yêu thích');
        } catch (err) {
            // 3. Nếu lỗi thì hoàn tác lại danh sách cũ
            setBooks(previousBooks);
            message.error('Lỗi kết nối, vui lòng thử lại.');
        }
    };

    const filteredBooks = books.filter((b) =>
        b.nameBook.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-12">
            {/* HEADER */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500"
                        >
                            <ArrowLeftOutlined className="text-xl" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-[#153D36] flex items-center gap-2 m-0">
                                Tủ sách yêu thích{' '}
                                <HeartFilled className="text-red-500 text-xl animate-pulse" />
                            </h1>
                            <p className="text-xs text-gray-400 hidden sm:block">
                                Lưu giữ những tri thức bạn tâm đắc
                            </p>
                        </div>
                    </div>

                    <div className="relative max-w-md w-full hidden sm:block">
                        <Input
                            prefix={
                                <SearchOutlined className="text-gray-400" />
                            }
                            placeholder="Tìm kiếm trong tủ sách..."
                            className="rounded-full py-2 bg-gray-50 border-gray-200 hover:bg-white focus:bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </div>
                </div>
            </div>

            {/* MOBILE SEARCH (Chỉ hiện trên mobile) */}
            <div className="sm:hidden px-4 py-4 bg-white border-b border-gray-100">
                <Input
                    prefix={<SearchOutlined className="text-gray-400" />}
                    placeholder="Tìm kiếm sách..."
                    className="rounded-full py-2 bg-gray-50"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    // LOADING SKELETON
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton.Image
                                    active
                                    className="!w-full !h-60 rounded-xl"
                                />
                                <Skeleton
                                    active
                                    paragraph={{ rows: 1 }}
                                    title={{ width: '80%' }}
                                />
                            </div>
                        ))}
                    </div>
                ) : filteredBooks.length === 0 ? (
                    // EMPTY STATE
                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                        <Empty
                            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                            imageStyle={{ height: 160 }}
                            description={
                                <span className="text-gray-500 text-lg">
                                    {search
                                        ? 'Không tìm thấy sách phù hợp'
                                        : 'Bạn chưa yêu thích cuốn sách nào'}
                                </span>
                            }
                        >
                            {!search && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => navigate('/')}
                                    className="bg-[#153D36] hover:!bg-[#2D7D6E] h-12 px-8 rounded-xl font-semibold shadow-lg shadow-teal-900/20"
                                >
                                    Khám phá ngay
                                </Button>
                            )}
                        </Empty>
                    </div>
                ) : (
                    // BOOK GRID
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in-up">
                        {filteredBooks.map((book) => (
                            <div
                                key={book.idBook}
                                onClick={() =>
                                    navigate(`/detail/${book.idBook}`)
                                }
                                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
                            >
                                {/* Nút xóa (Hover mới hiện trên Desktop, luôn hiện trên Mobile) */}
                                <Tooltip title="Bỏ thích">
                                    <button
                                        onClick={(e) =>
                                            handleRemoveFavorite(book.idBook, e)
                                        }
                                        className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-red-500 shadow-md border border-red-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:scale-110"
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </Tooltip>

                                {/* Hình ảnh */}
                                <div className="aspect-[2/3] overflow-hidden rounded-xl bg-gray-100 relative mb-3">
                                    {book.image ? (
                                        <img
                                            src={book.image}
                                            alt={book.nameBook}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                            <BookOutlined className="text-4xl opacity-50 mb-2" />
                                            <span className="text-xs">
                                                No Cover
                                            </span>
                                        </div>
                                    )}
                                    {/* Overlay Gradient khi hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                {/* Thông tin sách */}
                                <div className="flex-1 flex flex-col">
                                    <Tooltip
                                        title={book.nameBook}
                                        mouseEnterDelay={0.5}
                                    >
                                        <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1 group-hover:text-[#153D36] transition-colors leading-snug">
                                            {book.nameBook}
                                        </h3>
                                    </Tooltip>

                                    <p className="text-xs text-gray-500 mb-2 truncate">
                                        {book.authors?.[0]?.nameAuthor ||
                                            'Tác giả ẩn danh'}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-50">
                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded">
                                            {book.reprintYear || 'N/A'}
                                        </span>
                                        <HeartFilled className="text-red-500 text-sm" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorite;
