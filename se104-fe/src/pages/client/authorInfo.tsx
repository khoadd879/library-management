import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthorByID } from "@/services/api";
import { Spin, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  GlobalOutlined,
  BookOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const AuthorInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<IGetAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAuthorByID(id || "");
        setAuthor(res.data);
      } catch (e) {
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <Spin size="large" />
        <p className="mt-4 text-gray-500">Đang tải thông tin tác giả...</p>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6">
          <UserOutlined className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy tác giả</h2>
        <p className="text-gray-500 mb-6">Tác giả này không tồn tại hoặc đã bị xóa</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  const bookCount = author.books?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#153D36] via-[#1E5D4A] to-[#2D7D6E] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowLeftOutlined />
            </span>
            <span className="font-medium">Quay lại</span>
          </button>

          {/* Author Info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                <img
                  src={
                    author.urlAvatar ||
                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={author.nameAuthor}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                <BookOutlined className="text-white text-xl" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {author.nameAuthor}
              </h1>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                {author.nationality && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90">
                    <GlobalOutlined />
                    {author.nationality}
                  </span>
                )}
                {author.idTypeBook && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90">
                    <BookOutlined />
                    {author.idTypeBook.nameTypeBook}
                  </span>
                )}
              </div>

              {author.biography && (
                <p className="text-white/80 leading-relaxed max-w-2xl">
                  {author.biography}
                </p>
              )}

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{bookCount}</p>
                  <p className="text-white/60 text-sm">Tác phẩm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Books Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <BookOutlined className="text-emerald-600" />
            </span>
            Tác phẩm của {author.nameAuthor}
          </h2>
          {bookCount > 0 && (
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
              {bookCount} cuốn sách
            </span>
          )}
        </div>

        {author.books && author.books.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {author.books.map((book, index) => (
              <div
                key={book.idBook}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/detail/${book.idBook}`)}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Book Cover */}
                <div className="aspect-[2/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {book.urlImage ? (
                    <img
                      src={book.urlImage}
                      alt={book.nameBook}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <BookOutlined className="text-5xl opacity-40 mb-2" />
                      <span className="text-xs opacity-60">No Cover</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Quick Info on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white text-xs font-medium flex items-center gap-1">
                      <CalendarOutlined />
                      {book.reprintYear || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-4">
                  <Tooltip title={book.nameBook} mouseEnterDelay={0.5}>
                    <h3 className="font-bold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors duration-300 text-sm leading-tight min-h-[2.5rem]">
                      {book.nameBook}
                    </h3>
                  </Tooltip>
                  
                  {book.publisher && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      📚 {book.publisher}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md">
                      {book.reprintYear || "N/A"}
                    </span>
                    {book.valueOfBook && (
                      <span className="text-emerald-600 text-xs font-semibold">
                        {book.valueOfBook.toLocaleString()}đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <BookOutlined className="text-4xl text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">Chưa có tác phẩm</h3>
            <p className="text-gray-400">Tác giả này chưa có sách trong hệ thống</p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AuthorInfo;
