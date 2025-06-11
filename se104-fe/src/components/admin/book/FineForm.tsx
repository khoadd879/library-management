import React, { useState } from "react";
import { message, Spin } from "antd";

const FineForm = () => {
  const [readerName, setReaderName] = useState("");
  const [totalDebt, setTotalDebt] = useState<number | undefined>(undefined);
  const [amountCollected, setAmountCollected] = useState<number | undefined>(
    undefined
  );
  const [remainingDebt, setRemainingDebt] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleCollectedChange = (value: string) => {
    const collected = parseFloat(value) || 0;
    setAmountCollected(collected);
    if (totalDebt !== undefined) {
      setRemainingDebt(Math.max(totalDebt - collected, 0));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Gọi API xử lý phiếu thu nếu có
      await new Promise((r) => setTimeout(r, 1000)); // giả lập xử lý
      message.success("Xuất phiếu thu tiền phạt thành công!");
      // Reset form
      setReaderName("");
      setTotalDebt(undefined);
      setAmountCollected(undefined);
      setRemainingDebt(0);
    } catch (err) {
      console.error(err);
      message.error("Đã xảy ra lỗi khi xuất phiếu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading} tip="Đang xử lý...">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4"
      >
        <h2 className="text-2xl font-bold text-[#153D36] text-center mb-4">
          Phiếu thu tiền phạt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#153D36]">
              Tên độc giả
            </label>
            <input
              type="text"
              value={readerName}
              onChange={(e) => setReaderName(e.target.value)}
              placeholder="Nhập họ tên..."
              className="w-full px-4 py-2 border rounded outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#153D36]">
              Tổng nợ
            </label>
            <input
              type="number"
              value={totalDebt ?? ""}
              onChange={(e) => setTotalDebt(parseFloat(e.target.value))}
              placeholder="Tổng nợ..."
              className="w-full px-4 py-2 border rounded outline-none text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#153D36]">
              Số tiền thu
            </label>
            <input
              type="number"
              value={amountCollected ?? ""}
              onChange={(e) => handleCollectedChange(e.target.value)}
              placeholder="Số tiền thu..."
              className="w-full px-4 py-2 border rounded outline-none text-sm"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#153D36]">
            Số tiền nợ còn lại
          </label>
          <input
            type="number"
            value={remainingDebt}
            readOnly
            className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>
        <button
          type="submit"
          disabled={
            isLoading ||
            !readerName ||
            totalDebt === undefined ||
            amountCollected === undefined
          }
          className={`px-6 py-2 rounded text-sm font-semibold mt-4 mx-auto block ${
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
