import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getBookAndCommentsByIdAPI,
  getStarByIdBookAPI,
  getAllComments,
  deleteCommentAPI,
} from "@/services/api";
import ReviewModal from "@/components/client/reviewPopUp";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<IGetAllBookAndComment | null>(
    null
  );
  const [comments, setComments] = useState<IGetAllComments[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null); // Thêm state popup menu
  const [editComment, setEditComment] = useState<IGetAllComments | null>(null);

  const token = localStorage.getItem("token") || "";
  const idUser = localStorage.getItem("idUser") || "";

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
      try {
        const data = await getStarByIdBookAPI(bookDetail.idBook);
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

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        const res = await getAllComments(id);
        setComments(res);
      } catch (error) {
        console.error("Lỗi khi lấy comment:", error);
      }
    };

    fetchComments();
  }, [id]);

  // Hàm xử lý mẫu
  const handleEdit = (id: string) => {
    const cmt = comments.find((c) => c.idEvaluation === id);
    if (cmt) {
      setEditComment(cmt);
      setShowModal(true);
    }
    setActiveMenu(null);
  };
  const handleDelete = (id: string) => {
    // TODO: Xác nhận và gọi API xóa
    if (window.confirm("Bạn có chắc muốn xoá nhận xét này?")) {
      handleDeleteComment(id);
      setActiveMenu(null);
    }
  };

  const handleDeleteComment = async (idComment: string) => {
    try {
      const response = await deleteCommentAPI(idComment);
      console.log("Comment deleted successfully:", response);
      // Cập nhật lại danh sách comment nếu cần
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[#f4f7f9] min-h-screen">
      {!bookDetail ? (
        <p>Đang tải thông tin sách...</p>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 bg-white rounded shadow p-4 flex flex-col items-center">
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
                {[5, 4, 3, 2, 1].map((star) => (
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
                            ratingData.distribution[star as 1 | 2 | 3 | 4 | 5]
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="w-[40px] text-right text-gray-600">
                      {getPercent(
                        ratingData.distribution[star as 1 | 2 | 3 | 4 | 5]
                      )}
                      %
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

            <div className="space-y-2">
              {comments.map((cmt) => (
                <div
                  key={cmt.idEvaluation}
                  className="flex items-start gap-3 relative"
                >
                  <img
                    src={
                      cmt.avatarUrl !== null && cmt.avatarUrl !== ""
                        ? cmt.avatarUrl
                        : `https://i.pravatar.cc/40?u=${cmt.idReader}`
                    }
                    alt="avatar"
                    className="rounded-full w-8 h-8 object-cover"
                  />
                  <div className="bg-gray-100 p-2 rounded shadow w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">
                          {cmt.nameReader || "Người dùng"}
                        </div>
                        <div className="text-yellow-500 text-sm">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>{i < cmt.star ? "★" : "☆"}</span>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          className="text-gray-500 hover:text-gray-800"
                          onClick={() =>
                            setActiveMenu(
                              activeMenu === cmt.idEvaluation
                                ? null
                                : cmt.idEvaluation
                            )
                          }
                        >
                          ⋮
                        </button>
                        {activeMenu === cmt.idEvaluation && (
                          <div className="absolute right-0 mt-1 bg-white border rounded shadow-md text-sm z-10 min-w-[120px]">
                            <button
                              className="block px-4 py-2 hover:bg-gray-100 w-full text-left disabled:text-gray-400"
                              disabled={idUser !== cmt.idReader}
                              onClick={() => handleEdit(cmt.idEvaluation)}
                            >
                              ✏️ Chỉnh sửa
                            </button>
                            <button
                              className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 disabled:text-gray-400"
                              disabled={idUser !== cmt.idReader}
                              onClick={() => handleDelete(cmt.idEvaluation)}
                            >
                              🗑️ Xoá
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-1">{cmt.comment}</p>
                  </div>
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
          onClose={() => {
            setShowModal(false);
            setEditComment(null);
          }}
          editData={
            editComment
              ? {
                  idComment: editComment.idEvaluation,
                  comment: editComment.comment,
                  rate: editComment.star,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default BookDetailPage;
