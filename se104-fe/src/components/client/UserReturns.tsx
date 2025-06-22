import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { FaInfoCircle, FaUser, FaBook, FaCalendarAlt } from "react-icons/fa";
import { useCurrentApp } from "@/components/context/app.context";
import { getReceiptHistoryAPI } from "@/services/api";

const UserReturns = () => {
  const { user } = useCurrentApp();
  const [returns, setReturns] = useState<IReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<IReturn | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.idReader) {
        setLoading(false);
        return;
      }
      try {
        const res = await getReceiptHistoryAPI(user.idReader);
        console.log("Receipt History:", res);
        setReturns(res || []);
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu trả sách!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const showModal = (returnItem: IReturn) => {
    setSelectedReturn(returnItem);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedReturn(null);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#14532d]">
        DANH SÁCH TRẢ SÁCH
      </h2>
      <div className="overflow-x-auto shadow rounded-md bg-white p-4">
        <table className="min-w-full">
          <thead className="bg-[#14532d] text-white text-left">
            <tr>
              <th className="px-4 py-3 w-12">STT</th>
              <th className="px-4 py-3">Mã sách</th>
              <th className="px-4 py-3">Tên sách</th>
              <th className="px-4 py-3">Ngày mượn</th>
              <th className="px-4 py-3">Ngày trả</th>
              <th className="px-4 py-3">Số ngày mượn</th>
              <th className="px-4 py-3">Tiền phạt</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : returns.filter((item) => item.isReturned === true).length >
              0 ? (
              returns
                .filter((item) => item.isReturned === true)
                .map((item, index) => (
                  <tr
                    key={item.idLoanSlipBook}
                    className="border-b hover:bg-[#dcfce7] transition duration-200"
                  >
                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                    <td className="px-4 py-3 text-sm">{item.idBook}</td>
                    <td className="px-4 py-3 text-sm">{item.nameBook}</td>
                    <td className="px-4 py-3 text-sm">
                      {item.borrowDate?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {item.returnDate?.slice(0, 10)}
                    </td>
                    <td className="px-4 py-3 text-sm">{item.loanPeriod}</td>
                    <td className="px-4 py-3 text-sm">{item.fineAmount}</td>
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
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Không có dữ liệu trả sách.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal
        title={
          <div className="flex items-center text-[#14532d]">
            <FaInfoCircle className="mr-2" />
            <span>CHI TIẾT THÔNG TIN TRẢ SÁCH</span>
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        className="rounded-md max-w-md"
      >
        {selectedReturn && (
          <div className="space-y-5 mt-2">
            {/* Độc giả */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <FaUser className="text-[#14532d] text-xl" />
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Độc giả
                </div>
                <div className="font-semibold text-gray-800">
                  {user?.nameReader || "Không xác định"}
                </div>
              </div>
            </div>
            {/* Sách */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
              <FaBook className="text-[#14532d] text-xl" />
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">
                  Sách
                </div>
                <div className="font-semibold text-gray-800">
                  {selectedReturn.nameBook}
                </div>
                <div className="text-xs text-gray-500">
                  Mã sách:{" "}
                  <span className="font-medium text-gray-700">
                    {selectedReturn.idBook}
                  </span>
                </div>
              </div>
            </div>
            {/* Mượn trả */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-[#14532d] mr-2" />
                <h3 className="font-semibold">Thông tin mượn trả</h3>
              </div>
              <div className="pl-6 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày mượn:</span>
                  <span className="font-medium">
                    {formatDate(selectedReturn.borrowDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày trả:</span>
                  <span className="font-medium">
                    {formatDate(selectedReturn.returnDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số ngày mượn:</span>
                  <span className="font-medium">
                    {selectedReturn.loanPeriod} ngày
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserReturns;
