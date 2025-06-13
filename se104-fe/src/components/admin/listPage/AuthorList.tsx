import {
  getListAuthor,
  getTypeBooksAPI,
  updateAuthorAPI,
} from "@/services/api";
import { useEffect, useState } from "react";
import { message } from "antd";
import UpdateAuthorModal from "../user/UpdateAuthorModal";
const AuthorList = () => {
  const [authors, setAuthors] = useState<IAddAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<IAddAuthor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeBookOptions, setTypeBookOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const handleEdit = (author: IAddAuthor) => {
    setSelectedAuthor(author);
    setOpenModal(true);
  };
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getTypeBooksAPI();
        console.log(res);
        const unique = Array.from(
          new Map(res?.map((item: any) => [item.idTypeBook, item])).values()
        ).map((item: any) => ({
          value: item.idTypeBook,
          label: item.typeBook,
        }));

        setTypeBookOptions(unique);
      } catch (err) {
        console.error("Lỗi lấy thể loại sách:", err);
        message.error("Không thể lấy danh sách thể loại sách.");
      }
    };

    fetchTypes();
  }, [message]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await getListAuthor();
        if (res) {
          setAuthors(res);
        }
      } catch (err) {
        console.error("Failed to load authors", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);
  const handleUpdateSubmit = async (formData: FormData) => {
    if (!selectedAuthor) return;
    setIsSubmitting(true);
    try {
      await updateAuthorAPI(selectedAuthor.idAuthor, formData);
      message.success("Cập nhật tác giả thành công!");
      setOpenModal(false);
      const res = await getListAuthor();
      if (res) setAuthors(res);
    } catch (err) {
      console.error(err);
      message.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) return <div className="p-4">Đang tải danh sách tác giả...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-[#153D36] font-medium">
          <tr>
            <th className="px-4 py-3">Photo</th>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Thể loại</th>
            <th className="px-4 py-3">Quốc tịch</th>
            <th className="px-4 py-3">Tiểu sử</th>
            <th className="px-4 py-3 text-center">Tuỳ chỉnh</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.idAuthor} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                {author.urlAvatar ? (
                  <img
                    src={author.urlAvatar}
                    alt={author.nameAuthor}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                )}
              </td>
              <td className="px-4 py-2 font-medium text-[#153D36]">
                {author.nameAuthor}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {author.idTypeBook.nameTypeBook}
              </td>
              <td className="px-4 py-2 text-gray-700">{author.nationality}</td>
              <td className="px-4 py-2 text-gray-700 line-clamp-1">
                {author.biography}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="mr-2 text-black"
                  onClick={() => handleEdit(author)}
                >
                  ✏️
                </button>
                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedAuthor && (
        <UpdateAuthorModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          initialData={{
            nameAuthor: selectedAuthor.nameAuthor,
            nationality: selectedAuthor.nationality,
            idTypeBook: selectedAuthor.idTypeBook.idTypeBook,
            biography: selectedAuthor.biography,
            urlAvatar: selectedAuthor.urlAvatar,
          }}
          typeBookOptions={typeBookOptions}
          onSubmit={handleUpdateSubmit}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default AuthorList;
