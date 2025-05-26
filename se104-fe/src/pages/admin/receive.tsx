import React, { useState, useEffect } from "react";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addBookAPI } from "@/services/api";

const ReceiveBook = () => {
  const [today, setToday] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [bookImage, setBookImage] = useState<File | null>(null);

  const [form, setForm] = useState({
    nameHeaderBook: "",
    describeBook: "",
    idTypeBook: "",
    idAuthors: [] as string[],
    publisher: "",
    reprintYear: new Date().getFullYear(),
    valueOfBook: 0,
  });

  useEffect(() => {
    const current = new Date();
    const formatted = current.toISOString().slice(0, 10);
    setToday(formatted);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = ({ file }: any) => {
    if (file && file.originFileObj) {
      setBookImage(file.originFileObj);
      setPreviewImage(URL.createObjectURL(file.originFileObj));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("IdTypeBook", form.idTypeBook);
      formData.append("NameHeaderBook", form.nameHeaderBook);
      formData.append("DescribeBook", form.describeBook);
      form.idAuthors.forEach((id) => formData.append("IdAuthors", id));
      formData.append("bookCreateRequest.Publisher", form.publisher);
      formData.append(
        "bookCreateRequest.ReprintYear",
        form.reprintYear.toString()
      );
      formData.append(
        "bookCreateRequest.ValueOfBook",
        form.valueOfBook.toString()
      );
      if (bookImage) formData.append("BookImage", bookImage);

      await addBookAPI(formData);
      message.success("Thêm sách thành công!");
    } catch (err) {
      console.error(err);
      message.error("Thêm sách thất bại!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white border border-black"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-8">
        <h2 className="text-2xl font-bold text-[#153D36] text-center mb-6">
          THÔNG TIN SÁCH
        </h2>

        <div className="flex justify-center gap-10">
          <div className="w-1/4 flex items-start justify-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Book"
                className="rounded-lg shadow-lg w-48"
              />
            ) : (
              <div className="rounded-lg shadow-lg w-48 h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">Chưa có ảnh</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="w-1/2 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Tên sách
              </label>
              <input
                type="text"
                name="nameHeaderBook"
                value={form.nameHeaderBook}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Nhà xuất bản
              </label>
              <input
                type="text"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-[#153D36]">
                  Năm tái bản
                </label>
                <input
                  type="number"
                  name="reprintYear"
                  value={form.reprintYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-[#153D36]">
                  Thể loại
                </label>
                <select
                  name="idTypeBook"
                  value={form.idTypeBook}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                >
                  <option value="">-- Chọn thể loại --</option>
                  <option value="1">Loại A</option>
                  <option value="2">Loại B</option>
                  <option value="3">Loại C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Trị giá
              </label>
              <input
                type="number"
                name="valueOfBook"
                value={form.valueOfBook}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Ngày nhận
              </label>
              <input
                type="date"
                value={today}
                readOnly
                className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#153D36]">
                Mô tả
              </label>
              <textarea
                name="describeBook"
                value={form.describeBook}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <Upload
                beforeUpload={() => false}
                onChange={handleImageChange}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-[#27AE60] text-white px-6 py-2 rounded text-sm font-semibold"
              >
                Thêm sách
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceiveBook;
