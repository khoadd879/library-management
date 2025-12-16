import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listAuthorAPI } from "@/services/api";
import { Spin } from "antd";

const AuthorPage = () => {
  const [authors, setAuthors] = useState<IAddAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await listAuthorAPI();
        setAuthors(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuthors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f7f9] to-[#e0f7fa] w-full px-4 md:px-12 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 bg-[#153D36] px-8 py-6 rounded-t-2xl shadow-lg text-white animate-fade-in-up">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide mb-1">
            Danh sách tác giả
          </h2>
          <p className="text-sm md:text-base opacity-80">
            Tổng cộng: <span className="font-semibold">{authors.length}</span>{" "}
            tác giả
          </p>
        </div>
      </div>
      <div className="bg-white shadow-xl rounded-b-2xl overflow-x-auto animate-fade-in-up">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spin size="large" />
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-lg font-medium">
            Không có tác giả nào.
          </div>
        ) : (
          <table className="w-full text-sm md:text-base text-left">
            <thead className="bg-gradient-to-r from-[#e0f7fa] to-[#f4f7f9] text-[#153D36] font-semibold">
              <tr>
                <th className="px-4 py-3 text-center">Ảnh</th>
                <th className="px-4 py-3">Tên tác giả</th>
                <th className="px-4 py-3">Quốc tịch</th>
                <th className="px-4 py-3">Thể loại</th>
                <th className="px-4 py-3">Tiểu sử</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr
                  key={author.idAuthor}
                  className="border-t hover:bg-[#f4f7f9] transition duration-150 group cursor-pointer"
                  onClick={() => navigate(`/authorInfo/${author.idAuthor}`)}
                >
                  <td className="px-4 py-3 text-center align-middle">
                    {author.urlAvatar ? (
                      <img
                        src={author.urlAvatar}
                        alt={author.nameAuthor}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#e0f7fa] shadow group-hover:scale-105 transition mx-auto block"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-xl border-2 border-[#e0f7fa] shadow mx-auto">
                        <span>?</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#153D36]">
                    {author.nameAuthor}
                  </td>
                  <td className="px-4 py-3">{author.nationality}</td>
                  <td className="px-4 py-3">
                    {author.idTypeBook.nameTypeBook}
                  </td>
                  <td
                    className="px-4 py-3 text-gray-600 max-w-xs truncate"
                    title={author.biography}
                  >
                    {author.biography}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuthorPage;
