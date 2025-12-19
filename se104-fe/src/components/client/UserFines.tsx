import React, { useEffect, useState } from 'react';
import { message, Modal, Tag, Tooltip, Empty, Spin } from 'antd';
import { getPenaltiesByIdAPI } from '@/services/api';
import { useCurrentApp } from '@/components/context/app.context';
import {
    FaInfoCircle,
    FaUser,
    FaMoneyBillWave,
    FaReceipt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaWallet,
} from 'react-icons/fa';

const UserFines = () => {
    const { user } = useCurrentApp();
    const [penalties, setPenalties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPenalty, setSelectedPenalty] = useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.data?.idReader) {
                setLoading(false);
                return;
            }
            try {
                const res = await getPenaltiesByIdAPI(user.data.idReader);
                const finalData = res?.data ?? res ?? [];
                setPenalties(Array.isArray(finalData) ? finalData : []);
            } catch (err) {
                message.error('Không thể tải dữ liệu phạt!');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '---';
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const getStatusTag = (remaining: number) => {
        if (remaining <= 0) {
            return (
                <Tag
                    color="success"
                    icon={<FaCheckCircle className="inline mr-1" />}
                    className="text-[10px] sm:text-xs"
                >
                    <span className="hidden sm:inline">Đã hoàn thành</span>
                    <span className="sm:hidden">Xong</span>
                </Tag>
            );
        }
        return (
            <Tag
                color="warning"
                icon={<FaExclamationTriangle className="inline mr-1" />}
                className="text-[10px] sm:text-xs"
            >
                <span className="hidden sm:inline">Còn nợ phí</span>
                <span className="sm:hidden">Nợ</span>
            </Tag>
        );
    };

    // Tính tổng nợ còn lại để hiển thị summary
    const totalRemaining = penalties.reduce(
        (sum, item) => sum + (item.amountRemaining || 0),
        0
    );

    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Header Area & Quick Stats - Responsive */}
            <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FaReceipt className="text-rose-600 text-base sm:text-lg md:text-xl" />
                        <span className="hidden sm:inline">DANH SÁCH PHẠT & PHÍ</span>
                        <span className="sm:hidden">PHẠT & PHÍ</span>
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm hidden sm:block">
                        Quản lý các khoản phí phát sinh trong quá trình mượn sách
                    </p>
                </div>

                <div className="bg-white px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:self-start">
                    <div className="p-1.5 sm:p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <FaWallet size={16} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5 sm:mb-1">
                            Tổng nợ hiện tại
                        </p>
                        <p className="text-sm sm:text-lg font-black text-rose-600 leading-none">
                            {formatCurrency(totalRemaining)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-20">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-400 animate-pulse text-sm">
                            Đang kiểm tra dữ liệu phí...
                        </p>
                    </div>
                ) : penalties.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                                        Ngày
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-rose-600">
                                        Nợ
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-emerald-600 hidden md:table-cell">
                                        Đã thu
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Còn
                                    </th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        CT
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 font-medium">
                                {penalties.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-slate-400">
                                            {(index + 1)
                                                .toString()
                                                .padStart(2, '0')}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm text-slate-600 hidden sm:table-cell">
                                            {formatDate(item.createdDate)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm text-slate-700">
                                            {formatCurrency(item.totalDebit)}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-[10px] sm:text-sm text-emerald-600 hidden md:table-cell">
                                            {formatCurrency(
                                                item.amountCollected
                                            )}
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-0.5 sm:gap-1">
                                                <span
                                                    className={`text-[10px] sm:text-sm ${
                                                        item.amountRemaining > 0
                                                            ? 'text-rose-600 font-bold'
                                                            : 'text-slate-400 font-normal line-through'
                                                    }`}
                                                >
                                                    {formatCurrency(
                                                        item.amountRemaining
                                                    )}
                                                </span>
                                                {getStatusTag(
                                                    item.amountRemaining
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center">
                                            <Tooltip title="Chi tiết thanh toán">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPenalty(
                                                            item
                                                        );
                                                        setIsModalVisible(true);
                                                    }}
                                                    className="p-1.5 sm:p-2.5 text-slate-400 hover:text-[#153D36] hover:bg-emerald-50 rounded-lg sm:rounded-xl transition-all border border-transparent hover:border-emerald-100"
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
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-slate-400 text-sm">
                                    Tuyệt vời! Bạn không có khoản phạt nào.
                                </span>
                            }
                        />
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
                style={{ maxWidth: 400 }}
                styles={{ body: { padding: 0 } }}
            >
                {selectedPenalty && (
                    <div className="overflow-hidden rounded-2xl">
                        {/* Modal Header */}
                        <div
                            className={`p-4 sm:p-6 text-white ${
                                selectedPenalty.amountRemaining > 0
                                    ? 'bg-rose-600'
                                    : 'bg-emerald-600'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <FaReceipt size={16} className="sm:w-5 sm:h-5" />
                                    </div>
                                    <h3 className="font-bold text-sm sm:text-lg uppercase tracking-tight">
                                        Chi Tiết Khoản Phạt
                                    </h3>
                                </div>
                                {selectedPenalty.amountRemaining > 0 && (
                                    <FaExclamationTriangle className="animate-bounce" />
                                )}
                            </div>
                        </div>

                        <div className="p-4 sm:p-6 bg-white">
                            {/* Reader Info Card */}
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#153D36] rounded-full flex items-center justify-center text-white shadow-inner font-bold text-sm sm:text-base">
                                    {user?.data?.nameReader?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5 sm:mb-1">
                                        Độc giả
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-none">
                                        {user?.data?.nameReader ||
                                            'Không xác định'}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-50 pb-2">
                                    <span className="text-slate-500 font-medium">
                                        Ngày phát sinh
                                    </span>
                                    <span className="text-slate-800 font-bold">
                                        {formatDate(
                                            selectedPenalty.createdDate
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-50 pb-2">
                                    <span className="text-slate-500 font-medium flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>{' '}
                                        Tổng nợ
                                    </span>
                                    <span className="text-slate-800 font-bold">
                                        {formatCurrency(
                                            selectedPenalty.totalDebit
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-50 pb-2">
                                    <span className="text-slate-500 font-medium flex items-center gap-2 text-emerald-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>{' '}
                                        Đã thanh toán
                                    </span>
                                    <span className="text-emerald-600 font-bold">
                                        -
                                        {formatCurrency(
                                            selectedPenalty.amountCollected
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-slate-800 font-black uppercase text-[10px] sm:text-xs">
                                        Cần trả thêm
                                    </span>
                                    <span
                                        className={`text-base sm:text-lg font-black ${
                                            selectedPenalty.amountRemaining > 0
                                                ? 'text-rose-600'
                                                : 'text-emerald-600'
                                        }`}
                                    >
                                        {formatCurrency(
                                            selectedPenalty.amountRemaining
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Status Message */}
                            {selectedPenalty.amountRemaining > 0 ? (
                                <div className="bg-rose-50 border border-rose-100 p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <FaMoneyBillWave className="text-rose-500 mt-0.5 flex-shrink-0 text-sm" />
                                    <p className="text-[10px] sm:text-xs text-rose-700 font-medium leading-relaxed">
                                        Khoản nợ này vẫn chưa được thanh toán
                                        hoàn toàn. Vui lòng liên hệ quầy thủ thư
                                        để hoàn tất.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-100 p-3 sm:p-4 rounded-xl flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                                    <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0 text-sm" />
                                    <p className="text-[10px] sm:text-xs text-emerald-700 font-medium leading-relaxed">
                                        Tuyệt vời! Khoản phí này đã được thanh
                                        toán đầy đủ. Cảm ơn bạn đã tuân thủ nội
                                        quy.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="w-full bg-[#153D36] text-white py-2.5 sm:py-3.5 rounded-xl font-bold hover:bg-[#1c4d44] transition-all shadow-md active:scale-[0.98] text-sm sm:text-base"
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

export default UserFines;
