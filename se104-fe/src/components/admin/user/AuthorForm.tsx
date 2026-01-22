import { Spin } from "antd";
import {
  User,
  Globe,
  BookOpen,
  FileText,
  Camera,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface AuthorFormProps {
  form: any;
  onChange: (e: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  preview: string | null;
  setPreview: (url: string | null) => void;
  typeBookOptions: any[];
  isLoading: boolean;
  fileInputRef: any;
  errors?: { [key: string]: string }; // Nhận lỗi từ cha
}

const AuthorForm = ({
  form,
  onChange,
  onSubmit,
  preview,
  setPreview,
  typeBookOptions,
  isLoading,
  fileInputRef,
  errors,
}: AuthorFormProps) => {
  return (
    <form onSubmit={onSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* --- Avatar Upload Section --- */}
      <div
        className={`flex flex-col items-center sm:flex-row sm:gap-8 bg-gray-50/50 p-6 rounded-2xl border border-dashed transition-all
        ${errors?.AvatarImage ? "border-red-500 bg-red-50/30" : "border-gray-200"}`}
      >
        <div className="relative group">
          <div
            className={`w-32 h-32 bg-white rounded-2xl overflow-hidden border-4 shadow-lg ring-1 relative transition-all
            ${errors?.AvatarImage ? "border-red-500 ring-red-200" : "border-white ring-gray-100"}`}
          >
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-gray-400 bg-gray-50">
                <User size={40} strokeWidth={1} />
                <span className="text-[10px] uppercase font-bold tracking-wider mt-2">
                  No Photo
                </span>
              </div>
            )}

            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left space-y-2 flex-1">
          <h3
            className={`text-lg font-bold ${errors?.AvatarImage ? "text-red-600" : "text-gray-800"}`}
          >
            Ảnh đại diện <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Dùng định dạng .jpg, .png. Kích thước tối đa 2MB.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white border rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95
            ${
              errors?.AvatarImage
                ? "border-red-300 text-red-600 hover:bg-red-50"
                : "border-gray-200 text-[#153D36] hover:bg-[#153D36] hover:text-white hover:border-[#153D36]"
            }`}
          >
            <Camera size={16} />
            Thay đổi ảnh
          </button>

          {/* Hiện lỗi Avatar */}
          {errors?.AvatarImage && (
            <p className="text-red-500 text-sm font-medium flex items-center justify-center sm:justify-start gap-1 mt-1 animate-pulse">
              <AlertCircle size={14} /> {errors.AvatarImage}
            </p>
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
              onChange({
                target: { name: "AvatarImage", value: file, files: [file] },
              });
            }
          }}
        />
      </div>

      {/* --- Form Fields --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Helper function để render input cho gọn */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <User size={14} className="text-[#153D36]" /> Họ và tên{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="NameAuthor"
            value={form.NameAuthor}
            onChange={onChange}
            placeholder="Ví dụ: Nguyễn Nhật Ánh"
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm font-medium
                ${
                  errors?.NameAuthor
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 bg-red-50/20"
                    : "border-gray-200 focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white"
                }`}
          />
          {errors?.NameAuthor && (
            <p className="text-red-500 text-xs ml-1 font-medium flex items-center gap-1">
              <AlertCircle size={12} /> {errors.NameAuthor}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Globe size={14} className="text-[#153D36]" /> Quốc tịch{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="Nationality"
            value={form.Nationality}
            onChange={onChange}
            placeholder="Ví dụ: Việt Nam"
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm font-medium
                ${
                  errors?.Nationality
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 bg-red-50/20"
                    : "border-gray-200 focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white"
                }`}
          />
          {errors?.Nationality && (
            <p className="text-red-500 text-xs ml-1 font-medium flex items-center gap-1">
              <AlertCircle size={12} /> {errors.Nationality}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <BookOpen size={14} className="text-[#153D36]" /> Thể loại sáng tác{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              name="IdTypeBook"
              value={form.IdTypeBook}
              onChange={onChange}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm font-medium appearance-none cursor-pointer
                ${
                  errors?.IdTypeBook
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 bg-red-50/20"
                    : "border-gray-200 focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white"
                }`}
            >
              <option value="">-- Chọn thể loại sách --</option>
              {typeBookOptions?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {errors?.IdTypeBook && (
            <p className="text-red-500 text-xs ml-1 font-medium flex items-center gap-1">
              <AlertCircle size={12} /> {errors.IdTypeBook}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <FileText size={14} className="text-[#153D36]" /> Tiểu sử{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            name="Biography"
            value={form.Biography}
            onChange={onChange}
            rows={4}
            placeholder="Giới thiệu về tác giả..."
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm font-medium resize-none
                ${
                  errors?.Biography
                    ? "border-red-500 focus:ring-4 focus:ring-red-500/10 focus:border-red-500 bg-red-50/20"
                    : "border-gray-200 focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white"
                }`}
          />
          {errors?.Biography && (
            <p className="text-red-500 text-xs ml-1 font-medium flex items-center gap-1">
              <AlertCircle size={12} /> {errors.Biography}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 flex justify-end border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative overflow-hidden px-10 py-3.5 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg flex items-center gap-3 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#153D36] text-white hover:bg-[#1a4a42] hover:-translate-y-0.5"
          }`}
        >
          {isLoading ? <Spin size="small" /> : <ShieldCheck size={18} />}
          <span>{isLoading ? "Đang xử lý..." : "Lưu thông tin tác giả"}</span>
        </button>
      </div>
    </form>
  );
};

export default AuthorForm;
