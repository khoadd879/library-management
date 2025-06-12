import { useEffect, useState } from "react";
import { getAllBooksAndCommentsAPI } from "@/services/api";

const BookList = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getAllBooksAndCommentsAPI();
        setBooks(res);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="p-4">Đang tải sách...</div>;

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
          {books.map((book) => (
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
              <td className="px-4 py-2 text-gray-700 line-clamp-1">
                {book.describe}
              </td>
              <td className="px-4 py-2 text-gray-700">{book.valueOfbook}đ</td>
              <td className="px-4 py-2 text-center">
                <button className="mr-2 text-black">✏️</button>
                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;
