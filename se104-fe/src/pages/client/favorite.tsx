import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoriteBooksAPI, addFavoriteBookAPI } from '@/services/api';
import {
    HeartFilled,
    SearchOutlined,
    BookOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    StarFilled,
} from '@ant-design/icons';
import { message, Skeleton, Button, Tooltip, Modal } from 'antd';

interface IBook {
    idBook: string;
    nameBook: string;
    image: string;
    authors?: { nameAuthor: string }[];
    reprintYear?: number;
    isLiked?: boolean;
    valueOfbook?: number;
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
        bookName: string,
        event: React.MouseEvent
    ) => {
        event.stopPropagation();

        Modal.confirm({
            title: 'Xác nhận xóa',
            content: `Bạn có chắc muốn xóa "${bookName}" khỏi danh sách yêu thích?`,
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: { danger: true },
            onOk: async () => {
                const idUser = localStorage.getItem('idUser');
                if (!idUser) return;

                const previousBooks = [...books];
                setBooks((prev) => prev.filter((b) => b.idBook !== bookId));

                try {
                    await addFavoriteBookAPI(idUser, bookId);
                    message.success('Đã xóa khỏi danh sách yêu thích');
                } catch (err) {
                    setBooks(previousBooks);
                    message.error('Lỗi kết nối, vui lòng thử lại.');
                }
            },
        });
    };

    const filteredBooks = books.filter((b) =>
        b.nameBook.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-[#153D36] via-[#1E5D4A] to-[#2D7D6E] sticky top-0 z-20 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition text-white backdrop-blur-sm"
                            >
                                <ArrowLeftOutlined className="text-lg" />
                            </button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 m-0">
                                    Tủ sách yêu thích
                                    <span className="relative">
                                        <HeartFilled className="text-red-400 text-2xl animate-pulse" />
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
                                    </span>
                                </h1>
                                <p className="text-emerald-200 text-sm mt-1 hidden sm:block">
                                    {books.length} cuốn sách trong bộ sưu tập của bạn
                                </p>
                            </div>
                        </div>

                        {/* Desktop Search */}
                        <div className="relative max-w-md w-full hidden sm:block">
                            <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm trong tủ sách..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-4 focus:ring-white/30 transition-all duration-200 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="sm:hidden px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
                <div className="relative">
                    <SearchOutlined className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all duration-200"
                    />
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
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
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center mb-6">
                            <HeartFilled className="text-6xl text-rose-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">
                            {search ? 'Không tìm thấy sách' : 'Tủ sách trống'}
                        </h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            {search
                                ? 'Thử tìm kiếm với từ khóa khác'
                                : 'Bạn chưa thêm cuốn sách nào vào danh sách yêu thích. Hãy khám phá và lưu lại những cuốn sách bạn yêu thích!'}
                        </p>
                        {!search && (
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => navigate('/')}
                                className="bg-gradient-to-r from-[#153D36] to-[#2D7D6E] border-none h-12 px-8 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                🔍 Khám phá sách ngay
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Stats Bar */}
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <p className="text-gray-600">
                                Hiển thị <span className="font-semibold text-emerald-600">{filteredBooks.length}</span> cuốn sách
                                {search && <span className="text-gray-400"> cho "{search}"</span>}
                            </p>
                        </div>

                        {/* Book Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {filteredBooks.map((book, index) => (
                                <div
                                    key={book.idBook}
                                    onClick={() => navigate(`/detail/${book.idBook}`)}
                                    className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                                    style={{
                                        animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                                    }}
                                >
                                    {/* Remove Button */}
                                    <Tooltip title="Bỏ thích">
                                        <button
                                            onClick={(e) =>
                                                handleRemoveFavorite(book.idBook, book.nameBook, e)
                                            }
                                            className="absolute top-3 right-3 z-20 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-md rounded-full text-gray-400 shadow-lg border border-gray-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-500 hover:scale-110 hover:border-red-200"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Tooltip>

                                    {/* Heart Badge */}
                                    <div className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-red-500 rounded-full shadow-lg">
                                        <HeartFilled className="text-white text-sm" />
                                    </div>

                                    {/* Image */}
                                    <div className="aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 relative">
                                        {book.image ? (
                                            <img
                                                src={book.image}
                                                alt={book.nameBook}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <BookOutlined className="text-5xl opacity-40 mb-2" />
                                                <span className="text-xs opacity-60">No Cover</span>
                                            </div>
                                        )}
                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Hover Info */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                            <p className="text-white text-xs font-medium truncate">
                                                {book.authors?.[0]?.nameAuthor || 'Tác giả ẩn danh'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Book Info */}
                                    <div className="p-3">
                                        <Tooltip title={book.nameBook} mouseEnterDelay={0.5}>
                                            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors duration-300 leading-tight min-h-[2.5rem]">
                                                {book.nameBook}
                                            </h3>
                                        </Tooltip>

                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md">
                                                {book.reprintYear || 'N/A'}
                                            </span>
                                            {book.valueOfbook && (
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <StarFilled className="text-xs" />
                                                    <span className="text-xs font-semibold">
                                                        {book.valueOfbook.toLocaleString()}đ
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Custom Styles */}
            <style>{`
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
            `}</style>
        </div>
    );
};

export default Favorite;
