import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getBookAndCommentsByIdAPI, getStarByIdBookAPI } from "@/services/api";
import ReviewModal from "@/components/client/reviewPopUp";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<IGetAllBookAndComment | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token") || "";

  const [ratingData, setRatingData] = useState<{
    average: number;
    totalRatings: number;
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  }>({
    average: 0,
    totalRatings: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const getPercent = (count: number) => {
    const total = Object.values(ratingData.distribution).reduce(
      (a, b) => a + b,
      0
    );
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const renderStars = (avg: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < Math.floor(avg) ? "★" : "☆"}</span>
    ));
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getBookAndCommentsByIdAPI(token, id);
        const book =
          Array.isArray(res) && res.length > 0 ? res[0] : res || null;

        if (book) {
          setBookDetail(book);
        } else {
          console.error("Không có dữ liệu sách hoặc sai định dạng:", res);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sách:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchStars = async () => {
      if (!bookDetail?.idBook) return;
      console.log("Fetching stars for book ID:", bookDetail.idBook);
      try {
        const data = await getStarByIdBookAPI(bookDetail.idBook);
        console.log("Stars data:", data);
        const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        };
        let total = 0;
        let sum = 0;

        data.forEach((entry) => {
          const s = entry.star as 1 | 2 | 3 | 4 | 5;
          if ([1, 2, 3, 4, 5].includes(s)) {
            distribution[s] = entry.status;
            total += entry.status;
            sum += s * entry.status;
          }
        });

        setRatingData({
          average: total > 0 ? sum / total : 0,
          totalRatings: total,
          distribution,
        });
      } catch (error) {
        console.error("Lỗi khi lấy đánh giá sao:", error);
      }
    };

    fetchStars();
  }, [bookDetail]);

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
            <div className="w-full md:w-1/3 bg-white rounded shadow p-4 flex justify-center">
              {bookDetail.image ? (
                <img
                  src={bookDetail.image}
                  alt="book"
                  className="w-60 h-80 object-cover rounded"
                />
              ) : (
                <div className="w-60 h-80 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                  No Image
                </div>
              )}
            </div>

            <div className="w-full md:w-2/3 bg-white rounded shadow p-4">
              <h2 className="text-2xl font-bold mb-2">{bookDetail.nameBook}</h2>
              <p className="text-sm mb-2">
                <span className="font-semibold">Tác giả: </span>
                {bookDetail.authors.map((a) => a.nameAuthor).join(", ")}
              </p>
              <p className="text-gray-700 text-sm">
                Mô tả: {bookDetail.describe}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded shadow p-4">
            <h4 className="font-semibold mb-4">Đánh giá sản phẩm</h4>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex flex-col items-start min-w-[120px]">
                <div className="text-3xl font-bold text-red-600">
                  {ratingData.average.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">/5</div>
                <div className="text-yellow-500 text-xl mt-1">
                  {renderStars(ratingData.average)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  ({ratingData.totalRatings} đánh giá)
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 w-full">
                {([5, 4, 3, 2, 1] as const).map((star) => (
                  <div
                    key={star}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex items-center gap-1 w-[100px]">
                      <span>{star}</span>
                      <span>sao</span>
                    </div>
                    <div className="flex-1 bg-gray-200 h-2 rounded mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded"
                        style={{
                          width: `${getPercent(
                            ratingData.distribution[star]
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="w-[40px] text-right text-gray-600">
                      {getPercent(ratingData.distribution[star])}%
                    </div>
                  </div>
                ))}

                <div className="flex justify-end mt-4">
                  <button
                    className="text-red-600 border border-red-500 rounded px-4 py-1 hover:bg-red-50 transition text-sm flex items-center gap-1"
                    onClick={() => setShowModal(true)}
                  >
                    ✎ Viết đánh giá
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded shadow p-4">
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
                    src={`https://i.pravatar.cc/40?u=user${i}`}
                    alt="avatar"
                    className="rounded-full w-8 h-8"
                  />
                  <p className="bg-gray-100 p-2 rounded shadow w-full">{cmt}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-gray-500 italic">Chưa có nhận xét nào.</p>
              )}
            </div>
          </div>
        </>
      )}

      {showModal && bookDetail && (
        <ReviewModal
          bookId={bookDetail.idBook}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BookDetailPage;
