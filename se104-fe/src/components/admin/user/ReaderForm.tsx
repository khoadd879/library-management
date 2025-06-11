import React from "react";

interface ReaderFormProps {
  form: any;
  onChange: (
    e: React.ChangeEvent<any> | { target: { name: string; value: any } }
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  preview: string | null;
  setPreview: (url: string | null) => void;
  typeReaderOptions: { value: string; label: string }[];
  isLoading: boolean;
}

const ReaderForm = ({
  form,
  onChange,
  onSubmit,
  preview,
  setPreview,
  typeReaderOptions,
}: ReaderFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4"
    >
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
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
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
              onChange({ target: { name: "AvatarImage", value: file } });
            }
          }}
          className="text-sm"
        />
      </div>

      <select
        name="IdTypeReader"
        value={form.IdTypeReader}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      >
        <option value="">-- Chọn loại độc giả --</option>
        {typeReaderOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <input
        type="text"
        name="NameReader"
        value={form.NameReader}
        onChange={onChange}
        placeholder="Họ và tên"
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <input
        type="email"
        name="Email"
        value={form.Email}
        onChange={onChange}
        placeholder="Email"
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <input
        type="date"
        name="Dob"
        value={form.Dob}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <select
        name="Sex"
        value={form.Sex}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      >
        <option value="">-- Chọn giới tính --</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
      </select>
      <input
        type="text"
        name="Address"
        value={form.Address}
        onChange={onChange}
        placeholder="Địa chỉ"
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <input
        type="text"
        name="Phone"
        value={form.Phone}
        onChange={onChange}
        placeholder="Số điện thoại"
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <div className="pt-4 flex justify-center">
        <button
          type="submit"
          className="bg-[#153D36] text-white px-6 py-2 rounded text-sm font-semibold"
        >
          Thêm độc giả
        </button>
      </div>
    </form>
  );
};

export default ReaderForm;
