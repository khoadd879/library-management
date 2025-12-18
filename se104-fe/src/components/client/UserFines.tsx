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
                >
                    Đã hoàn thành
                </Tag>
            );
        }
        return (
            <Tag
                color="warning"
                icon={<FaExclamationTriangle className="inline mr-1" />}
            >
                Còn nợ phí
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
            {/* Header Area & Quick Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                        <FaReceipt className="text-rose-600" />
                        DANH SÁCH PHẠT & PHÍ
                    </h2>
                    <p className="text-slate-500 text-sm">
                        Quản lý các khoản phí phát sinh trong quá trình mượn
                        sách
                    </p>
                </div>

                <div className="flex gap-3 w-full lg:w-auto">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 flex-1">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <FaWallet size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                                Tổng nợ hiện tại
                            </p>
                            <p className="text-lg font-black text-rose-600 leading-none">
                                {formatCurrency(totalRemaining)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Spin size="large" />
                        <p className="mt-4 text-slate-400 animate-pulse">
                            Đang kiểm tra dữ liệu phí...
                        </p>
                    </div>
                ) : penalties.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        STT
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Ngày ghi nhận
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-rose-600">
                                        Tổng nợ
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-emerald-600">
                                        Đã thu
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Còn lại
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100 font-medium">
                                {penalties.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                            {(index + 1)
                                                .toString()
                                                .padStart(2, '0')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            {formatDate(item.createdDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                            {formatCurrency(item.totalDebit)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600">
                                            {formatCurrency(
                                                item.amountCollected
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`text-sm ${
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
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <Tooltip title="Chi tiết thanh toán">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPenalty(
                                                            item
                                                        );
                                                        setIsModalVisible(true);
                                                    }}
                                                    className="p-2.5 text-slate-400 hover:text-[#153D36] hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
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
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <span className="text-slate-400">
                                    Tuyệt vời! Bạn không có khoản phạt nào.
                                </span>
                            }
                        />
                    </div>
                )}
            </div>

            {/* Modal Chi Tiết Phạt - Thiết kế Modern Card */}
            <Modal
                title={null}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                centered
                closeIcon={null}
                width={400}
                bodyStyle={{ padding: 0 }}
            >
                {selectedPenalty && (
                    <div className="overflow-hidden rounded-2xl">
                        {/* Modal Header */}
                        <div
                            className={`p-6 text-white ${
                                selectedPenalty.amountRemaining > 0
                                    ? 'bg-rose-600'
                                    : 'bg-emerald-600'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <FaReceipt size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg uppercase tracking-tight">
                                        Chi Tiết Khoản Phạt
                                    </h3>
                                </div>
                                {selectedPenalty.amountRemaining > 0 && (
                                    <FaExclamationTriangle className="animate-bounce" />
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-white">
                            {/* Reader Info Card */}
                            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 bg-[#153D36] rounded-full flex items-center justify-center text-white shadow-inner font-bold">
                                    {user?.data?.nameReader?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                                        Độc giả
                                    </p>
                                    <p className="text-sm font-bold text-slate-800 leading-none">
                                        {user?.data?.nameReader ||
                                            'Không xác định'}
                                    </p>
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                    <span className="text-slate-500 font-medium">
                                        Ngày phát sinh
                                    </span>
                                    <span className="text-slate-800 font-bold">
                                        {formatDate(
                                            selectedPenalty.createdDate
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
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
                                <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
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
                                    <span className="text-slate-800 font-black uppercase text-xs">
                                        Cần trả thêm
                                    </span>
                                    <span
                                        className={`text-lg font-black ${
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
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3 mb-6">
                                    <FaMoneyBillWave className="text-rose-500 mt-1 flex-shrink-0" />
                                    <p className="text-xs text-rose-700 font-medium leading-relaxed">
                                        Khoản nợ này vẫn chưa được thanh toán
                                        hoàn toàn. Vui lòng liên hệ quầy thủ thư
                                        để hoàn tất.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-start gap-3 mb-6">
                                    <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                                    <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                                        Tuyệt vời! Khoản phí này đã được thanh
                                        toán đầy đủ. Cảm ơn bạn đã tuân thủ nội
                                        quy.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => setIsModalVisible(false)}
                                className="w-full bg-[#153D36] text-white py-3.5 rounded-xl font-bold hover:bg-[#1c4d44] transition-all shadow-md active:scale-[0.98]"
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
