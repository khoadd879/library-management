import React, { useEffect, useState } from "react";
import { addLoanBookAPI, getAllReadersAPI } from "@/services/api";
import { message, Spin } from "antd";

const BorrowForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const [idReader, setIdReader] = useState("");
  const [idTheBook, setIdTheBook] = useState("");
  const [readers, setReaders] = useState<
    { idReader: string; nameReader: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const res = await getAllReadersAPI();
        if (res && Array.isArray(res)) {
          setReaders(res);
        } else {
          message.error("Không thể tải danh sách độc giả");
        }
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi tải danh sách độc giả");
      }
    };

    fetchReaders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await addLoanBookAPI(idReader, idTheBook);
      console.log(res);
      if (res && res.statusCode === 200) {
        setIdReader("");
        setIdTheBook("");
        message.success("Thêm phiếu mượn thành công!");
      } else {
        message.error(res?.data.message || "Thêm phiếu mượn thất bại!");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi gửi dữ liệu!");
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
          Phiếu mượn sách
        </h2>

        <div>
          <label className="block text-sm font-medium text-[#153D36]">
            Độc giả
          </label>
          <select
            value={idReader}
            onChange={(e) => setIdReader(e.target.value)}
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
          <label className="block text-sm font-medium text-[#153D36]">
            Mã sách (idTheBook)
          </label>
          <input
            type="text"
            value={idTheBook}
            onChange={(e) => setIdTheBook(e.target.value)}
            placeholder="Nhập mã sách..."
            className="w-full px-4 py-2 border rounded outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#153D36]">
            Ngày mượn
          </label>
          <input
            type="date"
            value={today}
            readOnly
            className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
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

export default BorrowForm;
