import { useState, useEffect } from "react";
import { addEvaluationAPI, updateCommentAPI } from "@/services/api";

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
  const [comment, setComment] = useState(editData ? editData.comment : "");
  const [rating, setRating] = useState(editData ? editData.rate : 4);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setComment(editData.comment);
      setRating(editData.rate);
    }
  }, [editData]);

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;
    setSubmitting(true);
    try {
      if (editData) {
        await updateCommentAPI(editData.idComment, comment, rating);
        alert("Cập nhật đánh giá thành công!");
      } else {
        await addEvaluationAPI(bookId, comment, rating);
      }
      onClose();
    } catch (error) {
      alert(
        editData
          ? "Cập nhật đánh giá thất bại."
          : "Gửi đánh giá thất bại. Vui lòng thử lại."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
        <h2 className="text-lg font-semibold text-center mb-4">
          {editData ? "CHỈNH SỬA ĐÁNH GIÁ" : "VIẾT ĐÁNH GIÁ SẢN PHẨM"}
        </h2>
        <div className="flex justify-center text-yellow-500 text-2xl mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`cursor-pointer ${
                star <= rating ? "text-yellow-500" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Nhập nhận xét của bạn về sản phẩm"
          className="w-full border rounded px-3 py-2 h-24 resize-none mb-4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-600 border border-gray-400 rounded hover:bg-gray-100"
            onClick={onClose}
            disabled={submitting}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={submitting || !comment.trim()}
          >
            {submitting
              ? editData
                ? "Đang cập nhật..."
                : "Đang gửi..."
              : editData
              ? "Cập nhật"
              : "Gửi nhận xét"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
