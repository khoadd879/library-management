import React, { useState, useEffect } from "react";
import { Modal, Spin } from "antd";

interface IUpdateAuthorModalProps {
  open: boolean;
  onClose: () => void;
  initialData: {
    nameAuthor: string;
    nationality: string;
    idTypeBook: string;
    biography: string;
    urlAvatar?: string | null;
    avatarImage?: File;
  };
  typeBookOptions: { value: string; label: string }[];
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const UpdateAuthorModal: React.FC<IUpdateAuthorModalProps> = ({
  open,
  onClose,
  initialData,
  typeBookOptions,
  onSubmit,
  isLoading,
}) => {
  const [form, setForm] = useState({ ...initialData });
  const [preview, setPreview] = useState(initialData.urlAvatar || "");

  useEffect(() => {
    setForm({ ...initialData });
    setPreview(initialData.urlAvatar || "");
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as any;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, avatarImage: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("NameAuthor", form.nameAuthor);
    formData.append("Nationality", form.nationality);
    formData.append("IdTypeBook", form.idTypeBook);
    formData.append("Biography", form.biography);
    if (form.avatarImage) {
      formData.append("AvatarImage", form.avatarImage);
    }
    onSubmit(formData);
  };

  return (
    <Modal
      title="Cập nhật tác giả"
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
              <span className="text-sm flex justify-center items-center h-full text-gray-500">
                Chưa có ảnh
              </span>
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
          name="nameAuthor"
          value={form.nameAuthor}
          onChange={handleChange}
          placeholder="Tên tác giả"
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
        <input
          type="text"
          name="nationality"
          value={form.nationality}
          onChange={handleChange}
          placeholder="Quốc tịch"
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
        <select
          name="idTypeBook"
          value={form.idTypeBook}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        >
          <option value="">-- Chọn thể loại sách --</option>
          {typeBookOptions?.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <textarea
          name="biography"
          value={form.biography}
          onChange={handleChange}
          placeholder="Tiểu sử"
          className="w-full px-4 py-2 border rounded outline-none text-sm"
        />
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

export default UpdateAuthorModal;
