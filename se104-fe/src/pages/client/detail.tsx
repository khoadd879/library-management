import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookAndCommentsByIdAPI } from "@/services/api"; 

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<IGetAllBookAndComment | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);

  const token = localStorage.getItem("token") || ""; 

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getBookAndCommentsByIdAPI(token, id);
        console.log("Full response from API:", res);

        if (Array.isArray(res) && res.length > 0) {
          setBookDetail(res[0]);
        } else if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBookDetail(res.data[0]);
        } else {
          console.error("Không có dữ liệu sách hoặc sai định dạng:", res);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleComment = () => {
    if (comment.trim()) {
      setComments([comment, ...comments]);
      setComment("");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#f4f7f9] min-h-screen">
      {!bookDetail ? (
        <p>Đang tải thông tin sách...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            {bookDetail.image ? (
              <img
                src={bookDetail.image}
                alt="book"
                className="w-40 h-60 object-cover rounded"
              />
            ) : (
              <div className="w-40 h-60 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                No Image
              </div>
            )}

            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{bookDetail.nameBook}</h2>
              <p className="text-sm mb-2">
                Tác giả: {bookDetail.authors.map(a => a.nameAuthor).join(", ")}
              </p>
              <p className="text-gray-600 mb-4">{bookDetail.describe}</p>
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
                  <p className="bg-white p-2 rounded shadow w-full">
                    {typeof cmt === "string" ? cmt : JSON.stringify(cmt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BookDetailPage;
