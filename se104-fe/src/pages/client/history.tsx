import { useEffect, useState } from 'react';
import { getLoanSlipHistoryAPI } from '@/services/api';
import { message, Spin, Empty, Tag } from 'antd';
import {
    CalendarOutlined,
    BookOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Định nghĩa lại Interface khớp với JSON trả về
interface ILoanHistory {
    idBook: string;
    nameBook: string;
    genre: string;
    dateBorrow: string;
    dateReturn: string;
    avatarUrl: string;
    isReturned: boolean;
}

const History = () => {
    const [history, setHistory] = useState<ILoanHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) {
                // Tắt thông báo lỗi nếu muốn trải nghiệm mượt hơn khi chưa login
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await getLoanSlipHistoryAPI(idUser);

                // LOGIC FIX: Dữ liệu nằm trong res.data
                if (res && res.data && Array.isArray(res.data)) {
                    setHistory(res.data);
                } else if (Array.isArray(res)) {
                    // Fallback trường hợp API trả về mảng trực tiếp
                    setHistory(res);
                }
            } catch (err) {
                console.error('Lỗi khi tải lịch sử mượn:', err);
                message.error('Không thể tải dữ liệu.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Helper tính số ngày còn lại hoặc quá hạn
    const renderTimeStatus = (dateReturn: string, isReturned: boolean) => {
        if (isReturned) return null;

        const today = dayjs();
        const returnDay = dayjs(dateReturn);
        const diff = returnDay.diff(today, 'day');

        if (diff < 0) {
            return (
                <span className="text-red-500 text-xs font-semibold">
                    Quá hạn {Math.abs(diff)} ngày
                </span>
            );
        }
        return (
            <span className="text-emerald-600 text-xs font-semibold">
                Còn {diff} ngày
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
            {/* Background Decoration (Giống Profile Page để đồng bộ) */}
            <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-emerald-50 to-slate-50 -z-10"></div>
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10"></div>
            <div className="absolute top-[20%] left-[-5%] w-72 h-72 bg-teal-100/40 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
                {/* Header */}
                <div className="mb-10 text-center animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-slate-800 flex justify-center items-center gap-3">
                        <BookOutlined className="text-emerald-600" />
                        Lịch sử mượn sách
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Theo dõi quá trình mượn và trả sách của bạn
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="h-64 flex flex-col justify-center items-center gap-4 animate-fade-in">
                        <Spin size="large" className="text-emerald-600" />
                        <p className="text-slate-400 text-sm">
                            Đang tải dữ liệu...
                        </p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="flex justify-center items-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
                        <Empty
                            description={
                                <span className="text-slate-400">
                                    Bạn chưa mượn cuốn sách nào
                                </span>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex gap-4 animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Book Cover Image */}
                                <div className="w-24 h-36 flex-shrink-0 rounded-lg overflow-hidden shadow-md relative group-hover:scale-105 transition-transform duration-300">
                                    {item.avatarUrl ? (
                                        <img
                                            src={item.avatarUrl}
                                            alt={item.nameBook}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                            <BookOutlined className="text-2xl" />
                                        </div>
                                    )}
                                    {/* Genre overlay tag */}
                                    <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-sm p-1 text-center">
                                        <span className="text-[10px] text-white font-medium uppercase tracking-wider block truncate">
                                            {item.genre}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Column */}
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
                                            {item.nameBook}
                                        </h3>

                                        {/* Status Badge */}
                                        <div className="mb-3">
                                            {item.isReturned ? (
                                                <Tag
                                                    icon={
                                                        <CheckCircleOutlined />
                                                    }
                                                    color="success"
                                                    className="rounded-full px-2 border-0 bg-emerald-50 text-emerald-600 m-0"
                                                >
                                                    Đã trả xong
                                                </Tag>
                                            ) : (
                                                <Tag
                                                    icon={<SyncOutlined spin />}
                                                    color="warning"
                                                    className="rounded-full px-2 border-0 bg-amber-50 text-amber-600 m-0"
                                                >
                                                    Đang mượn
                                                </Tag>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dates Info */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <CalendarOutlined /> Mượn:
                                            </span>
                                            <span className="font-semibold text-slate-700">
                                                {dayjs(item.dateBorrow).format(
                                                    'DD/MM/YYYY'
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <ClockCircleOutlined /> Hạn trả:
                                            </span>
                                            <span
                                                className={`font-semibold ${
                                                    item.isReturned
                                                        ? 'text-slate-700'
                                                        : 'text-emerald-600'
                                                }`}
                                            >
                                                {dayjs(item.dateReturn).format(
                                                    'DD/MM/YYYY'
                                                )}
                                            </span>
                                        </div>

                                        {/* Status Text (Overdue/Remaining) */}
                                        {!item.isReturned && (
                                            <div className="pt-2 mt-1 border-t border-slate-100 flex justify-end">
                                                {renderTimeStatus(
                                                    item.dateReturn,
                                                    item.isReturned
                                                )}
                                            </div>
                                        )}
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

export default History;
