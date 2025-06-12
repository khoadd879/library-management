import React, { useEffect, useState } from "react";
import {
  getAllLoanSlipsAPI,
  getAllReadersAPI,
  getAllBooksAndCommentsAPI,
  addSlipBookAPI,
} from "@/services/api";
import { message } from "antd";

interface IReaderSimple {
  idReader: string;
  nameReader: string;
}

const ListBorrow = () => {
  const [loans, setLoans] = useState<ILoanSlip[]>([]);
  const [readers, setReaders] = useState<IReaderSimple[]>([]);
  const [books, setBooks] = useState<IBook[]>([]);

  const getReaderName = (id: string) =>
    readers.find((r) => r.idReader === id)?.nameReader || "(Không rõ)";

  const getBookInfo = (id: string) =>
    books.find((b) => b.idBook === id) || { nameBook: "(Không rõ)" };

  const handleReturn = async (item: ILoanSlip) => {
    try {
      const res = await addSlipBookAPI(
        item.idLoanSlipBook,
        item.idReader,
        item.idTheBook
      );
      console.log(res);
      if (res.statusCode === 200) {
        message.success("Trả sách thành công!");
      } else {
        message.error("Trả sách thất bại!");
      }
    } catch (error) {
      console.error("Lỗi trả sách:", error);
      message.error("Lỗi kết nối khi trả sách!");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanRes, readerRes, bookRes] = await Promise.all([
          getAllLoanSlipsAPI(),
          getAllReadersAPI(),
          getAllBooksAndCommentsAPI(),
        ]);

        setLoans(Array.isArray(loanRes) ? loanRes : []);
        setReaders(Array.isArray(readerRes) ? readerRes : []);
        setBooks(Array.isArray(bookRes) ? bookRes : []);
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi tải dữ liệu!");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0fdf4] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#14532d]">
        Danh sách mượn sách của tất cả người dùng
      </h2>

      <div className="overflow-x-auto shadow rounded-xl">
        <table className="min-w-full bg-white">
          <thead className="bg-[#14532d] text-white text-left">
            <tr>
              <th className="px-4 py-3">Người mượn</th>
              <th className="px-4 py-3">Tên sách</th>
              <th className="px-4 py-3">Ngày mượn</th>
              <th className="px-4 py-3">Ngày trả</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loans.length > 0 ? (
              loans.map((item) => {
                const readerName = getReaderName(item.idReader);
                const book = getBookInfo(item.idTheBook);

                return (
                  <tr
                    key={item.idLoanSlipBook}
                    className="border-b hover:bg-[#dcfce7] transition duration-200"
                  >
                    <td className="px-4 py-3 text-sm">{readerName}</td>
                    <td className="px-4 py-3 text-sm">{book.nameBook}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(item.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(item.returnDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleReturn(item)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Trả sách
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Không có dữ liệu mượn sách.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBorrow;
