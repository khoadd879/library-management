import { useEffect, useState } from "react";
import { getAuthorByID } from "@/services/api";
import { useParams } from "react-router-dom";

const AuthorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const token = localStorage.getItem("token") || "";
  const [authorDetail, setAuthorDetail] = useState<IAddAuthor | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await getAuthorByID(token, id);
       
        if (res) {
          console.log("Dữ liệu tác giả trả về:", res);
          setAuthorDetail(res);
        } else {
          console.error("Không có dữ liệu tác giả:", res);
        }

      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tác giả:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!authorDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Đang tải dữ liệu tác giả...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      {/* Thông tin tác giả */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/5">
          <img
             src={authorDetail.avatarImage}
            alt={authorDetail.nameAuthor}
            className="w-full h-auto rounded-lg shadow-md object-cover"
          />

        </div>
        <div className="md:w-4/5">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {authorDetail.nameAuthor}
          </h1>
          <p className="text-gray-600 mb-2"><strong>Quốc tịch:</strong> {authorDetail.nationality}</p>
          <p className="text-gray-600 text-justify whitespace-pre-line">
            {authorDetail.biography}
          </p>
        </div>
      </div>

      {/* Danh sách sách */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(2)]
          .flatMap(() => books)
          .map((book, index) => (
            <div
              key={index}
              className="bg-white rounded shadow hover:shadow-lg transition p-2"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[300px] object-cover rounded mb-2"
              />
              <p className="text-sm font-semibold">{book.title}</p>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
      </div> */}
    </div>
  );
};

export default AuthorDetail;