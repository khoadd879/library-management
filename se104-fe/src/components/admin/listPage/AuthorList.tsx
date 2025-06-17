import { useEffect, useState } from "react";
import { message, Modal } from "antd"; // dùng Modal xác nhận
import {
  deleteAuthorAPI,
  getListAuthor,
  getTypeBooksAPI,
  updateAuthorAPI,
} from "@/services/api";
import UpdateAuthorModal from "../user/UpdateAuthorModal";
interface Props {
  keyword: string;
}
const AuthorList = ({ keyword }: Props) => {
  const [authors, setAuthors] = useState<IAddAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeBookOptions, setTypeBookOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<IAddAuthor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypeBooks = async () => {
      try {
        const res = await getTypeBooksAPI();
        console.log(res);
        const options = res.map((item: any) => ({
          value: item.idTypeBook,
          label: item.nameTypeBook,
        }));
        setTypeBookOptions(options);
      } catch (err) {
        console.error("Lỗi khi lấy thể loại sách:", err);
        message.error("Không thể tải thể loại sách.");
      }
    };
    fetchTypeBooks();
  }, []);

  const loadAuthors = async () => {
    setLoading(true);
    try {
      const res = await getListAuthor();
      setAuthors(res || []);
    } catch (err) {
      console.error("Lỗi khi tải tác giả:", err);
      message.error("Không thể tải danh sách tác giả.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleEdit = (author: IAddAuthor) => {
    setSelectedAuthor(author);
    setOpenModal(true);
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    if (!selectedAuthor) return;
    setIsSubmitting(true);
    try {
      await updateAuthorAPI(selectedAuthor.idAuthor, formData);
      message.success("Cập nhật tác giả thành công!");
      setOpenModal(false);
      await loadAuthors();
    } catch (err) {
      console.error(err);
      message.error("Cập nhật tác giả thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteAuthorAPI(pendingDeleteId);
      message.success("Đã xoá tác giả thành công!");
      await loadAuthors();
    } catch (err) {
      console.error("Lỗi khi xoá tác giả:", err);
      message.error("Xoá tác giả thất bại!");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const pendingAuthor = authors.find((a) => a.idAuthor === pendingDeleteId);

  if (loading) return <div className="p-4">Đang tải danh sách tác giả...</div>;
  const filteredAuthors = authors.filter((author) =>
    author.nameAuthor.toLowerCase().includes(keyword.toLowerCase())
  );
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
          {filteredAuthors.map((author) => (
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
                <button
                  className="text-red-500"
                  onClick={() => setPendingDeleteId(author.idAuthor)}
                >
                  🗑️
                </button>
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

      <Modal
        title="Xác nhận xoá tác giả"
        open={!!pendingDeleteId}
        onOk={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xoá tác giả{" "}
          <strong>{pendingAuthor?.nameAuthor || "này"}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default AuthorList;
