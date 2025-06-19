import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { getLoanSlipHistoryAPI, getBookAndCommentsByIdAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
import { FaInfoCircle, FaUser, FaCalendarAlt, FaBook, FaBookOpen, FaIdCard } from "react-icons/fa";

const UserBorrows = () => {
  const { user } = useCurrentApp();
  const [loans, setLoans] = useState<ILoanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<ILoanHistory | null>(null);
  const [authorNames, setAuthorNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.idReader) {
        setLoading(false);
        return;
      }
      try {
        const res = await getLoanSlipHistoryAPI(user.idReader);
        setLoans(res || []);
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu phiếu mượn!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Fetch author name for a book
  const fetchAuthorName = async (idBook: string) => {
    if (authorNames[idBook]) return authorNames[idBook];
    try {
      const res = await getBookAndCommentsByIdAPI("", idBook);
      const name = res?.data?.authors?.[0]?.nameAuthor || "Không rõ";
      setAuthorNames((prev) => ({ ...prev, [idBook]: name }));
      return name;
    } catch {
      return "Không rõ";
    }
  };

  // Preload author names for all books in loans
  useEffect(() => {
    loans.forEach((loan) => {
      if (!authorNames[loan.idBook]) fetchAuthorName(loan.idBook);
    });
    // eslint-disable-next-line
  }, [loans]);

  const showModal = (loan: ILoanHistory) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#14532d]">
        DANH SÁCH PHIẾU MƯỢN
      </h2>
      <div className="overflow-x-auto shadow rounded-md bg-white p-4">
        <table className="min-w-full">
          <thead className="bg-[#14532d] text-white text-left">
            <tr>
              <th className="px-4 py-3 w-12">STT</th>
              <th className="px-4 py-3">Ảnh</th>
              <th className="px-4 py-3">Mã sách</th>
              <th className="px-4 py-3">Tên sách</th>
              <th className="px-4 py-3">Thể loại</th>
              <th className="px-4 py-3">Tác giả</th>
              <th className="px-4 py-3">Độc giả</th>
              <th className="px-4 py-3">Ngày mượn</th>
              <th className="px-4 py-3">Ngày trả</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : loans.length > 0 ? (
              loans.map((item, index) => (
                <tr key={item.idBook} className="border-b hover:bg-[#dcfce7] transition duration-200">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.avatarUrl ? (
                      <img src={item.avatarUrl} alt={item.nameBook} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span>Không có</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.idBook}</td>
                  <td className="px-4 py-3 text-sm">{item.nameBook}</td>
                  <td className="px-4 py-3 text-sm">{item.genre}</td>
                  <td className="px-4 py-3 text-sm">{authorNames[item.idBook] || "Đang tải..."}</td>
                  <td className="px-4 py-3 text-sm">{user?.nameReader || "Không xác định"}</td>
                  <td className="px-4 py-3 text-sm">{item.dateBorrow?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-sm">{item.dateReturn?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => showModal(item)}
                      className="text-[#14532d] hover:text-[#22c55e] transition duration-200"
                    >
                      <FaInfoCircle className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-4 text-gray-500">
                  Không có dữ liệu phiếu mượn.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        title={
          <div className="flex items-center text-[#14532d] text-xl">
            <FaInfoCircle className="mr-3 text-2xl" />
            <span className="font-semibold">CHI TIẾT PHIẾU MƯỢN</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        className="rounded-lg max-w-md"
      >
        {selectedLoan && (
          <div className="p-4 border border-[#e5e7eb] rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-start mb-6">
              {selectedLoan.avatarUrl && (
                <div className="w-24 h-32 border border-[#e5e7eb] rounded-md overflow-hidden mr-4 flex-shrink-0">
                  <img
                    src={selectedLoan.avatarUrl}
                    alt={selectedLoan.nameBook}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedLoan.nameBook}</h3>
                <p className="text-gray-600 mb-1">{selectedLoan.genre}</p>
                <p className="text-sm text-gray-500">Mã sách: {selectedLoan.idBook}</p>
                <p className="text-sm text-gray-500">Tác giả: {authorNames[selectedLoan.idBook] || "Đang tải..."}</p>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-[#e5e7eb] my-4"></div>
            {/* Thông tin độc giả */}
            <div className="mb-4">
              <div className="flex items-center text-gray-700 mb-2">
                <FaUser className="mr-2 text-[#14532d]" />
                <span className="font-medium">Thông tin độc giả</span>
              </div>
              <p className="pl-6">{user?.nameReader || "Không xác định"}</p>
            </div>
            {/* Thông tin mượn trả */}
            <div>
              <div className="flex items-center text-gray-700 mb-2">
                <FaCalendarAlt className="mr-2 text-[#14532d]" />
                <span className="font-medium">Thông tin mượn trả</span>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex">
                  <span className="w-28 text-gray-600">Ngày mượn:</span>
                  <span className="font-medium">
                    {selectedLoan.dateBorrow ? new Date(selectedLoan.dateBorrow).toLocaleDateString('vi-VN') : "N/A"}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-28 text-gray-600">Ngày trả:</span>
                  <span className={selectedLoan.dateReturn ? "font-medium" : "text-orange-500 font-medium"}>
                    {selectedLoan.dateReturn
                      ? new Date(selectedLoan.dateReturn).toLocaleDateString('vi-VN')
                      : "Chưa trả"}
                  </span>
                </div>
              </div>
            </div>
            {/* Thông báo trạng thái */}
            {!selectedLoan.dateReturn && (
              <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-2 text-sm text-amber-700 rounded-r">
                <FaInfoCircle className="inline mr-2" />
                Sách đang được mượn, vui lòng trả đúng hạn
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserBorrows;