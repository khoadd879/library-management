import React, { useEffect, useState } from "react";
import { Modal, Spin, message } from "antd";

interface IUpdateBookModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    idBook: string;
    nameHeaderBook: string;
    describeBook: string;
    idTypeBook: string;
    idAuthors: string[];
    publisher: string;
    reprintYear: number;
    valueOfBook: number;
    imageUrl?: string;
  };
  authors: { id: string; nameAuthor: string }[];
  typeBooks: { value: string; label: string }[];
  onSubmit: (idBook: string, formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const UpdateBookModal = ({
  open,
  onClose,
  initialData,
  authors,
  typeBooks,
  onSubmit,
  isLoading,
}: IUpdateBookModalProps) => {
  const [form, setForm] = useState({ ...initialData });
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialData.imageUrl || null
  );
  const [bookImage, setBookImage] = useState<File | null>(null);

  useEffect(() => {
    setForm({ ...initialData });
    setPreviewImage(initialData.imageUrl || null);
    setBookImage(null);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, files } = e.target;
    if (files?.[0]) {
      const file = files[0];
      setBookImage(file);
      setPreviewImage(URL.createObjectURL(file));
    } else if (name === "idAuthors") {
      const values = Array.from(e.target.selectedOptions).map(
        (opt: any) => opt.value
      );
      setForm((prev) => ({ ...prev, idAuthors: values }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("IdTypeBook", form.idTypeBook);
      formData.append("NameHeaderBook", form.nameHeaderBook);
      formData.append("DescribeBook", form.describeBook);
      form.idAuthors.forEach((id) => formData.append("IdAuthors", id));
      formData.append("bookUpdateRequest.Publisher", form.publisher);
      formData.append(
        "bookUpdateRequest.ReprintYear",
        form.reprintYear.toString()
      );
      formData.append(
        "bookUpdateRequest.ValueOfBook",
        form.valueOfBook.toString()
      );

      if (bookImage) {
        formData.append("BookImage", bookImage);
      }

      await onSubmit(form.idBook, formData);
      message.success("Cập nhật sách thành công");
      onClose();
    } catch (err) {
      message.error("Cập nhật sách thất bại");
    }
  };

  return (
    <Modal
      title="Cập nhật thông tin sách"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="flex justify-center">
          {previewImage ? (
            <img
              src={previewImage}
              alt="book"
              className="w-32 h-48 object-cover rounded shadow"
            />
          ) : (
            <div className="w-32 h-48 bg-gray-200 flex items-center justify-center rounded">
              <span className="text-sm text-gray-500">Chưa có ảnh</span>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="text-sm"
        />

        <input
          type="text"
          name="nameHeaderBook"
          value={form.nameHeaderBook}
          onChange={handleChange}
          placeholder="Tên sách"
          className="w-full px-4 py-2 border rounded text-sm"
        />

        <input
          type="text"
          name="publisher"
          value={form.publisher}
          onChange={handleChange}
          placeholder="Nhà xuất bản"
          className="w-full px-4 py-2 border rounded text-sm"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="reprintYear"
            value={form.reprintYear}
            onChange={handleChange}
            placeholder="Năm tái bản"
            className="w-full px-4 py-2 border rounded text-sm"
          />
          <select
            name="idTypeBook"
            value={form.idTypeBook}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded text-sm"
          >
            <option value="">-- Chọn thể loại --</option>
            {typeBooks.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="number"
          name="valueOfBook"
          value={form.valueOfBook}
          onChange={handleChange}
          placeholder="Trị giá"
          className="w-full px-4 py-2 border rounded text-sm"
        />

        <textarea
          name="describeBook"
          value={form.describeBook}
          onChange={handleChange}
          placeholder="Mô tả sách"
          className="w-full px-4 py-2 border rounded text-sm"
          rows={3}
        />

        <select
          name="idAuthors"
          multiple
          value={form.idAuthors}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-sm h-[100px] overflow-y-auto"
        >
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.nameAuthor}
            </option>
          ))}
        </select>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
          >
            {isLoading ? <Spin size="small" /> : "Cập nhật"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateBookModal;
