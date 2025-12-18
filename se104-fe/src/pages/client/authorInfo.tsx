import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuthorByID } from "@/services/api";
import { Spin } from "antd";

const AuthorInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState<IGetAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token") || "";
        const res = await getAuthorByID(token, id || "");
        setAuthor(res);
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="text-center text-gray-500 py-10">
        Không tìm thấy tác giả.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-lg p-8 mb-8">
        <div className="relative group">
          <img
            src={
              author.urlAvatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt={author.nameAuthor}
            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-3xl font-bold text-[#153D36] animate-slide-in">
            {author.nameAuthor}
          </h2>
          <p className="text-gray-700 italic animate-fade-in">
            {author.nationality}
          </p>
          <p className="text-gray-600 animate-fade-in">{author.biography}</p>
        </div>
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-[#1A4E46] animate-fade-in">
        Sách của tác giả
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {author.books && author.books.length > 0 ? (
          author.books.map((book) => (
            <div
              key={book.idBook}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer relative animate-fade-in-up group"
              onClick={() => window.location.assign(`/detail/${book.idBook}`)}
            >
              <div className="aspect-[2/3] bg-gray-100 relative">
                {book.urlImage ? (
                  <img
                    src={book.urlImage}
                    alt={book.nameBook}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-[#153D36] transition-colors duration-300 text-center">
                  {book.nameBook}
                </h4>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {book.publisher}
                </p>
                <span className="text-xs text-gray-400 block text-center">
                  Năm: {book.reprintYear}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 italic">
            Chưa có sách nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;

// Tailwind CSS animation utilities
// Thêm vào global.css nếu chưa có:
// .animate-fade-in { animation: fadeIn 0.7s; }
// .animate-fade-in-up { animation: fadeInUp 0.7s; }
// .animate-slide-in { animation: slideIn 0.7s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
// @keyframes slideIn { from { opacity: 0; transform: translateX(-30px);} to { opacity: 1; transform: none; } }
