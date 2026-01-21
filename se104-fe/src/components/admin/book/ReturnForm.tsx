import React, { useState } from 'react';
import { addSlipBookAPI } from '@/services/api';
import { message, Spin } from 'antd';

const ReturnForm = () => {
    const [idLoanSlipBook, setIdLoanSlipBook] = useState('');
    const [idReader, setIdReader] = useState('');
    const [idTheBook, setIdTheBook] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await addSlipBookAPI(
                idLoanSlipBook,
                idReader,
                idTheBook,
            );
            if (res && res.statusCode === 200) {
                message.success('Tạo phiếu trả sách thành công!');
                // Reset form
                setIdLoanSlipBook('');
                setIdReader('');
                setIdTheBook('');
            } else {
                message.error(res?.message || 'Tạo phiếu trả sách thất bại!');
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg =
                err?.response?.data?.message ||
                err?.response?.message ||
                'Lỗi khi gửi phiếu trả sách.';
            message.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Spin spinning={isLoading} tip="Đang xử lý...">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4"
            >
                <h2 className="text-2xl font-bold text-[#153D36] text-center mb-4">
                    Phiếu trả sách
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#153D36]">
                            Mã phiếu mượn (idLoanSlipBook)
                        </label>
                        <input
                            type="text"
                            value={idLoanSlipBook}
                            onChange={(e) => setIdLoanSlipBook(e.target.value)}
                            placeholder="Nhập mã phiếu mượn..."
                            className="w-full px-4 py-2 border rounded outline-none text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#153D36]">
                            Mã độc giả (idReader)
                        </label>
                        <input
                            type="text"
                            value={idReader}
                            onChange={(e) => setIdReader(e.target.value)}
                            placeholder="Nhập mã độc giả..."
                            className="w-full px-4 py-2 border rounded outline-none text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#153D36]">
                            Mã sách (idTheBook)
                        </label>
                        <input
                            type="text"
                            value={idTheBook}
                            onChange={(e) => setIdTheBook(e.target.value)}
                            placeholder="Nhập mã sách..."
                            className="w-full px-4 py-2 border rounded outline-none text-sm"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded text-sm font-semibold mt-4 mx-auto block ${
                        isLoading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-[#17966F] text-white'
                    }`}
                >
                    {isLoading ? <Spin size="small" /> : 'Xuất phiếu'}
                </button>
            </form>
        </Spin>
    );
};

export default ReturnForm;
