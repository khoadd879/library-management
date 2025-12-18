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
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FaCheckDouble className="text-emerald-600" />
                        LỊCH SỬ TRẢ SÁCH
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Danh sách các cuốn sách bạn đã hoàn trả cho thư viện
                    </p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 text-sm font-medium">
                        Đã hoàn thành:{' '}
                    </span>
                    <span className="text-emerald-800 font-bold">
                        {returns.length} cuốn
                    </span>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-400 animate-pulse">
                            Đang tải lịch sử trả...
                        </p>
                    </div>
                ) : returns.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                        STT
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                        Thông tin sách
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase hidden md:table-cell">
                                        Thời gian mượn
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                        Ngày trả
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">
                                        Tiền phạt
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase">
                                        Chi tiết
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {returns.map((item, index) => (
                                    <tr
                                        key={item.idLoanSlipBook}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                                            {(index + 1)
                                                .toString()
                                                .padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                                    <FaBook size={16} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-700 leading-tight">
                                                        {item.nameBook}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 uppercase tracking-tighter">
                                                        Mã: {item.idBook}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell text-xs text-slate-600">
                                            <div className="flex items-center gap-1.5">
                                                <FaClock className="text-slate-300" />
                                                <span>
                                                    {item.loanPeriod} ngày mượn
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-slate-700">
                                                {formatDate(item.returnDate)}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-medium">
                                                Mượn từ:{' '}
                                                {formatDate(item.borrowDate)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.fineAmount > 0 ? (
                                                <Tag
                                                    color="error"
                                                    className="font-bold"
                                                >
                                                    {formatCurrency(
                                                        item.fineAmount
                                                    )}
                                                </Tag>
                                            ) : (
                                                <span className="text-slate-400 text-xs font-medium italic">
                                                    Không phạt
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Tooltip title="Xem chi tiết">
                                                <button
                                                    onClick={() => {
                                                        setSelectedReturn(item);
                                                        setIsModalVisible(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-[#153D36] hover:bg-emerald-50 rounded-full transition-all"
                                                >
                                                    <FaInfoCircle size={18} />
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <Empty description="Bạn chưa trả cuốn sách nào" />
                    </div>
                )}
            </div>

            {/* Modal Chi Tiết Trả Sách */}
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                closeIcon={null}
                width={420}
                bodyStyle={{ padding: 0 }}
            >
                {selectedReturn && (
                    <div className="overflow-hidden rounded-xl">
                        {/* Header Profile */}
                        <div className="bg-[#153D36] p-6 text-white relative">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                    <FaCheckDouble className="text-emerald-400 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold leading-none">
                                        Chi Tiết Trả Sách
                                    </h3>
                                    <p className="text-emerald-200/70 text-xs mt-1">
                                        Phiếu số: LB-
                                        {selectedReturn.idLoanSlipBook}
                                    </p>
                                </div>
                            </div>
                            {/* Decorative shape */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Info Rows */}
                            <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <FaUser className="mt-1 text-slate-400" />
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                        Độc giả
                                    </p>
                                    <p className="text-sm font-bold text-slate-700">
                                        {user?.data?.nameReader ||
                                            'Chưa xác định'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                                <FaBook className="mt-1 text-slate-400" />
                                <div>
                                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                                        Sách đã trả
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 leading-tight">
                                        {selectedReturn.nameBook}
                                    </p>
                                    <p className="text-xs text-slate-400 italic">
                                        Mã sách: {selectedReturn.idBook}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                                        Thời gian mượn
                                    </p>
                                    <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                                        <FaClock className="text-emerald-500 text-xs" />{' '}
                                        {selectedReturn.loanPeriod} ngày
                                    </p>
                                </div>
                                <div
                                    className={`p-3 rounded-xl border ${
                                        selectedReturn.fineAmount > 0
                                            ? 'bg-rose-50 border-rose-100'
                                            : 'bg-slate-50 border-slate-100'
                                    }`}
                                >
                                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                                        Tiền phạt
                                    </p>
                                    <p
                                        className={`text-sm font-bold flex items-center gap-1 ${
                                            selectedReturn.fineAmount > 0
                                                ? 'text-rose-600'
                                                : 'text-slate-700'
                                        }`}
                                    >
                                        <FaMoneyBillWave className="text-xs" />{' '}
                                        {formatCurrency(
                                            selectedReturn.fineAmount
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-emerald-700">
                                        Ngày mượn
                                    </span>
                                    <span className="font-bold text-emerald-900">
                                        {formatDate(selectedReturn.borrowDate)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs font-bold border-t border-emerald-200/50 pt-2">
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
                                className="w-full bg-[#153D36] text-white py-3.5 rounded-xl font-bold hover:bg-[#1c4d44] transition-all shadow-lg active:scale-95"
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
