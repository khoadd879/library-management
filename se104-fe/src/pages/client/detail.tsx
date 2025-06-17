import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getBookAndCommentsByIdAPI,
  getStarByIdBookAPI,
  getAllComments,
  deleteCommentAPI,
} from "@/services/api";
import ReviewModal from "@/components/client/reviewPopUp";
import { Spin } from "antd";

const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [bookDetail, setBookDetail] = useState<IGetAllBookAndComment | null>(
    null
  );
  const [comments, setComments] = useState<IGetAllComments[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editComment, setEditComment] = useState<IGetAllComments | null>(null);
  const [loading, setLoading] = useState(true);

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
      <span
        key={i}
        className={
          i < Math.floor(avg) ? "text-yellow-400" : "text-gray-300"
        }
      >
        ★
      </span>
    ));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await getBookAndCommentsByIdAPI(token, id);
        const book =
          Array.isArray(res) && res.length > 0 ? res[0] : res || null;
        if (book) {
          setBookDetail(book);
        } else {
          setBookDetail(null);
        }
      } catch (error) {
        setBookDetail(null);
      } finally {
        setLoading(false);
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
      } catch (error) {}
    };
    fetchStars();
  }, [bookDetail]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      try {
        const res = await getAllComments(id);
        setComments(res);
      } catch (error) {}
    };
    fetchComments();
  }, [id]);

  const handleEdit = (id: string) => {
    const cmt = comments.find((c) => c.idEvaluation === id);
    if (cmt) {
      setEditComment(cmt);
      setShowModal(true);
    }
    setActiveMenu(null);
  };
  const handleDelete = (id: string) => {
    if (window.confirm("Bạn có chắc muốn xoá nhận xét này?")) {
      handleDeleteComment(id);
      setActiveMenu(null);
    }
  };

  const handleDeleteComment = async (idComment: string) => {
    try {
      await deleteCommentAPI(idComment);
      setComments((prev) => prev.filter((c) => c.idEvaluation !== idComment));
    } catch (error) {}
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-[#f4f7f9] to-[#e0f7fa] min-h-screen animate-fade-in">
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spin size="large" />
        </div>
      ) : !bookDetail ? (
        <div className="text-center text-gray-500 py-10">
          Không tìm thấy thông tin sách.
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-8 animate-fade-in-up">
            <div className="w-full md:w-1/3 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center transition-transform duration-300 hover:scale-[1.02]">
              {bookDetail.image ? (
                <img
                  src={bookDetail.image}
                  alt="book"
                  className="w-60 h-80 object-cover rounded-xl shadow-md mb-4 animate-fade-in"
                />
              ) : (
                <div className="w-60 h-80 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500 mb-4 animate-fade-in">
                  No Image
                </div>
              )}
              <div className="text-center mt-2">
                <h2 className="text-2xl font-bold text-[#153D36] mb-1">
                  {bookDetail.nameBook}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">Tác giả: </span>
                  {bookDetail.authors.map((a) => a.nameAuthor).join(", ")}
                </p>
                <p className="text-xs text-gray-400">
                  Năm: {bookDetail.reprintYear}
                </p>
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up">
                <h3 className="text-xl font-semibold mb-2 text-[#1A4E46]">
                  Mô tả sách
                </h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  {bookDetail.describe}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up">
                <h4 className="font-semibold mb-4 text-[#1A4E46]">
                  Đánh giá sản phẩm
                </h4>
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
                            className="bg-yellow-400 h-2 rounded transition-all duration-500"
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
                          )}%
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <button
                        className="text-red-600 border border-red-500 rounded px-4 py-1 hover:bg-red-50 transition text-sm flex items-center gap-1 animate-fade-in"
                        onClick={() => setShowModal(true)}
                      >
                        ✎ Viết đánh giá
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 animate-fade-in-up">
            <h3 className="font-semibold text-lg mb-3 text-[#1A4E46]">
              Nhận xét:
            </h3>
            <div className="space-y-4">
              {comments.map((cmt) => (
                <div
                  key={cmt.idEvaluation}
                  className="flex items-start gap-3 relative group animate-fade-in"
                >
                  <img
                    src={
                      cmt.avatarUrl !== null && cmt.avatarUrl !== ""
                        ? cmt.avatarUrl
                        : `https://i.pravatar.cc/40?u=${cmt.idReader}`
                    }
                    alt="avatar"
                    className="rounded-full w-10 h-10 object-cover border-2 border-[#1A4E46] shadow group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="bg-gray-100 p-3 rounded-xl shadow w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#153D36]">
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
                          <div className="absolute right-0 mt-1 bg-white border rounded shadow-md text-sm z-10 min-w-[120px] animate-fade-in">
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
                    <p className="mt-1 text-gray-700">{cmt.comment}</p>
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
            if (bookDetail.idBook) {
              getAllComments(bookDetail.idBook).then(setComments);
              getStarByIdBookAPI(bookDetail.idBook).then((data) => {
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
              });
            }
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

// Tailwind CSS animation utilities
// Thêm vào global.css nếu chưa có:
// .animate-fade-in { animation: fadeIn 0.7s; }
// .animate-fade-in-up { animation: fadeInUp 0.7s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
