import { Spin } from "antd";
const AuthorForm = ({
  form,
  onChange,
  onSubmit,
  preview,
  setPreview,
  typeBookOptions,
  isLoading,
  fileInputRef,
}: any) => {
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
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
              onChange({ target: { name: "AvatarImage", value: file } });
            }
          }}
          className="text-sm"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-[#153D36] text-white rounded hover:bg-gray-700 text-sm font-medium transition"
        >
          Chọn ảnh tác giả
        </button>
      </div>
      <input
        type="text"
        name="NameAuthor"
        value={form.NameAuthor}
        onChange={onChange}
        placeholder="Tên tác giả"
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <input
        type="text"
        name="Nationality"
        value={form.Nationality}
        onChange={onChange}
        placeholder="Quốc tịch"
        className="w-full px-4 py-2 border rounded outline-none text-sm"
      />
      <select
        name="IdTypeBook"
        value={form.IdTypeBook}
        onChange={onChange}
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
        name="Biography"
        value={form.Biography}
        onChange={onChange}
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
          {isLoading ? <Spin size="small" /> : "Thêm tác giả"}
        </button>
      </div>
    </form>
  );
};

export default AuthorForm;
