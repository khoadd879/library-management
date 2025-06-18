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
  const [keyword, setKeyword] = useState("");
  const [returnedIds, setReturnedIds] = useState<Set<string>>(new Set());

  const getReaderName = (id: string) =>
    readers.find((r) => r.idReader === id)?.nameReader || "(Không rõ)";

  const getBookInfo = (id: string) =>
    books.find((b) => b.idBook === id) || { nameBook: "(Không rõ)" };

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (item: ILoanSlip) => {
    try {
      const res = await addSlipBookAPI(
        item.idLoanSlipBook,
        item.idReader,
        item.idTheBook
      );

      if (res.statusCode === 200) {
        message.success("Trả sách thành công!");
        setReturnedIds((prev) => new Set(prev).add(item.idLoanSlipBook));
        await fetchData();
      }
    } catch (error) {
      console.error("Lỗi trả sách:", error);
      message.error("Lỗi kết nối khi trả sách!");
    }
  };

  const filteredLoans = loans.filter((item) => {
    const readerName = getReaderName(item.idReader);
    return readerName?.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#f0fdf4] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#14532d]">
        Danh sách mượn sách của tất cả người dùng
      </h2>

      <div className="overflow-x-auto shadow rounded-md">
        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên người mượn..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm w-80 outline-none"
          />
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-[#14532d] text-white text-left">
            <tr>
              <th className="px-4 py-3">Người mượn</th>
              <th className="px-4 py-3">Tên sách</th>
              <th className="px-4 py-3">Ngày mượn</th>
              <th className="px-4 py-3">Ngày trả</th>
              <th className="px-4 py-3">Số ngày mượn</th>
              <th className="px-4 py-3">Tiền phạt</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((item) => {
                const readerName = getReaderName(item.idReader);
                return (
                  <tr
                    key={item.idLoanSlipBook}
                    className="border-b hover:bg-[#dcfce7] transition duration-200"
                  >
                    <td className="px-4 py-3 text-sm">{readerName}</td>
                    <td className="px-4 py-3 text-sm">{item.nameBook}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(item.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(item.returnDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {item.loanPeriod}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {item.fineAmount?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {returnedIds.has(item.idLoanSlipBook) ? (
                        <span className="text-green-700 font-semibold">
                          Đã trả
                        </span>
                      ) : (
                        <button
                          onClick={() => handleReturn(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Trả sách
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
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
