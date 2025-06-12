import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import { getAuthorByID } from "@/services/api";

const AuthorInfo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [authorDetail, setAuthorDetail] = useState<IGetAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        setLoading(true);
        if (!id || !token) {
          message.error("Thiếu ID tác giả hoặc token.");
          return;
        }

        const res = await getAuthorByID(token, id);
        if (res) {
          setAuthorDetail(res);
        } else {
          message.error("Không lấy được thông tin tác giả.");
        }
      } catch (error) {
        console.error(error);
        message.error("Lỗi khi lấy dữ liệu tác giả.");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Đang tải thông tin tác giả...
      </div>
    );
  }

  if (!authorDetail) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        Không tìm thấy thông tin tác giả.
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f9] min-h-screen px-4 sm:px-6 md:px-12 py-6">
      <div className="bg-white rounded-xl shadow p-6 md:p-8">
        {/* Ảnh + Thông tin tác giả */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <img
            src={authorDetail.urlAvatar || "/default-avatar.png"}
            alt={authorDetail.nameAuthor}
            className="w-full md:w-54 h-44 md:h-72 object-cover rounded-lg shadow"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#154734] mb-2">
              {authorDetail.nameAuthor}
            </h1>
            <p className="text-gray-600 mb-2">
              <strong>Quốc tịch:</strong> {authorDetail.nationality}
            </p>
            <p className="text-gray-700 whitespace-pre-line text-justify">
              {authorDetail.biography}
            </p>
          </div>
        </div>

        {/* Danh sách sách */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-[#154734]">
            Tác phẩm của {authorDetail.nameAuthor}
          </h2>
          <span
            className="text-blue-500 text-sm cursor-pointer"
            onClick={() => navigate("/all-books")}
          >
            Xem tất cả &gt;
          </span>
        </div>

        {authorDetail.books.length === 0 ? (
          <p className="text-gray-500">Tác giả chưa có sách nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {authorDetail.books.map((book) => (
              <div
                key={book.idBook}
                onClick={() => navigate(`/detail/${book.idBook}`)}
                className="cursor-pointer bg-white rounded-xl shadow hover:shadow-md transition duration-200 flex flex-col"
              >
                {book.urlImage && book.urlImage.trim() !== "" ? (
                  <img
                    src={book.urlImage}
                    alt={book.nameBook}
                    className="h-40 w-full object-cover rounded-t-xl"
                  />
                ) : (
                  <div className="h-52 bg-gray-200 rounded-t-xl" />
                )}
                <div className="p-3 flex flex-col flex-grow justify-between">
                  <p className="text-sm font-semibold text-[#154734] leading-tight line-clamp-2 mb-1">
                    {book.nameBook}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {book.publisher || "Không rõ nhà xuất bản"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;
