import { useEffect, useState } from 'react';
import { Modal, message, Tag, Tooltip, Empty, Spin } from 'antd';
import {
    FaInfoCircle,
    FaUser,
    FaBook,
    FaCalendarAlt,
    FaCheckDouble,
    FaMoneyBillWave,
    FaClock,
} from 'react-icons/fa';
import { useCurrentApp } from '@/components/context/app.context';
import { getReceiptHistoryAPI } from '@/services/api';

const UserReturns = () => {
    const { user } = useCurrentApp();
    const [returns, setReturns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.data?.idReader) {
                setLoading(false);
                return;
            }
            try {
                const res = await getReceiptHistoryAPI(user.data.idReader);
                const finalData = res?.data ?? res ?? [];
                // Chỉ lấy những sách đã trả thành công
                const filteredData = Array.isArray(finalData)
                    ? finalData.filter((item: any) => item.isReturned === true)
                    : [];
                setReturns(filteredData);
            } catch (err) {
                message.error('Lỗi khi tải lịch sử trả sách!');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '---';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Area - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 md:mb-8 gap-3 sm:gap-4">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FaCheckDouble className="text-emerald-600 text-base sm:text-lg md:text-xl" />
                        <span className="hidden sm:inline">LỊCH SỬ TRẢ SÁCH</span>
                        <span className="sm:hidden">LỊCH SỬ TRẢ</span>
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">
                        Danh sách các cuốn sách bạn đã hoàn trả cho thư viện
                    </p>
                </div>
                <div className="bg-emerald-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 text-xs sm:text-sm font-medium">
                        Hoàn thành:{' '}
                    </span>
                    <span className="text-emerald-800 font-bold text-sm sm:text-base">
                        {returns.length}
                    </span>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-400 animate-pulse text-sm">
                            Đang tải lịch sử trả...
                        </p>
                    </div>
                ) : returns.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                                        STT
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                                        Sách
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase hidden lg:table-cell">
                                        Thời gian
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                                        Trả
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase hidden sm:table-cell">
                                        Phạt
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase">
                                        CT
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {returns.map((item, index) => (
                                    <tr
                                        key={item.idLoanSlipBook}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-slate-400 font-medium">
                                            {(index + 1)
                                                .toString()
                                                .padStart(2, '0')}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className="p-1.5 sm:p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors hidden xs:flex">
                                                    <FaBook size={14} className="sm:w-4 sm:h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-xs sm:text-sm font-bold text-slate-700 leading-tight line-clamp-2">
                                                        {item.nameBook}
                                                    </div>
                                                    <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-tighter truncate">
                                                        Mã: {item.idBook}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 hidden lg:table-cell text-[10px] sm:text-xs text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <FaClock className="text-slate-300" />
                                                <span>
                                                    {item.loanPeriod} ngày
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4">
                                            <div className="text-xs sm:text-sm font-semibold text-slate-700">
                                                {formatDate(item.returnDate)}
                                            </div>
                                            <div className="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:block">
                                                Mượn: {formatDate(item.borrowDate)}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                                            {item.fineAmount > 0 ? (
                                                <Tag
                                                    color="error"
                                                    className="font-bold text-[10px] sm:text-xs"
                                                >
                                                    {formatCurrency(
                                                        item.fineAmount
                                                    )}
                                                </Tag>
                                            ) : (
                                                <span className="text-slate-400 text-[10px] sm:text-xs font-medium italic">
                                                    Không
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 text-center">
                                            <Tooltip title="Xem chi tiết">
                                                <button
                                                    onClick={() => {
                                                        setSelectedReturn(item);
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
                        <Empty description="Bạn chưa trả cuốn sách nào" />
                    </div>
                )}
            </div>

            {/* Modal Chi Tiết - Responsive */}
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                closeIcon={null}
                width="90%"
                style={{ maxWidth: 420 }}
                styles={{ body: { padding: 0 } }}
            >
                {selectedReturn && (
                    <div className="overflow-hidden rounded-xl">
                        {/* Header Profile */}
                        <div className="bg-[#153D36] p-4 sm:p-6 text-white relative">
                            <div className="flex items-center gap-3 sm:gap-4 relative z-10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                    <FaCheckDouble className="text-emerald-400 text-lg sm:text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold leading-none">
                                        Chi Tiết Trả Sách
                                    </h3>
                                    <p className="text-emerald-200/70 text-[10px] sm:text-xs mt-1">
                                        Phiếu số: LB-
                                        {selectedReturn.idLoanSlipBook}
                                    </p>
                                </div>
                            </div>
                            {/* Decorative shape */}
                            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        </div>

                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                            {/* Info Rows */}
                            <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <FaUser className="mt-1 text-slate-400 text-sm" />
                                <div>
                                    <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                        Độc giả
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700">
                                        {user?.data?.nameReader ||
                                            'Chưa xác định'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <FaBook className="mt-1 text-slate-400 text-sm" />
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                        Sách đã trả
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 leading-tight line-clamp-2">
                                        {selectedReturn.nameBook}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-slate-400 italic">
                                        Mã sách: {selectedReturn.idBook}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold mb-1">
                                        Thời gian mượn
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 flex items-center gap-1">
                                        <FaClock className="text-emerald-500 text-[10px] sm:text-xs" />{' '}
                                        {selectedReturn.loanPeriod} ngày
                                    </p>
                                </div>
                                <div
                                    className={`p-2 sm:p-3 rounded-xl border ${
                                        selectedReturn.fineAmount > 0
                                            ? 'bg-rose-50 border-rose-100'
                                            : 'bg-slate-50 border-slate-100'
                                    }`}
                                >
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold mb-1">
                                        Tiền phạt
                                    </p>
                                    <p
                                        className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${
                                            selectedReturn.fineAmount > 0
                                                ? 'text-rose-600'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        <FaMoneyBillWave className="text-[10px] sm:text-xs" />{' '}
                                        {formatCurrency(
                                            selectedReturn.fineAmount
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-3 sm:p-4 rounded-xl border border-emerald-100">
                                <div className="flex justify-between text-[10px] sm:text-xs mb-2">
                                    <span className="text-emerald-700">
                                        Ngày mượn
                                    </span>
                                    <span className="font-bold text-emerald-900">
                                        {formatDate(selectedReturn.borrowDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold border-t border-emerald-200/50 pt-2">
                                    <span className="text-emerald-700 uppercase tracking-wide">
                                        Hoàn trả vào
                                    </span>
                                    <span className="text-emerald-900">
                                        {formatDate(selectedReturn.returnDate)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="w-full bg-[#153D36] text-white py-2.5 sm:py-3.5 rounded-xl font-bold hover:bg-[#1c4d44] transition-all shadow-lg active:scale-95 text-sm sm:text-base"
                            >
                                Đã hiểu
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserReturns;
