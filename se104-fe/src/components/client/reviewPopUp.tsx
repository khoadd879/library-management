import { useState, useEffect } from 'react';
import { addEvaluationAPI, updateCommentAPI } from '@/services/api';
import { message, Spin } from 'antd';
import { FaStar, FaTimes, FaPenNib, FaCheckCircle } from 'react-icons/fa';

interface ReviewModalProps {
    onClose: () => void;
    bookId: string;
    editData?: {
        idComment: string;
        comment: string;
        rate: number;
    };
}

const ReviewModal = ({ onClose, bookId, editData }: ReviewModalProps) => {
    const [comment, setComment] = useState(editData ? editData.comment : '');
    const [rating, setRating] = useState(editData ? editData.rate : 5);
    const [hover, setHover] = useState<number | null>(null); // Để xử lý hiệu ứng hover sao
    const [submitting, setSubmitting] = useState(false);

    // Labels cho từng mức điểm
    const ratingLabels: Record<number, string> = {
        1: 'Rất tệ',
        2: 'Không hài lòng',
        3: 'Bình thường',
        4: 'Rất tốt',
        5: 'Tuyệt vời',
    };

    useEffect(() => {
        if (editData) {
            setComment(editData.comment);
            setRating(editData.rate);
        }
    }, [editData]);

    const handleSubmit = async () => {
        if (!comment.trim() || rating === 0) {
            message.warning('Vui lòng nhập nhận xét và chọn số sao!');
            return;
        }
        setSubmitting(true);
        try {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) {
                message.error(
                    'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!'
                );
                return;
            }

            if (editData) {
                await updateCommentAPI(editData.idComment, comment, rating);
                message.success('Cập nhật đánh giá thành công!');
            } else {
                await addEvaluationAPI(idUser, bookId, comment, rating);
                message.success('Gửi đánh giá thành công! Cảm ơn bạn.');
            }
            onClose();
        } catch (error) {
            message.error(
                editData
                    ? 'Lỗi khi cập nhật đánh giá'
                    : 'Không thể gửi đánh giá'
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop với hiệu ứng mờ */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={!submitting ? onClose : undefined}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header Section */}
                <div className="bg-[#153D36] p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                        disabled={submitting}
                    >
                        <FaTimes size={18} />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                            <FaPenNib className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                {editData
                                    ? 'Chỉnh sửa đánh giá'
                                    : 'Viết đánh giá sản phẩm'}
                            </h2>
                            <p className="text-emerald-200/60 text-xs font-medium uppercase tracking-widest mt-0.5">
                                Chia sẻ trải nghiệm của bạn
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Rating Stars Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = star <= (hover ?? rating);
                                return (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`transition-all duration-200 transform ${
                                            isFilled
                                                ? 'scale-110'
                                                : 'scale-100 hover:scale-110'
                                        }`}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={() => setRating(star)}
                                        disabled={submitting}
                                    >
                                        <FaStar
                                            size={36}
                                            className={`${
                                                isFilled
                                                    ? 'text-yellow-400 drop-shadow-sm'
                                                    : 'text-slate-200'
                                            }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                        <span
                            className={`text-sm font-bold transition-colors duration-300 ${
                                rating > 0 ? 'text-[#153D36]' : 'text-slate-400'
                            }`}
                        >
                            {ratingLabels[hover ?? rating] ||
                                'Chọn mức đánh giá'}
                        </span>
                    </div>

                    {/* Textarea Section */}
                    <div className="relative mb-6">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Nhận xét chi tiết
                        </label>
                        <textarea
                            placeholder="Cuốn sách này có gì thú vị? Bạn có muốn giới thiệu nó cho người khác không?"
                            className="w-full border-2 border-slate-100 rounded-2xl px-4 py-3 h-32 resize-none focus:outline-none focus:border-[#153D36] focus:ring-4 focus:ring-emerald-50 transition-all text-slate-700 leading-relaxed"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={submitting}
                        />
                        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-slate-300">
                            {comment.length} KÝ TỰ
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            className="flex-1 px-6 py-3.5 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                            onClick={onClose}
                            disabled={submitting}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            className="flex-[2] flex items-center justify-center gap-2 px-6 py-3.5 bg-[#153D36] text-white font-bold rounded-2xl hover:bg-[#1c4d44] shadow-lg shadow-emerald-900/10 active:scale-95 transition-all disabled:opacity-70"
                            onClick={handleSubmit}
                            disabled={submitting || !comment.trim()}
                        >
                            {submitting ? (
                                <Spin
                                    size="small"
                                    className="invert brightness-0"
                                />
                            ) : (
                                <FaCheckCircle />
                            )}
                            {submitting
                                ? 'Đang xử lý...'
                                : editData
                                ? 'Cập nhật ngay'
                                : 'Gửi đánh giá'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
