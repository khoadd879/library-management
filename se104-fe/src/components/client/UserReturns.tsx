import React, { useEffect, useState } from "react";
import { Modal, message } from "antd";
import { FaInfoCircle, FaUser, FaBook, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import { useCurrentApp } from "@/components/context/app.context";
import { getReceiptHistoryAPI, getPenaltiesByIdAPI } from "@/services/api";


const UserReturns = () => {
  const { user } = useCurrentApp();
  const [returns, setReturns] = useState<IReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<IReturn | null>(null);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [debtLoading, setDebtLoading] = useState(false);
  const [debtError, setDebtError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.idReader) {
        setLoading(false);
        return;
      }
      try {
        const res = await getReceiptHistoryAPI(user.idReader);
        setReturns(res || []);
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu trả sách!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const showModal = async (returnItem: IReturn) => {
    setSelectedReturn(returnItem);
    setIsModalVisible(true);
    setDebtLoading(true);
    setDebtError(null);
    setTotalDebt(0);
    if (user?.idReader) {
      try {
        const penalties = await getPenaltiesByIdAPI(user.idReader);
        let total = 0;
        if (Array.isArray(penalties) && penalties.length > 0) {
          total = penalties[0].totalDebit;
        } else if (penalties && typeof penalties.totalDebit === 'number') {
          total = penalties.totalDebit;
        }
        setTotalDebt(total);
      } catch (err) {
        setDebtError("Lỗi khi tải tổng nợ!");
      } finally {
        setDebtLoading(false);
      }
    } else {
      setDebtLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedReturn(null);
    setTotalDebt(0);
    setDebtError(null);
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
            ) : returns.length > 0 ? (
              returns.map((item, index) => (
                <tr key={item.idLoanSlipBook} className="border-b hover:bg-[#dcfce7] transition duration-200">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{item.idBook}</td>
                  <td className="px-4 py-3 text-sm">{item.nameBook}</td>
                  <td className="px-4 py-3 text-sm">{item.borrowDate?.slice(0, 10)}</td>
                  <td className="px-4 py-3 text-sm">{item.returnDate?.slice(0, 10)}</td>
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
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaUser className="text-[#14532d] mr-2" />
                <h3 className="font-semibold">THÔNG TIN ĐỘC GIẢ</h3>
              </div>
              <p className="pl-6">{user?.nameReader || "Không xác định"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaBook className="text-[#14532d] mr-2" />
                <h3 className="font-semibold">THÔNG TIN SÁCH</h3>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã sách:</span>
                  <span className="font-medium">{selectedReturn.idBook}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên sách:</span>
                  <span className="font-medium">{selectedReturn.nameBook}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaCalendarAlt className="text-[#14532d] mr-2" />
                <h3 className="font-semibold">THÔNG TIN MƯỢN TRẢ</h3>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày mượn:</span>
                  <span className="font-medium">
                    {selectedReturn.borrowDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày trả:</span>
                  <span className="font-medium">
                    {selectedReturn.returnDate}
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

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaMoneyBillWave className="text-[#14532d] mr-2" />
                <h3 className="font-semibold">THÔNG TIN PHẠT</h3>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiền phạt kỳ này:</span>
                  <span className={`font-medium ${selectedReturn.fineAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedReturn.fineAmount?.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng nợ:</span>
                  {debtLoading ? (
                    <span className="font-medium text-gray-400">Đang tải...</span>
                  ) : debtError ? (
                    <span className="font-medium text-red-600">{debtError}</span>
                  ) : (
                    <span className={`font-medium ${totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {totalDebt.toLocaleString()} VNĐ
                    </span>
                  )}
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