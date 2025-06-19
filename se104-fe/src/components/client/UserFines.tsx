import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { getPenaltiesByIdAPI } from "@/services/api";
import { useCurrentApp } from "@/components/context/app.context";
import { FaInfoCircle, FaUser, FaMoneyBillWave, FaReceipt } from "react-icons/fa";

const UserFines = () => {
  const { user } = useCurrentApp();
  const [penalties, setPenalties] = useState<IPenalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState<IPenalty | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.idReader) {
        setLoading(false);
        return;
      }
      try {
        const res = await getPenaltiesByIdAPI(user.idReader);
        if (Array.isArray(res)) {
          setPenalties(res);
        } else if (res) {
          setPenalties([res]);
        } else {
          setPenalties([]);
        }
      } catch (err) {
        message.error("Lỗi khi tải dữ liệu phạt!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const showModal = (penalty: IPenalty) => {
    setSelectedPenalty(penalty);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#14532d]">
        DANH SÁCH PHẠT
      </h2>
      <div className="overflow-x-auto shadow rounded-md bg-white p-4">
        <table className="min-w-full">
          <thead className="bg-[#14532d] text-white text-left">
            <tr>
              <th className="px-4 py-3 w-12">STT</th>
              <th className="px-4 py-3">Ngày tạo</th>
              <th className="px-4 py-3">Tổng nợ</th>
              <th className="px-4 py-3">Đã thu</th>
              <th className="px-4 py-3">Còn lại</th>
              <th className="px-4 py-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : penalties.length > 0 ? (
              penalties.map((item, index) => (
                <tr
                  key={item.createdDate}
                  className="border-b hover:bg-[#dcfce7] transition duration-200"
                >
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">
                    {item.createdDate?.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-sm">{item.totalDebit}</td>
                  <td className="px-4 py-3 text-sm">{item.amountCollected}</td>
                  <td className="px-4 py-3 text-sm">{item.amountRemaining}</td>
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
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Không có dữ liệu phạt.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết phạt */}
      <Modal
        title={
          <div className="flex items-center text-[#14532d]">
            <FaInfoCircle className="mr-2" />
            <span>CHI TIẾT THÔNG TIN PHẠT</span>
          </div>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        className="rounded-md max-w-md"
      >
        {selectedPenalty && (
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
                <FaMoneyBillWave className="text-[#14532d] mr-2" />
                <h3 className="font-semibold">THÔNG TIN PHẠT</h3>
              </div>
              <div className="pl-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-medium">
                    {selectedPenalty.createdDate?.slice(0, 10)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng nợ:</span>
                  <span className="font-medium text-red-600">
                    {selectedPenalty.totalDebit} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã thu:</span>
                  <span className="font-medium text-green-600">
                    {selectedPenalty.amountCollected} VNĐ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Còn lại:</span>
                  <span className="font-medium text-blue-600">
                    {selectedPenalty.amountRemaining} VNĐ
                  </span>
                </div>
              </div>
            </div>

            {selectedPenalty.amountRemaining > 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
                <div className="flex items-center text-amber-700">
                  <FaReceipt className="mr-2" />
                  <span className="font-medium">Bạn còn nợ phạt chưa thanh toán</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserFines;