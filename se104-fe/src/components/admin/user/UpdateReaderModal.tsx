import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";

interface IUpdateReaderModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    nameReader: string;
    email: string;
    dob: string;
    sex: string;
    address: string;
    phone: string;
    idTypeReader: string;
    urlAvatar?: string | null;
    avatarImage?: File;
    readerPassword: string;
  };
  typeReaderOptions: { value: string; label: string }[];
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
}

const UpdateReaderModal: React.FC<IUpdateReaderModalProps> = ({
  open,
  onClose,
  initialData,
  typeReaderOptions,
  onSubmit,
  isLoading,
}) => {
  const [form, setForm] = useState({ ...initialData });
  const [preview, setPreview] = useState(initialData.urlAvatar || "");
  useEffect(() => {
    const formattedDob = initialData.dob.split("T")[0];
    setForm({ ...initialData, dob: formattedDob });
    setPreview(initialData.urlAvatar || "");
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    if (files?.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, avatarImage: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("NameReader", form.nameReader);
    formData.append("Email", form.email);
    formData.append("Dob", new Date(form.dob).toISOString());

    formData.append("Sex", form.sex);
    formData.append("Address", form.address);
    formData.append("Phone", form.phone);
    formData.append("IdTypeReader", form.idTypeReader);
    formData.append("ReaderPassword", form.readerPassword || "123456");
    if (form.avatarImage) {
      formData.append("AvatarImage", form.avatarImage);
    }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit(formData);
  };

  return (
    <Modal
      title="Cập nhật thông tin độc giả"
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
        <div className="flex gap-4 items-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                Chưa có ảnh
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            name="avatarImage"
            onChange={handleChange}
            className="text-sm"
          />
        </div>

        <input
          type="text"
          name="nameReader"
          value={form.nameReader}
          onChange={handleChange}
          placeholder="Họ tên độc giả"
          className="w-full px-4 py-2 border rounded text-sm"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded text-sm"
        />
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-sm"
        />
        <select
          name="sex"
          value={form.sex}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-sm"
        >
          <option value="">-- Chọn giới tính --</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Địa chỉ"
          className="w-full px-4 py-2 border rounded text-sm"
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Số điện thoại"
          className="w-full px-4 py-2 border rounded text-sm"
        />
        <select
          name="idTypeReader"
          value={form.idTypeReader}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded text-sm"
        >
          <option value="">-- Chọn loại độc giả --</option>
          {typeReaderOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded text-sm font-semibold flex items-center gap-2 justify-center ${
              isLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#153D36] text-white"
            }`}
          >
            {isLoading ? <Spin size="small" /> : "Cập nhật"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateReaderModal;
