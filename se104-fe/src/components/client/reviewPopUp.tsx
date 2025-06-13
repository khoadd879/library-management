import { useState } from "react";
import { addEvaluationAPI } from "@/services/api"; // Điều chỉnh path nếu khác

interface ReviewModalProps {
  onClose: () => void;
  bookId: string;
}

const ReviewModal = ({ onClose, bookId }: ReviewModalProps) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;

    setSubmitting(true);
    try {
      await addEvaluationAPI(bookId, comment, rating);
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      alert("Gửi đánh giá thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
        <h2 className="text-lg font-semibold text-center mb-4">
          VIẾT ĐÁNH GIÁ SẢN PHẨM
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
            {submitting ? "Đang gửi..." : "Gửi nhận xét"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
