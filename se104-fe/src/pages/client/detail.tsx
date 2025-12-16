import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    getBookAndCommentsByIdAPI,
    getStarByIdBookAPI,
    getAllComments,
    deleteCommentAPI,
} from '@/services/api';
import ReviewModal from '@/components/client/reviewPopUp';
import { message, Spin, Button, Avatar, Tag, Progress, Modal } from 'antd'; // Thêm Modal
import {
    ArrowLeftOutlined,
    StarFilled,
    UserOutlined,
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    FormOutlined,
    BookOutlined,
    CalendarOutlined,
    ReadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';

// Interface
interface IBookDetail extends IGetAllBookAndComment {
    pageCount?: number;
    language?: string;
}

const BookDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // --- STATE ---
    const [bookDetail, setBookDetail] = useState<IBookDetail | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null); // Để đóng/mở menu 3 chấm
    const [editComment, setEditComment] = useState<IComment | null>(null);
    const [loading, setLoading] = useState(true);
    const [showFullDesc, setShowFullDesc] = useState(false);

    const token = localStorage.getItem('token') || '';
    const idUser = localStorage.getItem('idUser') || '';

    // --- RATING DATA ---
    const [ratingData, setRatingData] = useState<{
        average: number;
        totalRatings: number;
        distribution: Record<1 | 2 | 3 | 4 | 5, number>;
    }>({
        average: 0,
        totalRatings: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    });

    const getPercent = (count: number) => {
        const total = Object.values(ratingData.distribution).reduce(
            (a, b) => a + b,
            0
        );
        return total > 0 ? Math.round((count / total) * 100) : 0;
    };

    // --- FETCHING ---
    const fetchBookData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getBookAndCommentsByIdAPI(token, id);
            const backendData = res.data;
            if (Array.isArray(backendData) && backendData.length > 0) {
                setBookDetail(backendData[0]);
            } else {
                setBookDetail(null);
            }
        } catch (error) {
            console.error('Lỗi lấy chi tiết sách:', error);
            setBookDetail(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchRatingData = async () => {
        if (!bookDetail?.idBook) return;
        try {
            const res = await getStarByIdBookAPI(bookDetail.idBook);
            const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };
            let total = 0;
            let sum = 0;
            if (res.data && Array.isArray(res.data)) {
                res.data.forEach((entry) => {
                    const s = entry.star as 1 | 2 | 3 | 4 | 5;
                    if ([1, 2, 3, 4, 5].includes(s)) {
                        distribution[s] = entry.status;
                        total += entry.status;
                        sum += s * entry.status;
                    }
                });
            }
            setRatingData({
                average: total > 0 ? sum / total : 0,
                totalRatings: total,
                distribution,
            });
        } catch (error) {}
    };

    const fetchCommentsData = async () => {
        if (!id) return;
        try {
            const res = await getAllComments(id);
            setComments(res.data || []);
        } catch (error) {
            setComments([]);
        }
    };

    useEffect(() => {
        fetchBookData();
    }, [id]);
    useEffect(() => {
        fetchRatingData();
    }, [bookDetail]);
    useEffect(() => {
        fetchCommentsData();
    }, [id]);

    const refreshAll = () => {
        fetchCommentsData();
        fetchRatingData();
    };

    // --- HANDLERS (LOGIC CŨ + UI MỚI) ---

    // 1. Xử lý mở Modal Edit
    const handleEdit = (idComment: string) => {
        const cmt = comments.find((c) => c.idEvaluation === idComment);
        if (cmt) {
            setEditComment(cmt); // Lưu data comment cần sửa
            setShowModal(true); // Mở modal
        }
        setActiveMenu(null); // Đóng menu 3 chấm
    };

    // 2. Xử lý Delete (Dùng Modal.confirm của Antd cho đẹp)
    const handleDelete = (idComment: string) => {
        setActiveMenu(null); // Đóng menu ngay lập tức

        Modal.confirm({
            title: 'Xóa nhận xét?',
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            content:
                'Bạn có chắc chắn muốn xóa nhận xét này không? Hành động này không thể hoàn tác.',
            okText: 'Xóa ngay',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    if (!idUser) return message.error('Vui lòng đăng nhập');
                    await deleteCommentAPI(idComment, idUser); // API Cũ
                    message.success('Đã xóa nhận xét thành công');

                    // Cập nhật lại UI ngay lập tức
                    setComments((prev) =>
                        prev.filter((c) => c.idEvaluation !== idComment)
                    );
                    fetchRatingData(); // Tính lại sao
                } catch (error) {
                    message.error('Có lỗi xảy ra khi xóa nhận xét');
                }
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#F8FAFC]">
                <Spin
                    size="large"
                    tip="Đang tải thông tin sách..."
                    className="text-[#153D36]"
                />
            </div>
        );
    }

    if (!bookDetail) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] gap-4">
                <ReadOutlined className="text-6xl text-gray-300" />
                <p className="text-gray-500 text-lg font-medium">
                    Không tìm thấy thông tin sách.
                </p>
                <Button
                    type="primary"
                    className="bg-[#153D36]"
                    onClick={() => navigate('/')}
                >
                    Về trang chủ
                </Button>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-[#F8FAFC] font-sans pb-20"
            onClick={() => setActiveMenu(null)}
        >
            {/* HERO BANNER */}
            <div className="relative h-[400px] md:h-[480px] overflow-hidden bg-[#153D36]">
                {bookDetail.image && (
                    <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110 transform transition-transform duration-1000"
                        style={{ backgroundImage: `url(${bookDetail.image})` }}
                    ></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-[#153D36]/80 via-[#153D36]/90 to-[#F8FAFC]"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 bg-black/20 hover:bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full w-fit"
                    >
                        <ArrowLeftOutlined className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Quay lại</span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-[280px] md:-mt-[320px]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-fade-in-up">
                    {/* LEFT COLUMN: Book Cover */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="bg-white p-2 rounded-3xl shadow-2xl shadow-black/10 relative group perspective-1000">
                                <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-gray-200 relative z-10">
                                    {bookDetail.image ? (
                                        <img
                                            src={bookDetail.image}
                                            alt={bookDetail.nameBook}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                            <BookOutlined className="text-4xl opacity-50" />
                                            <span>No Cover</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute top-full inset-x-4 h-8 bg-gradient-to-b from-black/5 to-transparent blur-md rounded-b-3xl -mt-2 z-0"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-row items-center justify-between px-6 text-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-[#2D7D6E]">
                                            <CalendarOutlined className="text-xl" />
                                        </div>
                                        <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                                            Năm XB
                                        </span>
                                    </div>
                                    <span className="font-bold text-[#153D36] text-lg">
                                        {bookDetail.reprintYear}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Details */}
                    <div className="lg:col-span-8 xl:col-span-9 space-y-8 pt-4 lg:pt-12">
                        {/* Title & Author */}
                        <div className="mb-10">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <Tag
                                    color="rgba(255,255,255,0.2)"
                                    className="text-white backdrop-blur-md border-none px-3 py-1 font-semibold tracking-wider uppercase"
                                >
                                    Sách in
                                </Tag>
                                {ratingData.totalRatings > 0 && (
                                    <Tag
                                        color="#fadb14"
                                        className="text-black border-none px-3 py-1 font-bold flex items-center gap-1"
                                    >
                                        <StarFilled />{' '}
                                        {ratingData.average.toFixed(1)}
                                    </Tag>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-sm">
                                {bookDetail.nameBook}
                            </h1>
                            <div className="flex items-center gap-3 text-white/90 text-lg">
                                <span className="opacity-70">Tác giả:</span>
                                <div className="flex flex-wrap gap-2">
                                    {(bookDetail.authors || []).map(
                                        (a, index) => (
                                            <span
                                                key={index}
                                                className="font-bold hover:text-[#fadb14] transition cursor-pointer underline-offset-4 hover:underline"
                                            >
                                                {a.nameAuthor}
                                                {index <
                                                (bookDetail.authors || [])
                                                    .length -
                                                    1
                                                    ? ', '
                                                    : ''}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-8 rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-100/50">
                            <h3 className="text-xl font-bold text-[#153D36] mb-4 flex items-center gap-2">
                                <ReadOutlined /> Giới thiệu nội dung
                            </h3>
                            <div className="relative">
                                <div
                                    className={`text-gray-600 leading-relaxed text-[16px] whitespace-pre-line transition-all duration-500 ${
                                        !showFullDesc
                                            ? 'max-h-[180px] overflow-hidden'
                                            : 'max-h-[2000px]'
                                    }`}
                                >
                                    {bookDetail.describe ||
                                        'Đang cập nhật mô tả cho cuốn sách này...'}
                                </div>
                                {!showFullDesc &&
                                    bookDetail.describe &&
                                    bookDetail.describe.length > 300 && (
                                        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                                    )}
                            </div>
                            {bookDetail.describe &&
                                bookDetail.describe.length > 300 && (
                                    <button
                                        onClick={() =>
                                            setShowFullDesc(!showFullDesc)
                                        }
                                        className="mt-4 text-[#2D7D6E] font-bold hover:underline flex items-center gap-1 group"
                                    >
                                        {showFullDesc ? 'Thu gọn' : 'Đọc tiếp'}
                                        <ArrowLeftOutlined
                                            rotate={showFullDesc ? 90 : 270}
                                            className="text-xs transition-transform group-hover:translate-y-0.5"
                                        />
                                    </button>
                                )}
                        </div>

                        {/* Ratings */}
                        <div className="grid md:grid-cols-5 gap-6">
                            <div className="md:col-span-2 bg-gradient-to-br from-[#153D36] to-[#0D2621] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                                <div>
                                    <h3 className="text-lg font-medium text-white/80 mb-4">
                                        Đánh giá từ độc giả
                                    </h3>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-6xl font-extrabold tracking-tighter">
                                            {ratingData.average.toFixed(1)}
                                        </span>
                                        <span className="text-2xl text-white/60">
                                            /5
                                        </span>
                                    </div>
                                    <div className="flex gap-1 text-[#fadb14] text-2xl mb-4">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <StarFilled
                                                key={i}
                                                className={
                                                    i <
                                                    Math.round(
                                                        ratingData.average
                                                    )
                                                        ? ''
                                                        : 'text-white/20'
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-white/70 font-medium">
                                    {ratingData.totalRatings} lượt đánh giá
                                </p>
                            </div>

                            <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-100/50 flex flex-col justify-center">
                                <div className="space-y-4 mb-8">
                                    {[5, 4, 3, 2, 1].map((star) => (
                                        <div
                                            key={star}
                                            className="flex items-center gap-4"
                                        >
                                            <div className="flex items-center gap-1 w-12 font-bold text-gray-700">
                                                {star}{' '}
                                                <StarFilled className="text-yellow-400 text-sm" />
                                            </div>
                                            <Progress
                                                percent={getPercent(
                                                    ratingData.distribution[
                                                        star as
                                                            | 1
                                                            | 2
                                                            | 3
                                                            | 4
                                                            | 5
                                                    ]
                                                )}
                                                strokeColor="#2D7D6E"
                                                trailColor="#F1F5F9"
                                                showInfo={false}
                                                size={['100%', 8]}
                                                className="flex-1 m-0"
                                            />
                                            <div className="w-10 text-right font-medium text-gray-500">
                                                {
                                                    ratingData.distribution[
                                                        star as
                                                            | 1
                                                            | 2
                                                            | 3
                                                            | 4
                                                            | 5
                                                    ]
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    type="primary"
                                    icon={<FormOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowModal(true);
                                        setEditComment(null);
                                    }}
                                    size="large"
                                    className="bg-[#153D36] hover:!bg-[#2D7D6E] border-none rounded-xl h-12 font-bold shadow-md hover:shadow-lg transition-all w-full md:w-auto"
                                >
                                    Viết đánh giá của bạn
                                </Button>
                            </div>
                        </div>

                        {/* COMMENTS LIST */}
                        {/* QUAN TRỌNG: Không được có overflow-hidden ở đây */}
                        <div className="bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-gray-100/50">
                            <div className="p-8 border-b border-gray-100 flex items-center gap-3">
                                <div className="bg-teal-50 p-2 rounded-full text-[#153D36]">
                                    <MoreOutlined className="text-xl" />
                                </div>
                                <h3 className="text-xl font-bold text-[#153D36] m-0">
                                    Cộng đồng thảo luận ({comments.length})
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {comments.length === 0 ? (
                                    <div className="p-12 text-center flex flex-col items-center text-gray-400 gap-4">
                                        <FormOutlined className="text-4xl opacity-30" />
                                        <p className="text-lg">
                                            Chưa có nhận xét nào. Hãy là người
                                            đầu tiên!
                                        </p>
                                    </div>
                                ) : (
                                    comments.map((cmt) => (
                                        <div
                                            key={cmt.idEvaluation}
                                            className="p-8 hover:bg-[#F8FAFC] transition-colors relative group"
                                        >
                                            <div className="flex gap-5">
                                                <Avatar
                                                    size={56}
                                                    src={cmt.avatarUrl}
                                                    icon={<UserOutlined />}
                                                    className="flex-shrink-0 bg-gray-200 border-2 border-white shadow-sm"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-gray-900 text-[17px] mb-1">
                                                                {cmt.nameReader ||
                                                                    'Độc giả ẩn danh'}
                                                            </h4>
                                                            <div className="flex text-[#fadb14] text-sm gap-0.5">
                                                                {Array.from(
                                                                    {
                                                                        length: 5,
                                                                    },
                                                                    (_, i) => (
                                                                        <StarFilled
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={
                                                                                i <
                                                                                cmt.star
                                                                                    ? ''
                                                                                    : 'text-gray-300'
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* MENU 3 CHẤM - CHỈ HIỆN VỚI CHỦ SỞ HỮU */}
                                                        {String(idUser) ===
                                                            String(
                                                                cmt.idReader
                                                            ) && (
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        setActiveMenu(
                                                                            activeMenu ===
                                                                                cmt.idEvaluation
                                                                                ? null
                                                                                : cmt.idEvaluation
                                                                        );
                                                                    }}
                                                                    className={`p-2 rounded-full transition ${
                                                                        activeMenu ===
                                                                        cmt.idEvaluation
                                                                            ? 'bg-gray-100 text-[#153D36]'
                                                                            : 'text-gray-400 hover:text-[#153D36] hover:bg-gray-100'
                                                                    }`}
                                                                >
                                                                    <MoreOutlined className="text-xl" />
                                                                </button>

                                                                {activeMenu ===
                                                                    cmt.idEvaluation && (
                                                                    <div
                                                                        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-2 animate-fade-in origin-top-right"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            e.stopPropagation()
                                                                        } // Chặn click xuyên
                                                                    >
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEdit(
                                                                                    cmt.idEvaluation
                                                                                )
                                                                            }
                                                                            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#153D36] flex items-center gap-3 transition-colors"
                                                                        >
                                                                            <EditOutlined />{' '}
                                                                            Chỉnh
                                                                            sửa
                                                                        </button>
                                                                        <div className="my-1 border-t border-gray-50"></div>
                                                                        <button
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    cmt.idEvaluation
                                                                                )
                                                                            }
                                                                            className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                                        >
                                                                            <DeleteOutlined />{' '}
                                                                            Xóa
                                                                            nhận
                                                                            xét
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="mt-3 text-gray-700 leading-relaxed text-[16px] bg-gray-50/50 p-4 rounded-2xl rounded-tl-none">
                                                        {cmt.comment}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL REVIEW CŨ */}
            {showModal && bookDetail && (
                <ReviewModal
                    bookId={bookDetail.idBook}
                    onClose={() => {
                        setShowModal(false);
                        setEditComment(null);
                        refreshAll();
                    }}
                    // TRUYỀN DATA ĐÚNG NHƯ CODE CŨ CỦA BẠN
                    editData={
                        editComment
                            ? {
                                  idComment: editComment.idEvaluation,
                                  comment: editComment.comment,
                                  rate: editComment.star,
                              }
                            : undefined
                    }
                />
            )}
        </div>
    );
};

export default BookDetailPage;
