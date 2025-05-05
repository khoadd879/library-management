import { useParams } from "react-router-dom";
import { useState } from "react";

const BookDetailPage = () => {
  const { id } = useParams();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    "Điều tôi thích nhất ở cuốn sách là cách Paulo Coelho truyền tải thông điệp...",
    "sách như l**",
  ]);

  const handleComment = () => {
    if (comment.trim()) {
      setComments([comment, ...comments]);
      setComment("");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#f4f7f9] min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src="https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain"
          alt="book"
          className="w-40 h-60 object-cover rounded"
        />

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">The Power of Agency</h2>
          <p className="text-sm mb-2">About</p>
          <p className="text-gray-600 mb-4">...............................</p>
          <div className="flex items-center gap-1 text-yellow-500 text-lg mb-2">
            ★ ★ ★ ★ ☆
          </div>
          <p className="text-sm">Đánh giá</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-lg mb-3">Nhận xét:</h3>
        <div className="flex items-center gap-3 mb-4">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="rounded-full w-8 h-8"
          />
          <input
            type="text"
            className="border rounded px-3 py-1 flex-1"
            placeholder="Viết bình luận..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
          />
        </div>
        <div className="space-y-2">
          {comments.map((cmt, i) => (
            <div key={i} className="flex items-start gap-3">
              <img
                src="https://i.pravatar.cc/40?u=user"
                alt="avatar"
                className="rounded-full w-8 h-8"
              />
              <p className="bg-white p-2 rounded shadow w-full">{cmt}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-lg font-bold mb-4">Đề xuất</h3>
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-w-[120px] bg-white rounded-lg p-2 shadow cursor-pointer"
            >
              <div className="h-36 bg-gray-200 mb-2 rounded"></div>
              <p className="text-sm font-semibold">One Bullet Away</p>
              <p className="text-xs text-gray-500">Nathaniel Fick</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
