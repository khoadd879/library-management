import { useEffect, useState } from 'react';
import { message, Modal, Tag, Tooltip, Empty, Spin } from 'antd';
import { getLoanSlipHistoryAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';
import {
    FaInfoCircle,
    FaCalendarAlt,
    FaBook,
    FaHistory,
    FaCheckCircle,
    FaClock,
} from 'react-icons/fa';

const UserBorrows = () => {
    const { user } = useCurrentApp();
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<any | null>(null);

    // Một useEffect duy nhất để fetch data
    useEffect(() => {
        const fetchData = async () => {
            if (!user?.data?.idReader) {
                setLoading(false);
                return;
            }
            try {
                const res = await getLoanSlipHistoryAPI(user.data.idReader);
                // Xử lý dữ liệu linh hoạt tùy theo cấu trúc trả về của API
                const finalData = res?.data ?? res ?? [];
                setLoans(Array.isArray(finalData) ? finalData : []);
            } catch (err) {
                message.error('Không thể tải lịch sử mượn sách');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '---';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const getStatusTag = (dateReturn: string | null) => {
        if (!dateReturn) {
            return (
                <Tag
                    color="processing"
                    icon={<FaClock className="inline mr-1 mb-0.5" />}
                    className="text-[10px] sm:text-xs"
                >
                    Đang mượn
                </Tag>
            );
        }
        return (
            <Tag
                color="success"
                icon={<FaCheckCircle className="inline mr-1 mb-0.5" />}
                className="text-[10px] sm:text-xs"
            >
                Đã trả
            </Tag>
        );
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Area - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FaHistory className="text-[#153D36] text-base sm:text-lg md:text-xl" />
                        <span className="hidden sm:inline">LỊCH SỬ MƯỢN SÁCH</span>
                        <span className="sm:hidden">LỊCH SỬ MƯỢN</span>
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">
                        Xem lại danh sách và trạng thái các cuốn sách bạn đã mượn
                    </p>
                </div>
                <div className="bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-sm border border-slate-100">
                    <span className="text-slate-500 text-xs sm:text-sm font-medium">
                        Tổng:{' '}
                    </span>
                    <span className="text-[#153D36] font-bold text-sm sm:text-base">
                        {loans.length}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-400 animate-pulse text-sm">
                            Đang truy xuất dữ liệu...
                        </p>
                    </div>
                ) : loans.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Sách
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                                        Thể loại
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                                        Thời gian
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        TT
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <span className="hidden sm:inline">Chi tiết</span>
                                        <span className="sm:hidden">CT</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {loans.map((item, index) => (
                                    <tr
                                        key={item.idBook + index}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-400 font-medium">
                                            {(index + 1)
                                                .toString()
                                                .padStart(2, '0')}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-7 sm:h-14 sm:w-10 flex-shrink-0 mr-2 sm:mr-4 hidden xs:block">
                                                    {item.avatarUrl ? (
                                                        <img
                                                            className="h-full w-full object-cover rounded shadow-sm group-hover:scale-105 transition-transform"
                                                            src={item.avatarUrl}
                                                            alt=""
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-slate-100 rounded flex items-center justify-center text-slate-300">
                                                            <FaBook size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs sm:text-sm font-bold text-slate-700 leading-tight mb-0.5 sm:mb-1 line-clamp-2">
                                                        {item.nameBook}
                                                    </div>
                                                    <div className="text-[10px] sm:text-xs text-slate-400 italic truncate">
                                                        Mã: {item.idBook}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] sm:text-[11px] font-semibold uppercase">
                                                {item.genre}
                                            </span>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-xs text-slate-600 hidden sm:table-cell">
                                            <div className="flex flex-col gap-0.5 sm:gap-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-emerald-600 font-medium">
                                                        Mượn:
                                                    </span>{' '}
                                                    {formatDate(
                                                        item.dateBorrow
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-rose-500 font-medium">
                                                        Hạn:
                                                    </span>{' '}
                                                    {formatDate(
                                                        item.dateReturn
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                            {getStatusTag(item.dateReturn)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center">
                                            <Tooltip title="Xem chi tiết">
                                                <button
                                                    onClick={() => {
                                                        setSelectedLoan(item);
                                                        setIsModalVisible(true);
                                                    }}
                                                    className="p-1.5 sm:p-2 text-slate-400 hover:text-[#153D36] hover:bg-emerald-50 rounded-full transition-all"
                                                >
                                                    <FaInfoCircle size={14} className="sm:w-[18px] sm:h-[18px]" />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 sm:py-20 text-center">
                        <Empty description="Bạn chưa mượn cuốn sách nào" />
                    </div>
                )}
            </div>

            {/* Modal Detail - Responsive */}
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                closeIcon={null}
                width="90%"
                style={{ maxWidth: 450 }}
                styles={{ body: { padding: 0 } }}
            >
                {selectedLoan && (
                    <div className="overflow-hidden rounded-xl">
                        {/* Modal Header Image/Color */}
                        <div className="h-2 w-full bg-[#153D36]"></div>
                        <div className="p-4 sm:p-6">
                            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="w-16 h-20 sm:w-24 sm:h-32 flex-shrink-0 shadow-lg">
                                    <img
                                        src={selectedLoan.avatarUrl}
                                        className="w-full h-full object-cover rounded-md"
                                        alt="Book"
                                    />
                                </div>
                                <div className="flex flex-col justify-center min-w-0">
                                    <h3 className="text-base sm:text-xl font-bold text-slate-800 mb-1 leading-tight line-clamp-2">
                                        {selectedLoan.nameBook}
                                    </h3>
                                    <p className="text-emerald-600 font-medium text-xs sm:text-sm mb-2">
                                        {selectedLoan.genre}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {getStatusTag(selectedLoan.dateReturn)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4 bg-slate-50 p-3 sm:p-4 rounded-xl">
                                <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">
                                        Mã phiếu mượn
                                    </span>
                                    <span className="font-mono font-bold text-slate-700 text-xs sm:text-sm">
                                        #LB-{selectedLoan.idBook}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-200 pb-2">
                                    <span className="text-slate-500">
                                        Người mượn
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {user?.data?.nameReader}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-200 pb-2">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <FaCalendarAlt className="text-emerald-500" />{' '}
                                        Ngày mượn
                                    </span>
                                    <span className="font-semibold text-slate-700">
                                        {formatDate(selectedLoan.dateBorrow)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm">
                                    <span className="text-slate-500 flex items-center gap-1">
                                        <FaCalendarAlt className="text-rose-500" />{' '}
                                        Ngày trả
                                    </span>
                                    <span
                                        className={`font-semibold ${
                                            selectedLoan.dateReturn
                                                ? 'text-slate-700'
                                                : 'text-rose-500 animate-pulse'
                                        }`}
                                    >
                                        {selectedLoan.dateReturn
                                            ? formatDate(
                                                  selectedLoan.dateReturn
                                              )
                                            : 'Đang mượn...'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="w-full mt-4 sm:mt-6 bg-[#153D36] text-white py-2.5 sm:py-3 rounded-xl font-bold hover:bg-[#1c4d44] transition-all shadow-md text-sm sm:text-base"
                            >
                                Đóng thông tin
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserBorrows;
