import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import {
  getAllBooksAndCommentsAPI,
  deleteBookAPI,
  getListAuthor,
  getTypeBooksAPI,
  updateBookAPI,
} from "@/services/api";
import UpdateBookModal from "../user/UpdateBookModal";
interface Props {
  keyword: string;
}
const BookList = ({ keyword }: Props) => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [typeBooks, setTypeBooks] = useState<
    { value: string; label: string }[]
  >([]);
  const [authors, setAuthors] = useState<{ id: string; nameAuthor: string }[]>(
    []
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getAllBooksAndCommentsAPI();
      setBooks(res);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
      message.error("Không thể tải danh sách sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteBookAPI(pendingDeleteId);
      message.success("Đã xoá sách thành công!");
      await fetchBooks();
    } catch (err) {
      console.error("Lỗi xoá sách:", err);
      message.error("Không thể xoá sách!");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const openUpdateModal = async (book: IBook) => {
    try {
      const [typeRes, authorRes] = await Promise.all([
        getTypeBooksAPI(),
        getListAuthor(),
      ]);

      setTypeBooks(
        typeRes.map((t: any) => ({
          value: t.idTypeBook,
          label: t.nameTypeBook,
        }))
      );

      setAuthors(
        authorRes.map((a: any) => ({
          id: a.idAuthor,
          nameAuthor: a.nameAuthor,
        }))
      );

      setSelectedBook(book);
    } catch (err) {
      message.error("Không thể tải dữ liệu cập nhật sách");
    }
  };

  const handleUpdateBook = async (idBook: string, formData: FormData) => {
    setIsUpdating(true);
    try {
      await updateBookAPI(idBook, formData);
      message.success("Cập nhật sách thành công!");
      await fetchBooks();
      setSelectedBook(null);
    } catch (err) {
      console.error(err);
      message.error("Cập nhật sách thất bại!");
    } finally {
      setIsUpdating(false);
    }
  };

  const pendingBook = books.find((b) => b.idBook === pendingDeleteId);

  if (loading) return <div className="p-4">Đang tải sách...</div>;
  const filteredBooks = books.filter((book) =>
    book.nameBook.toLowerCase().includes(keyword.toLowerCase())
  );
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-[#153D36] font-medium">
          <tr>
            <th className="px-4 py-3">Ảnh sách</th>
            <th className="px-4 py-3">Tên sách</th>
            <th className="px-4 py-3">Tác giả</th>
            <th className="px-4 py-3">Thể loại</th>
            <th className="px-4 py-3">Mô tả</th>
            <th className="px-4 py-3">Trị giá</th>
            <th className="px-4 py-3 text-center">Tuỳ chỉnh</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => (
            <tr key={book.idBook} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.nameBook}
                    className="w-10 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-14 bg-gray-200 rounded" />
                )}
              </td>
              <td className="px-4 py-2 font-medium text-[#153D36]">
                {book.nameBook}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {book.authors.map((a) => a.nameAuthor).join(", ")}
              </td>
              <td className="px-4 py-2 text-gray-700">
                {book.authors[0]?.idTypeBook?.nameTypeBook || "Không rõ"}
              </td>
              <td className="px-4 py-2 text-gray-700 line-clamp-4">
                {book.describe}
              </td>
              <td className="px-4 py-2 text-gray-700">{book.valueOfbook}đ</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="mr-2 text-black"
                  onClick={() => openUpdateModal(book)}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500"
                  onClick={() => setPendingDeleteId(book.idBook)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title="Xác nhận xoá sách"
        open={!!pendingDeleteId}
        onOk={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xoá sách{" "}
          <strong>{pendingBook?.nameBook || "này"}</strong>?
        </p>
      </Modal>

      {selectedBook && (
        <UpdateBookModal
          open={!!selectedBook}
          onClose={() => setSelectedBook(null)}
          initialData={{
            idBook: selectedBook.idBook,
            nameHeaderBook: selectedBook.nameBook,
            describeBook: selectedBook.describe,
            idTypeBook: selectedBook.authors[0]?.idTypeBook?.idTypeBook || "",
            idAuthors: selectedBook.authors.map((a) => a.idAuthor),
            publisher: selectedBook.publisher || "",
            reprintYear: selectedBook.reprintYear || 2024,
            valueOfBook: selectedBook.valueOfbook || 0,
            imageUrl: selectedBook.image || undefined,
          }}
          authors={authors}
          typeBooks={typeBooks}
          onSubmit={handleUpdateBook}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
};

export default BookList;
