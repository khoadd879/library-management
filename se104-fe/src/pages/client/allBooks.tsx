import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { getAllBooksAndCommentsAPI, getTypeBooksWithCountAPI, addFavoriteBookAPI } from '@/services/api';
import { message, Spin, Pagination, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BookOutlined, SearchOutlined, FilterOutlined, ReloadOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';


const AllBooks = () => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(24);
    const [sortBy, setSortBy] = useState<'name' | 'year' | 'newest'>('name');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // Multi-select
    const [typeBooksWithCount, setTypeBooksWithCount] = useState<Array<{ idTypeBook: string; nameTypeBook: string; bookCount: number }>>([]); // TypeBooks từ API với count
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const goToBookDetail = (idBook: string) => {
        navigate(`/detail/${idBook}`);
    };

    // Toggle favorite/like book
    const toggleLike = async (bookId: string) => {
        try {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) return message.error('Vui lòng đăng nhập!');
            const res = await addFavoriteBookAPI(idUser, bookId);
            if (res) {
                setBooks((prev) =>
                    prev.map((b) =>
                        b.idBook === bookId ? { ...b, isLiked: !b.isLiked } : b
                    )
                );
                message.success('Đã cập nhật yêu thích');
            }
        } catch (err) {
            message.error('Lỗi thao tác');
        }
    };

    // Fetch books from API
    const fetchBooks = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const idUser = localStorage.getItem('idUser');
            if (!token || !idUser) {
                message.warning('Vui lòng đăng nhập.');
                setLoading(false);
                return;
            }

            console.log('🔄 [AllBooks] Đang tải sách từ API...');
            const res = await getAllBooksAndCommentsAPI(idUser);
            if (Array.isArray(res.data)) {
                setBooks(res.data);
            } else {
                message.error('Không có dữ liệu sách');
            }
        } catch (err) {
            console.error('Lỗi khi tải sách:', err);
            message.error('Không thể tải danh sách sách.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
        // Fetch TypeBooks với count từ API
        const fetchTypeBooks = async () => {
            try {
                const res = await getTypeBooksWithCountAPI();
                // API trả về { success, message, statusCode, data: [{ idTypeBook, nameTypeBook, bookCount }] }
                const typeBookData = res?.data?.data || res?.data;
                if (typeBookData && Array.isArray(typeBookData)) {
                    setTypeBooksWithCount(typeBookData);
                }
            } catch (err) {
                console.error('Lỗi khi tải thể loại:', err);
            }
        };
        fetchTypeBooks();
    }, [fetchBooks]);

    // Filter, search và sort
    const processedBooks = useMemo(() => {
        let result = [...books];

        // Filter theo thể loại (multi-select)
        if (selectedTypes.length > 0) {
            result = result.filter(book => {
                const typeName = book.authors?.[0]?.idTypeBook?.nameTypeBook;
                return typeName && selectedTypes.includes(typeName);
            });
        }

        // Search
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(book =>
                book.nameBook.toLowerCase().includes(searchLower) ||
                book.authors?.some(a => a.nameAuthor.toLowerCase().includes(searchLower))
            );
        }

        // Sort
        switch (sortBy) {
            case 'name':
                result.sort((a, b) => a.nameBook.localeCompare(b.nameBook, 'vi'));
                break;
            case 'year':
                result.sort((a, b) => (b.reprintYear || 0) - (a.reprintYear || 0));
                break;
            case 'newest':
                result.reverse(); // Giả sử sách mới nhất ở cuối
                break;
        }

        return result;
    }, [books, search, sortBy, selectedTypes]);

    // Pagination
    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return processedBooks.slice(start, start + pageSize);
    }, [processedBooks, currentPage, pageSize]);

    // Reset về trang 1 khi filter/search thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortBy, selectedTypes]);

    // Scroll to top khi đổi trang
    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size && size !== pageSize) setPageSize(size);
        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-[#f4f7f9] to-[#e8f5f0] px-4 md:px-12 py-6 w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#153D36] to-[#1E5D4A] px-6 py-5 rounded-t-2xl shadow-lg">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <BookOutlined className="text-2xl text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Tất cả sách</h2>
                            <p className="text-white/70 text-sm">
                                {processedBooks.length} cuốn sách {selectedTypes.length > 0 && `trong ${selectedTypes.length} thể loại`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 lg:flex-none">
                            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm sách, tác giả..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full lg:w-[280px] pl-10 pr-4 py-2.5 rounded-xl text-black outline-none text-sm bg-white focus:ring-2 focus:ring-emerald-400 transition"
                            />
                        </div>

                        {/* Filter by type - Multi-select */}
                        <Select
                            mode="multiple"
                            value={selectedTypes}
                            onChange={setSelectedTypes}
                            className="min-w-[200px] max-w-[350px]"
                            size="large"
                            placeholder="Chọn thể loại..."
                            maxTagCount={2}
                            maxTagPlaceholder={(omitted) => `+${omitted.length} thể loại`}
                            suffixIcon={<FilterOutlined />}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                            options={typeBooksWithCount.map((type) => ({
                                value: type.nameTypeBook,
                                label: `${type.nameTypeBook} (${type.bookCount})`
                            }))}
                        />

                        {/* Sort */}
                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            className="w-[140px]"
                            size="large"
                            options={[
                                { value: 'name', label: '🔤 Tên A-Z' },
                                { value: 'year', label: '📅 Năm mới' },
                                { value: 'newest', label: '✨ Mới nhất' },
                            ]}
                        />

                        {/* Refresh */}
                        <button
                            onClick={() => fetchBooks()}
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition"
                            title="Tải lại dữ liệu"
                        >
                            <ReloadOutlined className="text-white text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white shadow-xl rounded-b-2xl p-6 min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
                        <Spin size="large" />
                        <p className="text-gray-500">Đang tải sách...</p>
                    </div>
                ) : paginatedBooks.length > 0 ? (
                    <>
                        {/* Book Grid với lazy loading images */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                            {paginatedBooks.map((book, index) => (
                                <div
                                    key={book.idBook}
                                    className="rounded-xl shadow-md bg-white border border-gray-100 p-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                    onClick={() => goToBookDetail(book.idBook)}
                                    style={{
                                        animation: `fadeInUp 0.4s ease-out ${Math.min(index * 0.05, 0.5)}s both`,
                                    }}
                                >
                                    <div className="w-full aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden mb-3 flex items-center justify-center relative">
                                        {book.image ? (
                                            <img
                                                src={book.image}
                                                alt={book.nameBook}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <BookOutlined className="text-4xl opacity-40" />
                                                <span className="text-xs mt-1 opacity-60">No Cover</span>
                                            </div>
                                        )}
                                        {/* Like button */}
                                        <div
                                            className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md cursor-pointer hover:bg-red-50 hover:scale-110 transition-all duration-300 z-10"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(book.idBook);
                                            }}
                                        >
                                            {book.isLiked ? (
                                                <HeartFilled className="text-red-500" />
                                            ) : (
                                                <HeartOutlined className="text-gray-400 hover:text-red-400" />
                                            )}
                                        </div>
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                            <span className="text-white text-xs font-medium">Xem chi tiết →</span>
                                        </div>
                                    </div>
                                    <p className="text-sm font-semibold truncate text-[#153D36] group-hover:text-emerald-600 transition-colors">
                                        {book.nameBook}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-1">
                                        {book.authors?.[0]?.nameAuthor || 'Không rõ tác giả'}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-400">
                                            {book.reprintYear || '0.0'}
                                        </span>
                                        {book.authors?.[0]?.idTypeBook?.nameTypeBook && (
                                            <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full truncate max-w-[80px]">
                                                {book.authors[0].idTypeBook.nameTypeBook}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={processedBooks.length}
                                onChange={handlePageChange}
                                showSizeChanger
                                showQuickJumper
                                pageSizeOptions={['12', '24', '48', '96']}
                                showTotal={(total, range) => (
                                    <span className="text-gray-600">
                                        {range[0]}-{range[1]} / {total} sách
                                    </span>
                                )}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                            <BookOutlined className="text-4xl text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600">Không tìm thấy sách</h3>
                        <p className="text-gray-400 text-center max-w-md">
                            {search
                                ? `Không có sách nào khớp với "${search}"`
                                : 'Không có sách nào trong thư viện'
                            }
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                            >
                                Xóa tìm kiếm
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Animation styles */}
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

export default AllBooks;
