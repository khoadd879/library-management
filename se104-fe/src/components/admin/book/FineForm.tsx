import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { getAllReadersAPI, addPenaltyAPI } from "@/services/api";

interface IReaderSimple {
  idReader: string;
  nameReader: string;
}

const FineForm = () => {
  const [readers, setReaders] = useState<IReaderSimple[]>([]);
  const [selectedReaderId, setSelectedReaderId] = useState("");
  const [amountCollected, setAmountCollected] = useState<number | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const res = await getAllReadersAPI();
        if (Array.isArray(res)) setReaders(res);
      } catch (err) {
        message.error("Lỗi khi tải danh sách độc giả");
      }
    };
    fetchReaders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReaderId || amountCollected === undefined) return;
    setIsLoading(true);
    const res = await addPenaltyAPI(selectedReaderId, amountCollected);
    console.log(res);
    if (res?.status === 200) {
      message.success("Xuất phiếu thu tiền phạt thành công!");
      setSelectedReaderId("");
      setAmountCollected(undefined);
    } else {
      message.error("Xuất phiếu thất bại!");
    }

    setIsLoading(false);
  };

  return (
    <Spin spinning={isLoading} tip="Đang xử lý...">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow max-w-xl mx-auto space-y-6"
      >
        <h2 className="text-2xl font-bold text-[#153D36] text-center mb-4">
          Phiếu thu tiền phạt
        </h2>

        <div>
          <label className="block text-sm font-medium text-[#153D36] mb-1">
            Chọn độc giả
          </label>
          <select
            value={selectedReaderId}
            onChange={(e) => setSelectedReaderId(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded outline-none text-sm"
          >
            <option value="">-- Chọn độc giả --</option>
            {readers.map((r) => (
              <option key={r.idReader} value={r.idReader}>
                {r.nameReader}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#153D36] mb-1">
            Số tiền thu
          </label>
          <input
            type="number"
            value={amountCollected ?? ""}
            onChange={(e) => setAmountCollected(parseFloat(e.target.value))}
            placeholder="Nhập số tiền thu..."
            className="w-full px-4 py-2 border rounded outline-none text-sm"
            required
            min={0}
          />
        </div>

        <button
          type="submit"
          disabled={
            isLoading || !selectedReaderId || amountCollected === undefined
          }
          className={`px-6 py-2 rounded text-sm font-semibold mt-2 mx-auto block ${
            isLoading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[#17966F] text-white"
          }`}
        >
          {isLoading ? <Spin size="small" /> : "Xuất phiếu"}
        </button>
      </form>
    </Spin>
  );
};

export default FineForm;
